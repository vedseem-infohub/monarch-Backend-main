import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      sparse: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    nameHindi: {
      type: String,
      trim: true,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["women", "men", "all"],
      default: "all",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    active: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
