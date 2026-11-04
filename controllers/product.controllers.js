import Product from "../models/product.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// Helper to check if string is base64 image
const isBase64Image = (str) => {
  return typeof str === "string" && str.startsWith("data:image/");
};

// Helper to generate a slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Helper to format product consistently for both storefront and admin panel
export const formatProduct = (p) => {
  if (!p) return null;
  const obj = p.toObject ? p.toObject() : p;
  return {
    ...obj,
    id: obj.id || String(obj._id),
    _id: String(obj._id),
    images: obj.images && obj.images.length > 0 ? obj.images : (obj.imageUrl ? [obj.imageUrl, obj.imageUrl2].filter(Boolean) : []),
    originalPrice: Number(obj.originalPrice || obj.regularPrice || obj.price || 0),
    regularPrice: Number(obj.regularPrice || obj.originalPrice || obj.price || 0),
    costPrice: Number(obj.costPrice || 0),
    price: Number(obj.price || obj.regularPrice || 0),
    stock: obj.stock !== undefined ? Number(obj.stock) : 10,
    inStock: (obj.stock !== undefined ? Number(obj.stock) : 10) > 0,
    status: obj.status || (obj.active !== false ? "Published" : "Draft"),
  };
};

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      gender,
      collection,
      isBestSeller,
      isNewArrival,
      isBridal,
      isSixMoods,
      featured,
      search,
      includeInactive,
      status,
      limit,
      sort,
    } = req.query;

    let filter = {};

    if (category && category !== "All" && category !== "all") {
      filter.$or = [
        { category: category },
        { category: category.toLowerCase() },
        { categoryName: new RegExp(`^${category}$`, "i") },
      ];
    }

    if (gender && gender !== "all") {
      filter.gender = { $in: [gender.toLowerCase(), "unisex"] };
    }

    if (collection) {
      filter.$or = [
        { collectionName: collection },
        { collection: collection },
      ];
    }

    if (isBestSeller === "true") {
      filter.isBestSeller = true;
    }
    if (isNewArrival === "true") {
      filter.isNewArrival = true;
    }
    if (isBridal === "true") {
      filter.isBridal = true;
    }
    if (isSixMoods === "true") {
      filter.isSixMoods = true;
    }
    if (featured === "true") {
      filter.featured = true;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { tagline: searchRegex },
        { description: searchRegex },
        { categoryName: searchRegex },
        { sku: searchRegex },
        { fabric: searchRegex },
      ];
    }

    // Default: only active & published for storefront
    if (includeInactive !== "true") {
      filter.active = true;
      if (!status) {
        filter.status = { $ne: "Archived" };
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "bestseller") {
      sortOption = { bestsellerRank: 1, reviewsCount: -1 };
    }

    let query = Product.find(filter).sort(sortOption);
    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query.lean();
    const formatted = products.map(formatProduct);

    if (includeInactive === "true") {
      res.set("Cache-Control", "no-store");
    } else {
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    }

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ message: `Get products error: ${error.message}` });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID or slug is required" });
    }

    const idTrimmed = id.trim();
    const queryConditions = [
      { id: idTrimmed },
      { slug: idTrimmed.toLowerCase() },
    ];

    if (/^[0-9a-fA-F]{24}$/.test(idTrimmed)) {
      queryConditions.push({ _id: idTrimmed });
    }

    if (!isNaN(Number(idTrimmed))) {
      queryConditions.push({ numericId: Number(idTrimmed) });
    }

    const product = await Product.findOne({ $or: queryConditions }).lean();
    if (!product) {
      return res.status(404).json({ message: `Product '${id}' not found` });
    }

    const formatted = formatProduct(product);

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({ message: `Get product error: ${error.message}` });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const { name, category, price, description } = body;

    if (!name || !category) {
      return res.status(400).json({ message: "Product name and category are required" });
    }

    const id = body.id || `monarch-${Date.now()}`;
    const slug = body.slug ? body.slug.toLowerCase().trim() : generateSlug(name);

    // Concurrency / Idempotency guard: Prevent duplicate product creation if submitted twice rapidly (< 5s)
    const recentDuplicate = await Product.findOne({
      $or: [{ id }, { slug }],
    });
    if (recentDuplicate) {
      return res.status(200).json(recentDuplicate);
    }

    // Process image uploads if base64
    let images = Array.isArray(body.images) ? [...body.images] : [];
    if (images.length === 0 && body.imageUrl) {
      images.push(body.imageUrl);
      if (body.imageUrl2) images.push(body.imageUrl2);
    }

    for (let i = 0; i < images.length; i++) {
      if (isBase64Image(images[i])) {
        try {
          images[i] = await uploadOnCloudinary(images[i]);
        } catch (uploadErr) {
          console.warn("Cloudinary upload failed, keeping base64:", uploadErr.message);
        }
      }
    }

    const newProduct = await Product.create({
      ...body,
      id,
      slug,
      images,
      imageUrl: images[0] || body.imageUrl || "",
      imageUrl2: images[1] || body.imageUrl2 || "",
      price: Number(price) || (body.variants?.[0]?.price ? Number(body.variants[0].price) : 0),
      regularPrice: Number(body.regularPrice || body.originalPrice || price || 0),
      originalPrice: Number(body.originalPrice || body.regularPrice || price || 0),
      costPrice: Number(body.costPrice || 0),
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      description: description || name,
      active: body.active !== undefined ? body.active : true,
      status: body.status || "Published",
    });

    return res.status(201).json(formatProduct(newProduct));
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ message: `Create product error: ${error.message}` });
  }
};

export const updateProduct = async (req, res) => {
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

    if (updates.images && Array.isArray(updates.images)) {
      for (let i = 0; i < updates.images.length; i++) {
        if (isBase64Image(updates.images[i])) {
          try {
            updates.images[i] = await uploadOnCloudinary(updates.images[i]);
          } catch (uploadErr) {
            console.warn("Cloudinary upload error:", uploadErr.message);
          }
        }
      }
      if (updates.images[0]) updates.imageUrl = updates.images[0];
      if (updates.images[1]) updates.imageUrl2 = updates.images[1];
    }

    if (updates.price) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = await Product.findOneAndUpdate(
      { $or: queryConditions },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: `Product '${id}' not found for update` });
    }

    return res.status(200).json(formatProduct(updated));
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ message: `Update product error: ${error.message}` });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const queryConditions = [
      { id },
      { slug: id.toLowerCase() },
    ];
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      queryConditions.push({ _id: id });
    }

    const deleted = await Product.findOneAndDelete({ $or: queryConditions });
    if (!deleted) {
      return res.status(404).json({ message: `Product '${id}' not found for deletion` });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: `Delete product error: ${error.message}` });
  }
};

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Array of product ids is required" });
    }

    await Product.deleteMany({
      $or: [
        { id: { $in: ids } },
        { _id: { $in: ids.filter((i) => /^[0-9a-fA-F]{24}$/.test(i)) } },
      ],
    });

    return res.status(200).json({ success: true, message: `Deleted ${ids.length} products` });
  } catch (error) {
    return res.status(500).json({ message: `Bulk delete error: ${error.message}` });
  }
};

export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({ message: "ids array and status are required" });
    }

    await Product.updateMany(
      {
        $or: [
          { id: { $in: ids } },
          { _id: { $in: ids.filter((i) => /^[0-9a-fA-F]{24}$/.test(i)) } },
        ],
      },
      { status, active: status !== "Archived" }
    );

    return res.status(200).json({ success: true, message: `Updated status for ${ids.length} products` });
  } catch (error) {
    return res.status(500).json({ message: `Bulk status update error: ${error.message}` });
  }
};
