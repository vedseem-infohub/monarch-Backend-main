import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      default: "",
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    product: {
      id: { type: String },
      name: { type: String },
      sku: { type: String },
      image: { type: String },
      variant: { type: String },
      price: { type: Number },
    },
    reason: {
      type: String,
      required: true,
    },
    requestDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    status: {
      type: String,
      enum: ["Requested", "Approved", "Rejected", "Pickup Scheduled", "Received", "Refunded", "Exchanged"],
      default: "Requested",
      index: true,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    pickupAddress: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    inspectionNotes: {
      type: String,
      default: "",
    },
    timeline: [
      {
        status: String,
        date: String,
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ReturnRequest = mongoose.models.ReturnRequest || mongoose.model("ReturnRequest", returnSchema);
export default ReturnRequest;

