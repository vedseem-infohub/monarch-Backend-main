import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "./models/product.model.js";
import Category from "./models/category.model.js";
import Collection from "./models/collection.model.js";
import Order from "./models/order.model.js";
import User from "./models/user.model.js";
import Coupon from "./models/coupon.model.js";
import SiteSettings from "./models/siteSettings.model.js";
import Review from "./models/review.model.js";
import Newsletter from "./models/newsletter.model.js";
import AtelierBooking from "./models/atelier.model.js";
import SectionFrame from "./models/sectionFrame.model.js";
import { MONARCH_DEFAULT_CATEGORIES } from "./controllers/category.controllers.js";
import { INITIAL_SECTION_FRAMES } from "./data/defaultFrames.js";

const SEED_PRODUCTS = [
  {
    id: "monarch-001",
    name: "Gulnaar Embroidered Zardozi Lehenga",
    slug: "gulnaar-embroidered-zardozi-lehenga",
    sku: "MNR-BRD-001",
    tagline: "Crimson Velvet & Hand-Beaded Zardozi with Pure Antique Gold Zari",
    description: "An opus of Mughal-inspired grandeur, the Gulnaar Lehenga is meticulously handcrafted in deep royal crimson velvet. Embellished with 420 hours of authentic dabka, nakshi, and real zari threadwork depicting palace jaalis and lotus motifs.",
    shortDescription: "Deep crimson velvet lehenga with 420 hours of hand-beaded dabka and pota pearls.",
    category: "bridal-lehengas",
    categoryName: "Bridal Lehengas",
    collectionName: "col-bridal-edit",
    gender: "women",
    price: 285000,
    regularPrice: 325000,
    originalPrice: 325000,
    costPrice: 145000,
    discountPercent: 12,
    stock: 6,
    status: "Published",
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    isBridal: true,
    isVaultSignature: true,
    homepageVisibility: true,
    badge: "Bestseller",
    rating: 4.95,
    reviewsCount: 38,
    bestsellerRank: 1,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=70&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=600&auto=format&fit=crop",
    ],
    colors: [
      { name: "Royal Crimson", hex: "#5A1725", imageIndex: 0 },
      { name: "Deep Burgundy", hex: "#291116", imageIndex: 1 },
      { name: "Imperial Rust", hex: "#87321F", imageIndex: 2 },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "Custom Bespoke"],
    fabric: "Micro-Velvet & Tissue Organza Dupatta",
    weavingTechnique: "Karchob Frame Needle-embroidery",
    embroidery: "Handcrafted Zardozi, Pota pearls, and 24K Gold-dipped Dabka",
    craftsmanshipStory: "Hand-stretched on royal karchob frames by master craftsmen in Varanasi and Lucknow over four months.",
    loomStory: "Woven on specialized heirloom looms with 24K real gold wire wefts.",
    artisanInfo: "Crafted under the master direction of Ustad Rehmat Ali in Awadh.",
    careInstructions: [
      "Strictly Dry Clean Only by luxury couture specialist",
      "Store in provided breathable muslin bag away from direct sunlight",
      "Do not spray perfumes directly on metallic zari embroidery",
    ],
    deliveryDays: 14,
    has3D: true,
    model3DConfig: {
      primaryColor: "#5A1725",
      accentColor: "#C7A15B",
      pattern: "zardozi",
      meshType: "lehenga",
      metalness: 0.7,
      roughness: 0.35,
    },
  },
  {
    id: "monarch-002",
    name: "Sheesh Mahal Raw Silk Sherwani",
    slug: "sheesh-mahal-raw-silk-sherwani",
    sku: "MNR-SHR-002",
    tagline: "Ivory Mulberry Raw Silk with Subtle Gold Marodi Embroidery",
    description: "Inspired by the mirrored ceilings of Jaipur palaces, the Sheesh Mahal Sherwani features hand-spun Bhagalpur raw silk with intricate tonal marodi thread embroidery and custom antique gold carved buttons.",
    shortDescription: "Ivory raw silk groom's sherwani with delicate gold marodi needlework.",
    category: "sherwanis",
    categoryName: "Royal Sherwanis",
    collectionName: "col-best-sellers",
    gender: "men",
    price: 195000,
    regularPrice: 215000,
    originalPrice: 215000,
    costPrice: 95000,
    discountPercent: 9,
    stock: 8,
    status: "Published",
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    isBridal: true,
    isVaultSignature: false,
    homepageVisibility: true,
    badge: "Royal Groom",
    rating: 4.98,
    reviewsCount: 29,
    bestsellerRank: 2,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=70&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=70&w=600&auto=format&fit=crop",
    ],
    colors: [
      { name: "Ivory Gold", hex: "#FAF5E9", imageIndex: 0 },
      { name: "Warm Champagne", hex: "#EADDC6", imageIndex: 1 },
    ],
    sizes: ["38", "40", "42", "44", "46", "Custom Tailored"],
    fabric: "Bhagalpur Handspun Raw Silk & Silk Brocade Stole",
    weavingTechnique: "Floating Warp Raw Silk Weave",
    embroidery: "Fine Marodi Resham Cording & Filigree Zari",
    craftsmanshipStory: "Tailored with a traditional full-canvas chest piece that moulds to the royal physique over time.",
    careInstructions: ["Professional Dry Clean Only", "Keep on contoured wooden hanger"],
    deliveryDays: 12,
    has3D: true,
    model3DConfig: {
      primaryColor: "#FAF5E9",
      accentColor: "#B39458",
      pattern: "zari-brocade",
      meshType: "sherwani",
      metalness: 0.6,
      roughness: 0.4,
    },
  },
  {
    id: "monarch-na-001",
    name: "Meher Velvet Kalidar Anarkali Set",
    slug: "meher-velvet-kalidar-anarkali-set",
    sku: "MNR-ANK-001",
    tagline: "Silk Velvet Kalidar with Handcrafted Jaipur Gota Patti & Dori Work",
    description: "The Meher set flows in 32 panels of pure mulberry silk velvet, lined with soft habutai silk and finished with intricate antique gota border trimmings.",
    shortDescription: "32-kali silk velvet anarkali with fine Jaipur gota needlework.",
    category: "anarkalis",
    categoryName: "Kalidar Anarkalis",
    collectionName: "col-new-arrivals",
    gender: "women",
    price: 175000,
    regularPrice: 175000,
    originalPrice: 175000,
    costPrice: 85000,
    discountPercent: 0,
    stock: 8,
    status: "Published",
    featured: true,
    isNewArrival: true,
    isBestSeller: false,
    isBridal: false,
    homepageVisibility: true,
    badge: "New Arrival",
    rating: 4.92,
    reviewsCount: 19,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=600&auto=format&fit=crop",
    ],
    colors: [
      { name: "Jewel Plum", hex: "#4A1525", imageIndex: 0 },
      { name: "Onyx Emerald", hex: "#123524", imageIndex: 1 },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Silk Velvet & Pure Organza",
    weavingTechnique: "32-Kali Architectural Flare",
    embroidery: "Handcrafted Jaipur Gota Patti & Dori Work",
    craftsmanshipStory: "Each kali is hand-pleated and interlocked with fine antique metallic cords by Jaipur karigars.",
    careInstructions: ["Dry Clean Only", "Steam iron reverse side only"],
    deliveryDays: 10,
    has3D: false,
  },
  {
    id: "monarch-bs-003",
    name: "Surya Rekha Kanjivaram Gold Tissue Saree",
    slug: "surya-rekha-kanjivaram-gold-tissue-saree",
    sku: "MNR-KNJ-006",
    tagline: "Pure Mulberry Silk Warp with 24K Gold-dipped Silver Zari Weft",
    description: "Woven on pitlooms by 4th-generation master weavers in Kanchipuram, the Surya Rekha features authentic korvai temple borders and ancestral peacock motifs.",
    shortDescription: "Authentic Kanjivaram gold tissue saree with pure silver-gilt zari.",
    category: "designer-sarees",
    categoryName: "Designer Sarees",
    collectionName: "col-six-moods",
    gender: "women",
    price: 165000,
    regularPrice: 185000,
    originalPrice: 185000,
    costPrice: 78000,
    discountPercent: 11,
    stock: 4,
    status: "Published",
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    isBridal: true,
    isSixMoods: true,
    homepageVisibility: true,
    badge: "Heritage Heirloom",
    rating: 4.97,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=70&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=600&auto=format&fit=crop",
    ],
    colors: [
      { name: "Sunrise Gold Tissue", hex: "#D4AF37", imageIndex: 0 },
      { name: "Copper Vermilion", hex: "#B85D36", imageIndex: 1 },
    ],
    sizes: ["6.2 Metres (With Blouse)"],
    fabric: "Certified Pure Silk Mark Kanjivaram Tissue",
    weavingTechnique: "Ancestral Korvai Interlocking Weft",
    embroidery: "Handwoven Metallic Jacquard",
    craftsmanshipStory: "Requires two master artisans operating three shuttles simultaneously for 28 working days.",
    careInstructions: ["Dry Clean Only", "Store flat in cotton saree bag"],
    deliveryDays: 7,
    has3D: true,
    model3DConfig: {
      primaryColor: "#D4AF37",
      accentColor: "#5A1725",
      pattern: "zari-brocade",
      meshType: "saree",
      metalness: 0.8,
      roughness: 0.3,
    },
  },
  {
    id: "monarch-bs-002",
    name: "Jodhpur Royal Velvet Bandhgala",
    slug: "jodhpur-royal-velvet-bandhgala",
    sku: "MNR-BND-002",
    tagline: "Midnight Navy Silk Velvet with Antiqued Gold Crest Monogramming",
    description: "The quintessential Indian formal silhouette. Tailored in structured velvet with high mandarin collar, silk lining, and hand-cast royal coat-of-arms buttons.",
    shortDescription: "Structured midnight navy velvet bandhgala jacket with bullion crest buttons.",
    category: "bandhgalas",
    categoryName: "Imperial Bandhgalas",
    collectionName: "col-vault-signatures",
    gender: "men",
    price: 145000,
    regularPrice: 160000,
    originalPrice: 160000,
    costPrice: 68000,
    discountPercent: 9,
    stock: 5,
    status: "Published",
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    isBridal: false,
    isVaultSignature: true,
    homepageVisibility: true,
    badge: "Vault Edition",
    rating: 4.96,
    reviewsCount: 22,
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=70&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=70&w=600&auto=format&fit=crop",
    ],
    colors: [
      { name: "Midnight Navy", hex: "#1A2536", imageIndex: 0 },
      { name: "Imperial Onyx", hex: "#1B1A19", imageIndex: 1 },
    ],
    sizes: ["38", "40", "42", "44", "46"],
    fabric: "High-Density Silk Velvet with Pure Bemberg Lining",
    weavingTechnique: "Savile Row Structured Tailoring with Indian Silhouette",
    embroidery: "Gold Bullion Thread Hand-Finished Buttonholes",
    craftsmanshipStory: "Features hand-padded lapels and shoulder construction creating an imposing regal stance.",
    careInstructions: ["Specialist Dry Clean Only"],
    deliveryDays: 10,
    has3D: false,
  },
];

const SEED_COLLECTIONS = [
  {
    id: "col-new-arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh royal masterpieces woven for the upcoming wedding season, featuring gilded tilla, marodi resham, and 24K dabka needlework.",
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=800&auto=format&fit=crop",
    productIds: ["monarch-na-001"],
    isVisible: true,
    isFeatured: true,
    displayOrder: 1,
    itemCount: 8,
  },
  {
    id: "col-best-sellers",
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Patron favorites and iconic royal silhouettes ranked by sovereign acclaim and heirloom demand.",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=70&w=800&auto=format&fit=crop",
    productIds: ["monarch-001", "monarch-002", "monarch-bs-003", "monarch-bs-002"],
    isVisible: true,
    isFeatured: true,
    displayOrder: 2,
    itemCount: 8,
  },
  {
    id: "col-bridal-edit",
    name: "The Bridal Edit",
    slug: "bridal-collection",
    description: "An imperial trousseau collection created for monumental matrimony, blending Awadhi karchob embroidery with pure silk velvet.",
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=800&auto=format&fit=crop",
    productIds: ["monarch-001"],
    isVisible: true,
    isFeatured: true,
    displayOrder: 3,
    itemCount: 4,
  },
  {
    id: "col-six-moods",
    name: "Six Moods of Silk",
    slug: "six-moods",
    description: "Centuries of Indian weaving heritage across Kanjivaram, Chanderi, Tussar, Paithani, Banarasi, and Pure Organza.",
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=70&w=800&auto=format&fit=crop",
    productIds: ["monarch-bs-003"],
    isVisible: true,
    isFeatured: true,
    displayOrder: 4,
    itemCount: 6,
  },
  {
    id: "col-vault-signatures",
    name: "Vault Signatures",
    slug: "vault-signatures",
    description: "Ultra-exclusive haute couture masterpieces limited to 5 commissions worldwide, hallmarked with 24K certified gold zari.",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=70&w=800&auto=format&fit=crop",
    productIds: ["monarch-001", "monarch-bs-002"],
    isVisible: true,
    isFeatured: true,
    displayOrder: 5,
    itemCount: 6,
  },
];

const SEED_COUPONS = [
  {
    id: "coup-1",
    code: "ROYALWELCOME",
    description: "Exclusive 10% privilege on first bespoke haute couture commission",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 100000,
    minOrderAmount: 100000,
    maxDiscount: 25000,
    maxDiscountAmount: 25000,
    usageLimit: 500,
    usedCount: 84,
    usageCount: 84,
    status: "Active",
    isActive: true,
  },
  {
    id: "coup-2",
    code: "ATELIERPRIVILEGE",
    description: "Flat ₹ 50,000 privilege on bridal ensembles exceeding ₹ 3,00,000",
    discountType: "flat",
    discountValue: 50000,
    minOrderValue: 300000,
    minOrderAmount: 300000,
    usageLimit: 25,
    usedCount: 7,
    usageCount: 7,
    status: "Active",
    isActive: true,
  },
  {
    id: "coup-3",
    code: "HERITAGE15",
    description: "15% sovereign invitation privilege for royal patrons",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 150000,
    minOrderAmount: 150000,
    maxDiscount: 45000,
    maxDiscountAmount: 45000,
    usageLimit: 100,
    usedCount: 29,
    usageCount: 29,
    status: "Active",
    isActive: true,
  },
];

export async function runMonarchSeed() {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("MONGODB_URL missing in .env");
      return;
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL);
    }

    console.log("👑 [Seed] Connected to MongoDB. Seeding MONARCH Haute Couture...");

    // 1. Seed Categories
    for (const cat of MONARCH_DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, imageUrl: cat.image, active: true },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ [Seed] Categories seeded (${MONARCH_DEFAULT_CATEGORIES.length})`);

    // 2. Seed Collections
    for (const col of SEED_COLLECTIONS) {
      await Collection.findOneAndUpdate(
        { slug: col.slug },
        col,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ [Seed] Collections seeded (${SEED_COLLECTIONS.length})`);

    // 3. Seed Products
    for (const prod of SEED_PRODUCTS) {
      await Product.findOneAndUpdate(
        { id: prod.id },
        {
          ...prod,
          imageUrl: prod.images[0] || "",
          imageUrl2: prod.images[1] || "",
          active: true,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ [Seed] Products seeded (${SEED_PRODUCTS.length})`);

    // 4. Seed Coupons
    for (const coup of SEED_COUPONS) {
      await Coupon.findOneAndUpdate(
        { code: coup.code },
        coup,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ [Seed] Coupons seeded (${SEED_COUPONS.length})`);

    // 5. Seed Default Admin User
    const defaultPassword = await bcrypt.hash("monarch123", 10);
    await User.findOneAndUpdate(
      { email: "devraj@monarch-couture.in" },
      {
        name: "Devraj Singh Rathore",
        email: "devraj@monarch-couture.in",
        password: defaultPassword,
        role: "super_admin",
        status: "active",
        phone: "+91 98200 11223",
      },
      { upsert: true }
    );
    await User.findOneAndUpdate(
      { email: "radhika@monarch-client.com" },
      {
        name: "Maharani Radhika Devi",
        email: "radhika@monarch-client.com",
        password: defaultPassword,
        role: "customer",
        status: "Royal Patron",
        phone: "+91 98200 12345",
        memberId: "MNR-ROYAL-8841",
      },
      { upsert: true }
    );
    console.log("✅ [Seed] Admin and patron credentials ready");

    // 6. Seed Sample Order
    const existOrder = await Order.findOne({ orderNumber: "MNR-2026-8841" });
    if (!existOrder) {
      await Order.create({
        orderId: "MNR-2026-8841",
        orderNumber: "MNR-2026-8841",
        customer: {
          name: "Maharani Radhika Devi",
          email: "radhika@monarch-client.com",
          phone: "+91 98200 12345",
          address: "The Scindia Palace, 14 Carmichael Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400006",
          country: "India",
        },
        customerName: "Maharani Radhika Devi",
        customerEmail: "radhika@monarch-client.com",
        customerPhone: "+91 98200 12345",
        shippingAddress: {
          name: "Maharani Radhika Devi",
          addressLine1: "The Scindia Palace, 14 Carmichael Road",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400006",
          country: "India",
          phone: "+91 98200 12345",
        },
        items: [
          {
            productId: "monarch-001",
            name: "Gulnaar Embroidered Zardozi Lehenga",
            productName: "Gulnaar Embroidered Zardozi Lehenga",
            sku: "MNR-BRD-001",
            price: 285000,
            quantity: 1,
            count: 1,
            variantColor: "Royal Crimson",
            variantSize: "Custom Bespoke",
            image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=600&auto=format&fit=crop",
            total: 285000,
          },
        ],
        subtotal: 285000,
        total: 285000,
        discount: 0,
        shippingFee: 0,
        paymentMethod: "HDFC Infinia Royal Concierge",
        paymentStatus: "Paid",
        status: "Processing",
        timeline: [
          {
            status: "Pending",
            message: "Order placed by patron",
            timestamp: new Date(Date.now() - 86400000),
            actor: "Patron",
          },
          {
            status: "Processing",
            message: "Order confirmed, pitloom weaving active at Awadh Atelier",
            timestamp: new Date(),
            actor: "Devraj Singh Rathore",
          },
        ],
      });
      console.log("✅ [Seed] Sample royal order seeded");
    }

    // 8. Seed Storefront Section Frames
    const existingFramesCount = await SectionFrame.countDocuments();
    if (existingFramesCount === 0 && Array.isArray(INITIAL_SECTION_FRAMES) && INITIAL_SECTION_FRAMES.length > 0) {
      await SectionFrame.insertMany(INITIAL_SECTION_FRAMES);
      console.log(`✅ [Seed] Seeded ${INITIAL_SECTION_FRAMES.length} storefront section frames`);
    }

    console.log("🎉 [Seed] Monarch Haute Couture database is fully prepared!");
  } catch (error) {
    console.error("❌ [Seed] Error:", error);
  }
}

// Auto-run if executed directly via node seedMonarch.js
if (process.argv[1]?.endsWith("seedMonarch.js")) {
  runMonarchSeed().then(() => {
    console.log("Seed script completed.");
    process.exit(0);
  });
}

