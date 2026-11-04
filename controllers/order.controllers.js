import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import { createShipment } from "../services/delhivery.js";

// Helper to format order for unified frontend consumption
const formatOrder = (order) => {
  const o = order.toObject ? order.toObject() : order;
  const orderNumber = o.orderNumber || o.orderId;
  const customerName = o.customerName || o.customer?.name || "Royal Patron";
  const customerEmail = o.customerEmail || o.customer?.email || "";
  const customerPhone = o.customerPhone || o.customer?.phone || "";

  const shippingAddress = o.shippingAddress?.city
    ? o.shippingAddress
    : {
        name: customerName,
        addressLine1: o.customer?.address || "",
        city: o.customer?.city || "Mumbai",
        state: o.customer?.state || "Maharashtra",
        postalCode: o.customer?.pincode || "400001",
        country: o.customer?.country || "India",
        phone: customerPhone,
      };

  const formattedItems = (o.items || []).map((item, idx) => ({
    id: item.id || `item-${idx}`,
    productId: String(item.productId),
    productName: item.productName || item.name || "Ensemble",
    sku: item.sku || `MNR-SKU-${idx + 1}`,
    image: item.image || item.imageUrl || "/images/moods/banarasi_brocade.jpg",
    variantColor: item.variantColor || "Heritage",
    variantSize: item.variantSize || item.quantity || "Standard",
    price: Number(item.price) || 0,
    quantity: Number(item.count || item.quantity) || 1,
    total: Number(item.total || (item.price * (item.count || item.quantity || 1))) || 0,
    customMeasurements: item.customMeasurements || null,
  }));

  return {
    ...o,
    id: String(o._id),
    orderNumber,
    customerId: o.userId ? String(o.userId) : o.customerId || "guest",
    customerName,
    customerEmail,
    customerPhone,
    orderDate: o.createdAt ? o.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    shippingAddress,
    billingAddress: o.billingAddress?.city ? o.billingAddress : shippingAddress,
    items: formattedItems,
    discount: o.discount || o.discountAmount || 0,
    shippingFee: o.shippingFee || o.shippingCost || 0,
    trackingNumber: o.trackingNumber || o.waybill || o.shipping?.waybill || "",
    courier: o.courier || o.shipping?.courier || "Delhivery Express",
    paymentMethod: o.paymentMethod || "cod",
    paymentStatus: o.paymentStatus || "Pending",
    razorpayOrderId: o.razorpayOrderId || "",
    razorpayPaymentId: o.razorpayPaymentId || "",
    timeline: o.timeline && o.timeline.length > 0 ? o.timeline : [
      {
        status: o.status || "Pending",
        message: "Order placed successfully by patron",
        timestamp: o.createdAt || new Date(),
        actor: "Patron",
      },
    ],
  };
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.userId || null;
    const body = req.body;

    const customer = body.customer || {
      name: body.fullName || body.customerName || "Patron",
      email: body.email || body.customerEmail || "",
      phone: body.phone || body.customerPhone || "",
      address: body.address || "",
      city: body.city || "Mumbai",
      state: body.state || "Maharashtra",
      pincode: body.pincode || "400001",
      country: body.country || "India",
    };

    if (!customer.name || !customer.phone) {
      return res.status(400).json({ message: "Customer name and phone are required." });
    }

    const items = body.items || [];
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item." });
    }

    const subtotal = Number(body.subtotal || body.total || 0);
    const total = Number(body.total || subtotal);

    // Generate custom luxury order number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = body.orderNumber || body.orderId || `MNR-2026-${randomSuffix}`;
    const orderId = orderNumber;

    const shippingAddress = body.shippingAddress || {
      name: customer.name,
      addressLine1: customer.address || body.address || "",
      city: customer.city || body.city || "Mumbai",
      state: customer.state || body.state || "Maharashtra",
      postalCode: customer.pincode || body.pincode || "400001",
      country: customer.country || body.country || "India",
      phone: customer.phone,
    };

    const initialTimeline = [
      {
        status: "Pending",
        message: "Order placed in atelier queue awaiting concierge review",
        timestamp: new Date(),
        actor: "Patron Checkout",
      },
    ];

    const newOrder = await Order.create({
      userId,
      orderId,
      orderNumber,
      customer,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress,
      billingAddress: body.billingAddress || shippingAddress,
      items: items.map((i) => ({
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
      subtotal,
      discountAmount: Number(body.discount || body.discountAmount || 0),
      discount: Number(body.discount || body.discountAmount || 0),
      promoCode: body.promoCode || "",
      shippingCost: Number(body.shippingCost || body.shippingFee || 0),
      shippingFee: Number(body.shippingFee || body.shippingCost || 0),
      tax: Number(body.tax || 0),
      total,
      paymentMethod: body.paymentMethod || "cod",
      paymentStatus: body.paymentStatus || (body.paymentMethod === "cod" ? "Pending" : "Paid"),
      status: body.status || "Pending",
      internalStatus: "ORDER_CREATED",
      timeline: initialTimeline,
      internalNotes: body.specialBespokeNotes ? [body.specialBespokeNotes] : [],
      source: body.source || "storefront",
    });

    // Increment coupon usage count if coupon applied
    if (body.promoCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: body.promoCode.trim().toUpperCase() },
          { $inc: { usedCount: 1 } }
        );
      } catch (couponErr) {
        console.warn("Could not increment coupon:", couponErr.message);
      }
    }

    // Clear cart if authenticated
    if (userId) {
      try {
        await Cart.findOneAndUpdate({ userId }, { items: [] });
      } catch (e) {
        console.warn("Cart clear warning:", e.message);
      }
    }

    // Reduce stock for products
    for (const item of items) {
      try {
        const pId = String(item.productId || item.id);
        const count = Number(item.count || item.quantity) || 1;
        await Product.findOneAndUpdate(
          { $or: [{ id: pId }, { slug: pId.toLowerCase() }] },
          { $inc: { stock: -count, sold: count } }
        );
      } catch (stockErr) {
        console.warn("Stock update error:", stockErr.message);
      }
    }

    // Auto-create Delhivery shipment & Waybill (AWB) for the order
    try {
      const shipResult = await createShipment({
        orderId,
        customer,
        items,
        total,
        paymentMethod: body.paymentMethod || "cod",
        weight: (items || []).reduce((sum, i) => sum + (Number(i.count || i.quantity) || 1) * 500, 0),
        _id: newOrder._id,
      });

      if (shipResult.success && shipResult.data?.waybill) {
        const refreshedOrder = await Order.findById(newOrder._id);
        if (refreshedOrder) {
          return res.status(201).json(formatOrder(refreshedOrder));
        }
      }
    } catch (shipErr) {
      console.warn("[Delhivery Order] Auto shipment creation note:", shipErr.message);
    }

    return res.status(201).json(formatOrder(newOrder));
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: `Create order error: ${error.message}` });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders.map(formatOrder));
  } catch (error) {
    return res.status(500).json({ message: `Get orders error: ${error.message}` });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search, limit } = req.query;
    let filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }
    if (paymentStatus && paymentStatus !== "All") {
      filter.paymentStatus = paymentStatus;
    }
    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { orderNumber: searchRegex },
        { orderId: searchRegex },
        { "customer.name": searchRegex },
        { customerName: searchRegex },
        { "customer.email": searchRegex },
        { customerEmail: searchRegex },
      ];
    }

    let query = Order.find(filter).sort({ createdAt: -1 });
    if (limit) {
      query = query.limit(Number(limit));
    }

    const orders = await query;
    return res.status(200).json(orders.map(formatOrder));
  } catch (error) {
    return res.status(500).json({ message: `Get all orders error: ${error.message}` });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const queryConditions = [
      { orderNumber: orderId },
      { orderId },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      queryConditions.push({ _id: orderId });
    }

    const order = await Order.findOne({ $or: queryConditions });
    if (!order) {
      return res.status(404).json({ message: `Order '${orderId}' not found` });
    }

    return res.status(200).json(formatOrder(order));
  } catch (error) {
    return res.status(500).json({ message: `Get order error: ${error.message}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, courier, paymentStatus, note } = req.body;

    const queryConditions = [
      { orderNumber: orderId },
      { orderId },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      queryConditions.push({ _id: orderId });
    }

    const order = await Order.findOne({ $or: queryConditions });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.status = status;
      order.timeline.push({
        status,
        message: note || `Order status updated to ${status}`,
        timestamp: new Date(),
        actor: req.user?.name || "Admin Concierge",
      });
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courier) order.courier = courier;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (note) order.internalNotes.push(note);

    await order.save();
    return res.status(200).json(formatOrder(order));
  } catch (error) {
    return res.status(500).json({ message: `Update status error: ${error.message}` });
  }
};

export const updateOrderShipping = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courier, trackingNumber } = req.body;

    const queryConditions = [
      { orderNumber: orderId },
      { orderId },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      queryConditions.push({ _id: orderId });
    }

    const order = await Order.findOne({ $or: queryConditions });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (courier) order.courier = courier;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.status = "Shipped";
    order.timeline.push({
      status: "Shipped",
      message: `Dispatched via ${courier || "Courier"} AWB #${trackingNumber || "Pending"}`,
      timestamp: new Date(),
      actor: "Shipping Desk",
    });

    await order.save();
    return res.status(200).json(formatOrder(order));
  } catch (error) {
    return res.status(500).json({ message: `Update shipping error: ${error.message}` });
  }
};

export const addOrderNote = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const queryConditions = [
      { orderNumber: orderId },
      { orderId },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      queryConditions.push({ _id: orderId });
    }

    const order = await Order.findOne({ $or: queryConditions });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.internalNotes.push(note);
    await order.save();
    return res.status(200).json(formatOrder(order));
  } catch (error) {
    return res.status(500).json({ message: `Add note error: ${error.message}` });
  }
};

export const getOrderInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      $or: [{ orderNumber: orderId }, { orderId }, ...(/^[0-9a-fA-F]{24}$/.test(orderId) ? [{ _id: orderId }] : [])],
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({
      invoiceNumber: order.invoiceNumber || `INV-${order.orderNumber || order.orderId}`,
      date: order.createdAt,
      order: formatOrder(order),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
