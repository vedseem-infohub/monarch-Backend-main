import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
    },
    sku: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: mongoose.Schema.Types.Mixed,
      default: 1,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    variantColor: {
      type: String,
      default: "",
    },
    variantSize: {
      type: String,
      default: "",
    },
    customMeasurements: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    total: {
      type: Number,
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    fullName: { type: String, default: "" },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "India" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const timelineEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    actor: { type: String, default: "System" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderNumber: {
      type: String,
      index: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "India" },
    },
    customerId: {
      type: String,
      default: "",
    },
    customerName: {
      type: String,
      default: "",
    },
    customerEmail: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    shippingAddress: {
      type: addressSchema,
      default: () => ({}),
    },
    billingAddress: {
      type: addressSchema,
      default: () => ({}),
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    promoCode: {
      type: String,
      default: "",
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "cod",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      index: true,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded", "Order Sent to Admin"],
      default: "Pending",
      index: true,
    },
    internalStatus: {
      type: String,
      default: "ORDER_CREATED",
      index: true,
    },
    trackingNumber: {
      type: String,
      default: "",
    },
    courier: {
      type: String,
      default: "BlueDart Apex Luxury Logistics",
    },
    waybill: {
      type: String,
      sparse: true,
      default: "",
    },
    shipmentStatus: {
      type: String,
      default: "unfulfilled",
    },
    labelUrl: {
      type: String,
      default: "",
    },
    internalNotes: {
      type: [String],
      default: [],
    },
    timeline: [timelineEventSchema],
    source: {
      type: String,
      default: "storefront",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
