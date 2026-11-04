import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  badge: { type: String, default: "100% Natural & Organic" },
  title1: { type: String, default: "Dronagiri" },
  title2: { type: String, default: "Farm" },
  tagline: {
    type: String,
    default:
      "From our fields to your kitchen — pure, unprocessed, farm-fresh goodness.",
  },
  primaryCtaText: { type: String, default: "🛒 Shop Products" },
  primaryCtaLink: { type: String, default: "/products" },
  secondaryCtaText: { type: String, default: "Our Story ↓" },
  secondaryCtaLink: { type: String, default: "/about" },
});

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "Co-Founder" },
  title: { type: String, default: "" },
  qualification: { type: String, default: "" },
  location: { type: String, default: "" },
  image: { type: String, default: "" },
  badgeClass: { type: String, default: "bg-[#8C6A43] text-white" },
  paragraphs: [{ type: String }],
  quote: { type: String, default: "" },
  youtubeUrl: { type: String, default: "" },
  instagramUrl: { type: String, default: "" },
});

const pageHeroSchema = new mongoose.Schema({
  image: { type: String, default: "" },
  badge: { type: String, default: "" },
  heading: { type: String, default: "" },
  paragraph: { type: String, default: "" },
});

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    storeName: { type: String, default: "MONARCH Haute Couture Atelier" },
    legalEntity: { type: String, default: "Monarch Royal Luxury Ethnic Wear Private Limited" },
    gstin: { type: String, default: "27AABCM8920K1ZX" },
    supportEmail: { type: String, default: "concierge@monarch-couture.in" },
    supportPhone: { type: String, default: "+91 22 6984 4000" },
    conciergeWhatsApp: { type: String, default: "+91 98200 44590" },
    currency: { type: String, default: "INR (Indian Rupee)" },
    currencySymbol: { type: String, default: "₹" },
    timezone: { type: String, default: "Asia/Kolkata (IST +05:30)" },
    standardShippingFee: { type: Number, default: 2500 },
    freeShippingThreshold: { type: Number, default: 50000 },
    orderPrefix: { type: String, default: "MNR-2026" },
    brandPrimaryColor: { type: String, default: "#F7F5F0" },
    brandAccentColor: { type: String, default: "#B39458" },
    brandTagline: { type: String, default: "A Legacy Woven in Elegance — Sovereign Indian Haute Couture" },
    logoUrl: { type: String, default: "/images/brand/monarch_crest.png" },
    whatsappNumber: { type: String, default: "+91 98200 44590" },
    phoneNumber: { type: String, default: "+91 22 6984 4000" },
    address: { type: String, default: "The Darbar Hall, Mehrauli Heritage Corridor, New Delhi 110030" },
    instagramUrl: {
      type: String,
      default: "https://instagram.com/monarch_couture",
    },
    youtubeUrl: {
      type: String,
      default: "https://youtube.com/@monarchcouture",
    },
    heroSlides: [heroSlideSchema],
    founders: [founderSchema],
    productsHero: {
      type: pageHeroSchema,
      default: () => ({
        image: "/Artboard 2.png",
        badge: "Dronagiri Farm Products",
        heading: "Farm-Fresh Products",
        paragraph:
          "Pure grains, pulses, spices, oils, and natural staples sourced directly from our farm.",
      }),
    },
    aboutHero: {
      type: pageHeroSchema,
      default: () => ({
        image: "/about-hero.jpg",
        badge: "Est. 2018 · Dronagiri Farm",
        heading: "Bringing Pure Organic Goodness From Farm To Your Family",
        paragraph:
          "From the fertile fields of Dronagiri to your dining table — we nurture every seed with love, tradition, and unwavering commitment to purity.",
      }),
    },
    faqs: [
      {
        id: { type: String },
        question: { type: String },
        answer: { type: String },
        category: { type: String, default: "General" },
        displayOrder: { type: Number, default: 0 },
      },
    ],
    returnsPolicy: {
      title: { type: String, default: "Returns & Exchanges" },
      subtitle: { type: String, default: "Seamless exchange assistance handled by your personal concierge." },
      exchangeWindowDays: { type: Number, default: 7 },
      exchangeWindowDescription: { type: String, default: "Non-customized sarees, unstitched suit materials, and prêt wear can be exchanged within 7 days of delivery, provided original tags, hallmark silk seals, and luxury boxes remain untampered." },
      bespokePolicyHeadline: { type: String, default: "Bespoke Bridal Couture Policy" },
      bespokePolicyDescription: { type: String, default: "Due to individual handcrafting and custom sizing, bespoke bridal lehengas and tailored sherwanis are non-refundable. However, we offer complimentary atelier alterations until the fit is impeccable." },
      exchangeStepsHeadline: { type: String, default: "How to Request an Exchange" },
      exchangeStepsDescription: { type: String, default: "Connect with our Royal Concierge via WhatsApp at +91 98765 43210 or write to concierge@drift-silks.com. We arrange white-glove doorstep reverse pickup." },
      conciergeWhatsApp: { type: String, default: "+91 98765 43210" },
      conciergeEmail: { type: String, default: "concierge@drift-silks.com" },
      sections: [
        {
          title: { type: String },
          content: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
export default SiteSettings;
