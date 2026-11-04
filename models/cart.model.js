import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
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
      required: true,
      min: 1,
      default: 1,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    customMeasurements: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
