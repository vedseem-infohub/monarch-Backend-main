import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import { createShipment } from "../services/delhivery.js";

// Utility to reduce stock
const reduceStock = async (items) => {
  for (const item of items) {
    await Product.findOneAndUpdate(
      { id: item.productId },
      { $inc: { stock: -item.count, sold: item.count } }
    );
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Razorpay Order error:", error);
    res.status(500).json({ message: `Razorpay error: ${error.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails, // This contains the same data as what was sent for COD order
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature!" });
    }

    // Payment is valid, now create the order
    const {
      customer,
      items,
      subtotal,
      discountAmount,
      promoCode,
      shippingCost,
      total,
      paymentMethod,
      source,
    } = orderDetails;

    // Generate custom orderId if not provided by the client
    const orderId = orderDetails.orderId || orderDetails.orderNumber || "MNR-2026-" + Math.floor(1000 + Math.random() * 9000);
    const orderNumber = orderDetails.orderNumber || orderId;

    const shippingAddress = orderDetails.shippingAddress || {
      name: customer?.name || "",
      addressLine1: customer?.address || "",
      city: customer?.city || "Mumbai",
      state: customer?.state || "Maharashtra",
      postalCode: customer?.pincode || "400001",
      country: customer?.country || "India",
      phone: customer?.phone || "",
    };

    const initialTimeline = [
      {
        status: "Paid",
        message: `Payment authorized via Razorpay (${razorpay_payment_id})`,
        timestamp: new Date(),
        actor: "Razorpay Gateway",
      },
      {
        status: "Processing",
        message: "Order placed in atelier queue awaiting bespoke dispatch",
        timestamp: new Date(),
        actor: "Patron Checkout",
      },
    ];

    const newOrder = await Order.create({
      userId: userId || null,
      orderId,
      orderNumber,
      customer,
      customerName: customer?.name || "",
      customerEmail: customer?.email || "",
      customerPhone: customer?.phone || "",
      shippingAddress,
      billingAddress: orderDetails.billingAddress || shippingAddress,
      items: (items || []).map((i) => ({
        productId: String(i.productId || i.id || "monarch-001"),
        name: i.name || i.productName || "Ensemble",
        productName: i.productName || i.name || "Ensemble",
        sku: i.sku || `MNR-${Date.now().toString().slice(-4)}`,
        price: Number(i.price) || 0,
        quantity: i.quantity || i.count || 1,
        count: Number(i.count || i.quantity) || 1,
        imageUrl: i.image || i.imageUrl || "",
        image: i.image || i.imageUrl || "",
        variantColor: i.variantColor || i.color || "",
        variantSize: i.variantSize || i.size || "",
        customMeasurements: i.customMeasurements || null,
        total: Number(i.total || (Number(i.price) * (Number(i.count || i.quantity) || 1))),
      })),
      subtotal: Number(subtotal || 0),
      discountAmount: Number(discountAmount || 0),
      discount: Number(discountAmount || 0),
      promoCode: promoCode || "",
      shippingCost: Number(shippingCost || 0),
      shippingFee: Number(shippingCost || 0),
      total: Number(total || 0),
      paymentMethod: paymentMethod || "razorpay",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "Processing",
      internalStatus: "PAYMENT_CONFIRMED",
      timeline: initialTimeline,
      internalNotes: orderDetails.specialBespokeNotes ? [orderDetails.specialBespokeNotes] : [],
      source: source || "storefront",
    });

    // Reduce stock
    if (items && items.length > 0) {
      await reduceStock(items);
    }

    // Increment coupon usage count if coupon applied
    if (promoCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: promoCode.trim().toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      } catch (couponErr) {
        console.warn("Could not increment coupon usage:", couponErr.message);
      }
    }

    // Clear the cart on backend after order is created successfully
    if (userId) {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
    }

    // Generate Delhivery shipment & Waybill (AWB) for prepaid order
    try {
      const shipResult = await createShipment({
        orderId,
        customer,
        items,
        total,
        paymentMethod: "online",
        weight: (items || []).reduce((sum, i) => sum + (Number(i.count) || 1) * 500, 0),
        _id: newOrder._id,
      });

      if (shipResult.success && shipResult.data?.waybill) {
        const refreshedOrder = await Order.findById(newOrder._id);
        return res.status(201).json({
          message: "Payment verified successfully",
          order: refreshedOrder || newOrder,
        });
      }
    } catch (shipErr) {
      console.warn("[Delhivery Prepaid] Auto shipment creation note:", shipErr.message);
    }

    return res.status(201).json({ message: "Payment verified successfully", order: newOrder });
  } catch (error) {
    console.error("Verify Payment error:", error);
    return res.status(500).json({ message: `Verify Payment error: ${error.message}` });
  }
};

export const webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Express raw body is needed to compute signature properly, but Razorpay webhooks 
    // work with raw body string or we can use the library's utility
    const signature = req.headers["x-razorpay-signature"];
    
    // We expect express.json() was used. We can stringify req.body or better, if the webhook 
    // verifies properly using crypto HMAC on JSON stringified body (might have ordering issues).
    // For safety, Razorpay utility:
    const isValid = Razorpay.validateWebhookSignature(
      JSON.stringify(req.body),
      signature,
      secret
    );

    if (isValid) {
      const event = req.body.event;
      if (event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        const razorpay_order_id = payment.order_id;
        
        // Update order status if needed. 
        // Note: We already mark as 'Paid' in verifyPayment. This webhook acts as a fallback.
        await Order.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { paymentStatus: "Paid" }
        );
      } else if (event === "payment.failed") {
        const payment = req.body.payload.payment.entity;
        const razorpay_order_id = payment.order_id;

        await Order.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          { paymentStatus: "Failed" }
        );
      }
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "invalid signature" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Webhook error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const payments = orders.map((o) => {
      const isSettled =
        o.paymentStatus === "Paid" ||
        o.paymentStatus === "Settled" ||
        o.status === "Delivered";
      const isRefunded =
        o.paymentStatus === "Refunded" || o.status === "Refunded";
      const isFailed =
        o.paymentStatus === "Failed" || o.status === "Cancelled";
      const status = isRefunded
        ? "Refunded"
        : isFailed
        ? "Failed"
        : isSettled
        ? "Settled"
        : "Captured";

      const amount = Number(o.total) || 0;
      const gatewayFee = Math.round(amount * 0.02);
      const tax = Math.round(gatewayFee * 0.18);
      const netSettlement = isRefunded ? -amount : isFailed ? 0 : amount - (gatewayFee + tax);

      const isCod =
        !o.paymentMethod ||
        o.paymentMethod.toLowerCase().includes("cod") ||
        o.paymentMethod.toLowerCase().includes("cash");

      return {
        id: `pay-${o._id.toString()}`,
        transactionRef:
          o.razorpayPaymentId || `tx_${o.orderId || o._id.toString().slice(-8)}`,
        orderNumber: o.orderNumber || o.orderId,
        customerName: o.customer?.name || o.customerName || "Bespoke Patron",
        paymentGateway: isCod ? "Standard Chartered Wire" : "Razorpay",
        method: isCod ? "NEFT / RTGS" : "Credit Card",
        amount,
        currency: "INR",
        status,
        gatewayFee,
        tax,
        netSettlement,
        timestamp: o.createdAt
          ? o.createdAt.toISOString()
          : new Date().toISOString(),
        ...(isRefunded ? { refundRef: `rfnd_${o._id.toString().slice(-6)}` } : {}),
      };
    });

    return res.status(200).json(payments);
  } catch (error) {
    console.error("getAllPayments error:", error);
    return res.status(500).json({ message: `Get payments error: ${error.message}` });
  }
};
