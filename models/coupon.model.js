import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      sparse: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat", "fixed"],
      default: "percentage",
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: String,
      default: "",
    },
    usageLimit: {
      type: Number,
      default: null,
      min: [1, "Usage limit must be at least 1"],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Disabled"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1, isActive: 1 });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;
