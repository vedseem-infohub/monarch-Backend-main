import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    id: { type: String },
    sku: { type: String, default: "" },
    size: { type: String, required: true },
    color: { type: String, default: "" },
    quantity: { type: String, default: "1" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 5 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const colorVariantSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    hex: { type: String, required: true },
    imageIndex: { type: Number, default: 0 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    numericId: {
      type: Number,
      sparse: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    sku: {
      type: String,
      default: "",
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    categoryName: {
      type: String,
      default: "",
    },
    subcategory: {
      type: String,
      default: "",
    },
    collectionName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["women", "men", "unisex"],
      default: "women",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    regularPrice: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    status: {
      type: String,
      enum: ["Published", "Draft", "Archived"],
      default: "Published",
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isBridal: {
      type: Boolean,
      default: false,
    },
    isSixMoods: {
      type: Boolean,
      default: false,
    },
    isVaultSignature: {
      type: Boolean,
      default: false,
    },
    homepageVisibility: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    bestsellerRank: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageUrl2: {
      type: String,
      default: "",
    },
    colors: [colorVariantSchema],
    sizes: {
      type: [String],
      default: ["XS", "S", "M", "L", "XL", "Custom Bespoke"],
    },
    variants: [productVariantSchema],
    fabric: {
      type: String,
      default: "",
    },
    weavingTechnique: {
      type: String,
      default: "",
    },
    embroidery: {
      type: String,
      default: "",
    },
    craftsmanshipStory: {
      type: String,
      default: "",
    },
    loomStory: {
      type: String,
      default: "",
    },
    artisanInfo: {
      type: String,
      default: "",
    },
    careInstructions: {
      type: [String],
      default: [
        "Strictly Dry Clean Only by luxury couture specialist",
        "Store in provided breathable muslin bag away from direct sunlight",
        "Do not spray perfumes directly on metallic zari embroidery",
      ],
    },
    fitMeasurements: {
      type: String,
      default: "",
    },
    bespokeTailoring: {
      type: Boolean,
      default: true,
    },
    occasion: {
      type: [String],
      default: ["Bridal", "Royal Wedding", "Reception", "Gala"],
    },
    deliveryDays: {
      type: Number,
      default: 14,
    },
    has3D: {
      type: Boolean,
      default: false,
    },
    model3DConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    sectionMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    sectionKey: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    sectionFrameId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    urlSlug: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ active: 1, createdAt: -1 });
productSchema.index({ category: 1, active: 1, createdAt: -1 });
productSchema.index({ gender: 1, active: 1 });
productSchema.index({ isBestSeller: 1, active: 1 });
productSchema.index({ isNewArrival: 1, active: 1 });
productSchema.index({ isBridal: 1, active: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
