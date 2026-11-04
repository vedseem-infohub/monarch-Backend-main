import Category, { generateSlug } from "../models/category.model.js";
import Product from "../models/product.model.js";

export const MONARCH_DEFAULT_CATEGORIES = [
  {
    id: "bridal-lehengas",
    name: "Bridal Lehengas",
    slug: "bridal-lehengas",
    gender: "women",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=70&w=600&auto=format&fit=crop",
    tagline: "Centuries of bridal heritage handcrafted in pure gold zari and silk velvet",
    description: "Bespoke bridal heirlooms created for the most momentous day of your life, combining ancestral Awadhi zardozi with contemporary silhouette architecture.",
    status: "Active",
    displayOrder: 1,
  },
  {
    id: "designer-sarees",
    name: "Designer Sarees",
    slug: "designer-sarees",
    gender: "women",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=70&w=600&auto=format&fit=crop",
    tagline: "Handwoven Banarasi katan silk, organza tissue, and royal kadwa weaves",
    description: "Six yards of timeless royalty woven in sacred weaving corridors of Kashi and Chanderi with authentic silver-gilt zari.",
    status: "Active",
    displayOrder: 2,
  },
  {
    id: "sherwanis",
    name: "Royal Sherwanis",
    slug: "sherwanis",
    gender: "men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=70&w=600&auto=format&fit=crop",
    tagline: "Regal silhouettes in raw mulberry silk with intricate marodi embroidery",
    description: "Commanding groomwear and royal ceremonial coats structured with full canvas and hand-carved antique buttons.",
    status: "Active",
    displayOrder: 3,
  },
  {
    id: "bandhgalas",
    name: "Imperial Bandhgalas",
    slug: "bandhgalas",
    gender: "men",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=70&w=600&auto=format&fit=crop",
    tagline: "The iconic prince jacket in superfine wool-silk with gold bullion crests",
    description: "Quintessential Indian formalwear with immaculate shoulders, hand-finished collars, and bespoke buttons.",
    status: "Active",
    displayOrder: 4,
  },
  {
    id: "anarkalis",
    name: "Kalidar Anarkalis",
    slug: "anarkalis",
    gender: "women",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=600&auto=format&fit=crop",
    tagline: "Sweeping 32-kali kalidar flares adorned with Jaipur gota patti",
    description: "Regal kalidar ensembles that float with poetic motion, framed with delicate resham and gold thread couching.",
    status: "Active",
    displayOrder: 5,
  },
  {
    id: "kurta-sets-men",
    name: "Heritage Kurta Sets",
    slug: "kurta-sets-men",
    gender: "men",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=600&auto=format&fit=crop",
    tagline: "Crisp Chanderi and Matka silk kurtas paired with tailored churidars",
    description: "Sophisticated celebration wear designed for sangeets, royal mehendi soirees, and intimate ancestral feasts.",
    status: "Active",
    displayOrder: 6,
  },
  {
    id: "kurta-sets-women",
    name: "Kurta Sets (Women)",
    slug: "kurta-sets-women",
    gender: "women",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=70&w=600&auto=format&fit=crop",
    tagline: "Effortless festive grandeur tailored in pure mulberry silk and chanderi",
    description: "Refined silhouette sets with hand-embroidered collars and organza dupattas for ceremonial dinners.",
    status: "Active",
    displayOrder: 7,
  },
  {
    id: "nehru-jackets",
    name: "Nehru Jackets",
    slug: "nehru-jackets",
    gender: "men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=70&w=600&auto=format&fit=crop",
    tagline: "Hand-brocaded Benaras silk vests designed for refined layering",
    description: "Elevate festive kurta ensembles with heritage brocade patterns preserved from 19th-century royal courts.",
    status: "Active",
    displayOrder: 8,
  },
  {
    id: "festive-wear-women",
    name: "Festive Wear & Ghararas",
    slug: "festive-wear-women",
    gender: "women",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=70&w=600&auto=format&fit=crop",
    tagline: "Ghararas, shararas, and celebratory ensembles shimmering with mukaish",
    description: "Jewel-toned pieces crafted for Diwali, Eid, and joyful family celebrations.",
    status: "Active",
    displayOrder: 9,
  },
  {
    id: "kanjivaram-silk",
    name: "Kanjivaram Silk",
    slug: "kanjivaram-silk",
    gender: "women",
    image: "/images/moods/kanjivaram_silk.jpg",
    itemCount: 16,
    tagline: "Temple weaves in pure mulberry silk with 24K electroplated gold zari",
    description: "Ancestral Korvai interlocking border tapestries from Tamil Nadu with solid gold zari pallus.",
    status: "Active",
    displayOrder: 10,
  },
  {
    id: "chanderi-silk",
    name: "Chanderi Heritage",
    slug: "chanderi-silk",
    gender: "women",
    image: "/images/moods/chanderi_heritage.jpg",
    itemCount: 14,
    tagline: "Featherlight sheer silks woven with silver-gilt zari booti motifs",
    description: "Heirloom gossamer drapes from Central India, blending pure spun silk with shimmering mukaish.",
    status: "Active",
    displayOrder: 11,
  },
  {
    id: "tussar-silk",
    name: "Tussar Silk",
    slug: "tussar-silk",
    gender: "women",
    image: "/images/moods/tussar_silk.jpg",
    itemCount: 12,
    tagline: "Rich golden forest silks textured with natural coarse sheen",
    description: "Earthy luxury hand-loomed from wild silkworms, featuring tribal Kantha needlework.",
    status: "Active",
    displayOrder: 12,
  },
  {
    id: "paithani-silk",
    name: "Paithani Heirloom",
    slug: "paithani-silk",
    gender: "women",
    image: "/images/moods/paithani_heirloom.jpg",
    itemCount: 15,
    tagline: "Royal Maharashtrian tapestry weaves with peacock motifs and oblique borders",
    description: "Intricately shuttled gold pallus woven on non-electric wooden pitlooms, preserved from 18th-century Peshwa courts.",
    status: "Active",
    displayOrder: 13,
  },
  {
    id: "banarasi-silk",
    name: "Banarasi Brocade",
    slug: "banarasi-silk",
    gender: "women",
    image: "/images/moods/banarasi_brocade.jpg",
    itemCount: 24,
    tagline: "Ancestral Kashi Kadwa and Shikargah brocades in pure Katan silk",
    description: "Sacred corridor masterworks woven along the holy ghats with real zari.",
    status: "Active",
    displayOrder: 14,
  },
  {
    id: "pure-organza",
    name: "Pure Organza & Tissue",
    slug: "pure-organza",
    gender: "women",
    image: "/images/moods/pure_organza.jpg",
    itemCount: 18,
    tagline: "Weightless gossamer net silks illuminated with delicate mukaish dots",
    description: "Contemporary royal drapes engineered for graceful fluidity, featuring hand-scalloped borders.",
    status: "Active",
    displayOrder: 15,
  },
];

export async function seedDefaultCategoriesIfEmpty() {
  try {
    for (const item of MONARCH_DEFAULT_CATEGORIES) {
      const exists = await Category.findOne({
        $or: [{ id: item.id }, { slug: item.slug }],
      });
      if (!exists) {
        await Category.create({
          ...item,
          imageUrl: item.image,
          active: item.status === "Active",
        });
      }
    }
  } catch (err) {
    console.error("Error seeding categories:", err);
  }
}

export async function getCategories(req, res) {
  try {
    await seedDefaultCategoriesIfEmpty();

    const { gender } = req.query;
    let filter = {};
    if (gender && gender !== "all") {
      filter.gender = { $in: [gender.toLowerCase(), "all"] };
    }

    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();

    // Aggregate live product counts per category
    const productCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    productCounts.forEach((item) => {
      if (item._id) countMap[item._id.toLowerCase()] = item.count;
    });

    const result = categories.map((cat) => {
      const liveCount = countMap[cat.slug.toLowerCase()] || countMap[cat.name.toLowerCase()] || cat.itemCount || 0;
      return {
        ...cat,
        id: cat.id || cat.slug || String(cat._id),
        _id: String(cat._id),
        image: cat.image || cat.imageUrl || "",
        imageUrl: cat.imageUrl || cat.image || "",
        itemCount: liveCount,
        productCount: liveCount,
      };
    });

    res.set("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    return res.status(200).json(result);
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
  }
}

export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const queryConditions = [
      { id },
      { slug: id.toLowerCase() },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      queryConditions.push({ _id: id });
    }

    const category = await Category.findOne({ $or: queryConditions }).lean();
    if (!category) {
      return res.status(404).json({ success: false, message: `Category '${id}' not found` });
    }

    const liveCount = await Product.countDocuments({
      $or: [{ category: category.slug }, { category: category.name }],
    });

    return res.status(200).json({
      ...category,
      id: category.id || category.slug || String(category._id),
      image: category.image || category.imageUrl || "",
      imageUrl: category.imageUrl || category.image || "",
      itemCount: liveCount || category.itemCount || 0,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const body = req.body;
    const { name } = body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const trimmedName = name.trim();
    const slug = body.slug ? body.slug.toLowerCase().trim() : generateSlug(trimmedName);
    const id = body.id || slug;

    const existing = await Category.findOne({
      $or: [{ name: new RegExp(`^${trimmedName}$`, "i") }, { slug }, { id }],
    });
    if (existing) {
      return res.status(200).json(existing);
    }

    const newCategory = await Category.create({
      ...body,
      id,
      name: trimmedName,
      slug,
      image: body.image || body.imageUrl || "",
      imageUrl: body.imageUrl || body.image || "",
      active: body.status !== "Inactive",
      status: body.status || "Active",
    });

    const catObj = newCategory.toObject();
    return res.status(201).json({
      ...catObj,
      id: catObj.id || catObj.slug || String(catObj._id),
      image: catObj.image || catObj.imageUrl || "",
      status: catObj.status || (catObj.active ? "Active" : "Inactive"),
      itemCount: 0,
    });
  } catch (error) {
    console.error("createCategory error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const queryConditions = [
      { id },
      { slug: id.toLowerCase() },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      queryConditions.push({ _id: id });
    }

    if (updates.image && !updates.imageUrl) updates.imageUrl = updates.image;
    if (updates.imageUrl && !updates.image) updates.image = updates.imageUrl;
    if (updates.status) updates.active = updates.status === "Active";

    const updated = await Category.findOneAndUpdate(
      { $or: queryConditions },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Category '${id}' not found` });
    }

    const catObj = updated.toObject();
    return res.status(200).json({
      ...catObj,
      id: catObj.id || catObj.slug || String(catObj._id),
      image: catObj.image || catObj.imageUrl || "",
      status: catObj.status || (catObj.active ? "Active" : "Inactive"),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const queryConditions = [
      { id },
      { slug: id.toLowerCase() },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      queryConditions.push({ _id: id });
    }

    const deleted = await Category.findOneAndDelete({ $or: queryConditions });
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Category '${id}' not found` });
    }

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
