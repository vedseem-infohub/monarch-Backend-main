import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    fullName: {
      type: String,
      default: "Patron",
    },
    status: {
      type: String,
      enum: ["Subscribed", "Unsubscribed"],
      default: "Subscribed",
    },
    preferredCategories: {
      type: [String],
      default: ["Bridal Lehengas", "Banarasi Sarees"],
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;

