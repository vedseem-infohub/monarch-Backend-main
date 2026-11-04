import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    memberId: {
      type: String,
      default: () => `MNR-ROYAL-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    preferredSalon: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    landmark: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "admin", "super_admin", "store_manager", "inventory_manager", "sales_viewer", "support"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "VIP", "Royal Patron"],
      default: "active",
    },
    totalSpend: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    notes: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: ["Royal Patron"],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
