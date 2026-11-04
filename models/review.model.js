import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      sparse: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    productName: {
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Approved",
      index: true,
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;

