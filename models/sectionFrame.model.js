import mongoose from "mongoose";

const sectionFrameSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sectionKey: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    eyebrow: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    imageMobile: {
      type: String,
      default: "",
    },
    ctaText: {
      type: String,
      default: "",
    },
    ctaLink: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    tagline: {
      type: String,
      default: "",
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const SectionFrame = mongoose.model("SectionFrame", sectionFrameSchema);
export default SectionFrame;

