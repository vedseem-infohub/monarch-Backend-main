import SiteSettings from "../models/siteSettings.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

const DEFAULT_SETTINGS = {
  key: "default",
  storeName: "MONARCH Haute Couture Atelier",
  legalEntity: "Monarch Royal Luxury Ethnic Wear Private Limited",
  gstin: "27AABCM8920K1ZX",
  supportEmail: "concierge@monarch-couture.in",
  supportPhone: "+91 22 6984 4000",
  conciergeWhatsApp: "+91 98200 44590",
  currency: "INR (Indian Rupee)",
  currencySymbol: "₹",
  timezone: "Asia/Kolkata (IST +05:30)",
  standardShippingFee: 2500,
  freeShippingThreshold: 50000,
  orderPrefix: "MNR-2026",
  brandPrimaryColor: "#F7F5F0",
  brandAccentColor: "#B39458",
  brandTagline: "A Legacy Woven in Elegance — Sovereign Indian Haute Couture",
  logoUrl: "/images/brand/monarch_crest.png",
  whatsappNumber: "+91 98200 44590",
  phoneNumber: "+91 22 6984 4000",
  address: "The Darbar Hall, Mehrauli Heritage Corridor, New Delhi 110030",
  instagramUrl: "https://instagram.com/monarch_couture",
  youtubeUrl: "https://youtube.com/@monarchcouture",
  heroSlides: [
    {
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=1200&auto=format&fit=crop",
      badge: "Sovereign Haute Couture",
      title1: "A Legacy",
      title2: "Woven in Gold",
      tagline: "Awadhi zardozi, handwoven Banarasi weaves, and imperial wedding trousseaus.",
      primaryCtaText: "👑 Explore Bridal Edit",
      primaryCtaLink: "/collections/bridal-collection",
      secondaryCtaText: "Private Atelier ↓",
      secondaryCtaLink: "/#atelier",
    },
  ],
  founders: [
    {
      name: "Nitesh Bhasney",
      role: "Founder",
      title: "Founder, Dronagiri Farms",
      qualification: "Civil Engineer & Farmer",
      location: "Based in Noida · Started in Jhansi",
      image: "/niteshBhasney.jpg",
      badgeClass: "bg-[#223614] text-[#F7F1E8]",
      paragraphs: [
        "Based in Noida, Nitesh Bhasney is a Civil Engineer and Farmer who started his farming journey in Jhansi. With a vision to connect farmers, farms and families, he founded Dronagiri Farms.",
        "Today, Dronagiri Farms is actively working across India, with farming and sourcing initiatives in multiple regions, and has also delivered its products to customers outside India.",
      ],
      quote: "Building a trusted Farm-to-Family brand from India to the world. 🌱🌍",
      youtubeUrl: "https://youtube.com/@thenitesh1989?si=ujvjHrIab8OhW2VG",
      instagramUrl:
        "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
    },
    {
      name: "Shripad Indapurkar",
      role: "Co-Founder",
      title: "Co-Founder, Dronagiri Farms",
      qualification: "Civil Engineer",
      location: "Based in Noida",
      image: "/ShripadIndapurkar.jpg",
      badgeClass: "bg-[#8C6A43] text-white",
      paragraphs: [
        "Based in Noida, Shripad Indapurkar is a Civil Engineer with extensive corporate experience, having worked with leading companies and reached General Manager (GM) level in his professional career.",
        "With a deep interest and passion for farming and agriculture, he decided to bring his professional experience and passion for farming together, contributing to the creation and growth of Dronagiri Farms.",
        "Today, he is focused on building Dronagiri Farms into a modern, trusted and farmer-connected Farm-to-Family brand.",
      ],
      quote: "“Bringing Professional Experience to Modern Farming.” 🌱🏗️",
      youtubeUrl: "",
      instagramUrl:
        "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
    },
    {
      name: "Seema Bhasney",
      role: "Co-Founder",
      title: "Co-Founder, Dronagiri Farms",
      qualification: "LLB",
      location: "Based in Jhansi",
      image: "/SeemaBhasney.jpg",
      badgeClass: "bg-[#8C6A43] text-white",
      paragraphs: [
        "Based in Jhansi, Seema Bhasney is an LLB professional and socially active entrepreneur with a strong connection to rural communities and farmers. Through her social work and public engagement, she has worked to support farmers and help them understand and access their rights and opportunities.",
        "As Co-Founder of Dronagiri Farms, she brings a strong farmer-focused and community-driven perspective to the brand, working towards creating better opportunities and stronger connections between farmers and consumers.",
      ],
      quote: "“Empowering Farmers. Strengthening Communities.” 🌱🤝",
      youtubeUrl: "",
      instagramUrl:
        "https://www.instagram.com/dronagiri_farms?stkn=MW56NTE5dWZ0ZWhreg%3D%3D&utm_source=qr",
    },
  ],
  productsHero: {
    image: "/Artboard 2.png",
    badge: "Dronagiri Farm Products",
    heading: "Farm-Fresh Products",
    paragraph:
      "Pure grains, pulses, spices, oils, and natural staples sourced directly from our farm.",
  },
  aboutHero: {
    image: "/about-hero.jpg",
    badge: "Est. 2018 · Dronagiri Farm",
    heading: "Bringing Pure Organic Goodness From Farm To Your Family",
    paragraph:
      "From the fertile fields of Dronagiri to your dining table — we nurture every seed with love, tradition, and unwavering commitment to purity.",
  },
};

// Helper to upload image if base64, otherwise keep as is
async function resolveImageUpload(imgStr) {
  if (!imgStr || typeof imgStr !== "string") return imgStr;
  if (imgStr.startsWith("data:image/") || imgStr.startsWith("blob:")) {
    try {
      const uploadedUrl = await uploadOnCloudinary(imgStr);
      return uploadedUrl || imgStr;
    } catch (err) {
      console.error("Failed to upload base64 to Cloudinary:", err);
      return imgStr;
    }
  }
  return imgStr;
}

// GET /api/settings - Public retrieval of site settings
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: "default" });
    if (!settings) {
      settings = await SiteSettings.create(DEFAULT_SETTINGS);
    } else {
      let needsSave = false;
      if (!settings.productsHero || !settings.productsHero.image) {
        settings.productsHero = DEFAULT_SETTINGS.productsHero;
        needsSave = true;
      }
      if (!settings.aboutHero || !settings.aboutHero.image) {
        settings.aboutHero = DEFAULT_SETTINGS.aboutHero;
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
      }
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("getSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
      error: error.message,
    });
  }
};

// PUT /api/settings - Admin update with automatic Cloudinary uploads
export const updateSettings = async (req, res) => {
  try {
    const {
      logoUrl,
      whatsappNumber,
      phoneNumber,
      address,
      instagramUrl,
      youtubeUrl,
      heroSlides,
      founders,
      productsHero,
      aboutHero,
    } = req.body;

    let settings = await SiteSettings.findOne({ key: "default" });
    if (!settings) {
      settings = new SiteSettings({ key: "default" });
    }

    // Process Logo if changed to base64
    if (logoUrl !== undefined) {
      settings.logoUrl = await resolveImageUpload(logoUrl);
    }

    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
    if (phoneNumber !== undefined) settings.phoneNumber = phoneNumber;
    if (address !== undefined) settings.address = address;
    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
    if (youtubeUrl !== undefined) settings.youtubeUrl = youtubeUrl;

    // Process Hero Slides
    if (Array.isArray(heroSlides)) {
      const processedSlides = [];
      for (const slide of heroSlides) {
        const resolvedImage = await resolveImageUpload(slide.image);
        processedSlides.push({
          image: resolvedImage || "/Artboard 3.png",
          badge: slide.badge || "100% Natural & Organic",
          title1: slide.title1 || "Dronagiri",
          title2: slide.title2 || "Farm",
          tagline: slide.tagline || "",
          primaryCtaText: slide.primaryCtaText || "🛒 Shop Products",
          primaryCtaLink: slide.primaryCtaLink || "/products",
          secondaryCtaText: slide.secondaryCtaText || "Our Story ↓",
          secondaryCtaLink: slide.secondaryCtaLink || "/about",
        });
      }
      settings.heroSlides = processedSlides;
    }

    // Process Founders
    if (Array.isArray(founders)) {
      const processedFounders = [];
      for (const founder of founders) {
        const resolvedImage = await resolveImageUpload(founder.image);
        const paras = Array.isArray(founder.paragraphs)
          ? founder.paragraphs
          : typeof founder.paragraphs === "string"
          ? founder.paragraphs
              .split("\n\n")
              .map((p) => p.trim())
              .filter(Boolean)
          : [];

        processedFounders.push({
          name: founder.name || "Founder Name",
          role: founder.role || "Co-Founder",
          title: founder.title || "",
          qualification: founder.qualification || "",
          location: founder.location || "",
          image: resolvedImage || "/founder.jpg",
          badgeClass:
            founder.role === "Founder"
              ? "bg-[#223614] text-[#F7F1E8]"
              : "bg-[#8C6A43] text-white",
          paragraphs: paras,
          quote: founder.quote || "",
          youtubeUrl: founder.youtubeUrl || "",
          instagramUrl: founder.instagramUrl || "",
        });
      }
      settings.founders = processedFounders;
    }

    // Process Products Hero
    if (productsHero && typeof productsHero === "object") {
      const resolvedImg = await resolveImageUpload(productsHero.image);
      settings.productsHero = {
        image: resolvedImg || settings.productsHero?.image || "/Artboard 2.png",
        badge:
          productsHero.badge !== undefined
            ? productsHero.badge
            : settings.productsHero?.badge || "Dronagiri Farm Products",
        heading:
          productsHero.heading !== undefined
            ? productsHero.heading
            : settings.productsHero?.heading || "Farm-Fresh Products",
        paragraph:
          productsHero.paragraph !== undefined
            ? productsHero.paragraph
            : settings.productsHero?.paragraph ||
              "Pure grains, pulses, spices, oils, and natural staples sourced directly from our farm.",
      };
    }

    // Process About Hero
    if (aboutHero && typeof aboutHero === "object") {
      const resolvedImg = await resolveImageUpload(aboutHero.image);
      settings.aboutHero = {
        image: resolvedImg || settings.aboutHero?.image || "/about-hero.jpg",
        badge:
          aboutHero.badge !== undefined
            ? aboutHero.badge
            : settings.aboutHero?.badge || "Est. 2018 · Dronagiri Farm",
        heading:
          aboutHero.heading !== undefined
            ? aboutHero.heading
            : settings.aboutHero?.heading ||
              "Bringing Pure Organic Goodness From Farm To Your Family",
        paragraph:
          aboutHero.paragraph !== undefined
            ? aboutHero.paragraph
            : settings.aboutHero?.paragraph ||
              "From the fertile fields of Dronagiri to your dining table — we nurture every seed with love, tradition, and unwavering commitment to purity.",
      };
    }

    if (req.body.faqs !== undefined) {
      settings.faqs = req.body.faqs;
    }

    if (req.body.returnsPolicy !== undefined) {
      settings.returnsPolicy = req.body.returnsPolicy;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Site settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("updateSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update site settings",
      error: error.message,
    });
  }
};

// POST /api/settings/upload - Upload an image directly to Cloudinary
export const uploadImageDirect = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    const secureUrl = await uploadOnCloudinary(image);
    return res.status(200).json({ success: true, url: secureUrl });
  } catch (error) {
    console.error("uploadImageDirect error:", error);
    return res.status(500).json({
      success: false,
      message: "Cloudinary upload failed",
      error: error.message,
    });
  }
};
