import Collection from "../models/collection.model.js";

export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ displayOrder: 1, name: 1 }).lean();
    return res.status(200).json(collections.map((c) => ({ ...c, id: c.id || String(c._id) })));
  } catch (error) {
    return res.status(500).json({ message: `Get collections error: ${error.message}` });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findOne({
      $or: [
        { id },
        { slug: id.toLowerCase() },
        ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : []),
      ],
    }).lean();

    if (!collection) {
      return res.status(404).json({ message: `Collection '${id}' not found` });
    }

    return res.status(200).json({ ...collection, id: collection.id || String(collection._id) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { name, slug, description, coverImage, productIds, isVisible, isFeatured, displayOrder } = req.body;
    if (!name) return res.status(400).json({ message: "Collection name is required" });

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const id = req.body.id || `col-${finalSlug}`;

    const newCollection = await Collection.create({
      id,
      name,
      slug: finalSlug,
      description: description || "",
      coverImage: coverImage || "",
      productIds: productIds || [],
      isVisible: isVisible !== undefined ? isVisible : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      displayOrder: displayOrder || 0,
      itemCount: (productIds || []).length,
    });

    return res.status(201).json(newCollection);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.productIds) {
      updates.itemCount = updates.productIds.length;
    }

    const updated = await Collection.findOneAndUpdate(
      {
        $or: [
          { id },
          { slug: id.toLowerCase() },
          ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : []),
        ],
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Collection not found" });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Collection.findOneAndDelete({
      $or: [
        { id },
        { slug: id.toLowerCase() },
        ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : []),
      ],
    });
    if (!deleted) return res.status(404).json({ message: "Collection not found" });
    return res.status(200).json({ success: true, message: "Collection deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

