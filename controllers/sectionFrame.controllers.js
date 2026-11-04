import SectionFrame from "../models/sectionFrame.model.js";
import { INITIAL_SECTION_FRAMES } from "../data/defaultFrames.js";

export async function seedDefaultFramesIfEmpty() {
  try {
    const count = await SectionFrame.countDocuments();
    if (count === 0 && Array.isArray(INITIAL_SECTION_FRAMES) && INITIAL_SECTION_FRAMES.length > 0) {
      await SectionFrame.insertMany(INITIAL_SECTION_FRAMES);
      console.log(`✅ [Frames] Auto-seeded ${INITIAL_SECTION_FRAMES.length} storefront section frames`);
    }
  } catch (err) {
    console.error("Error auto-seeding section frames:", err);
  }
}

export const getFrames = async (req, res) => {
  try {
    await seedDefaultFramesIfEmpty();

    const { sectionKey } = req.query;
    let filter = {};
    if (sectionKey && sectionKey !== "all") {
      filter.sectionKey = sectionKey;
    }

    const frames = await SectionFrame.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean();
    return res.status(200).json(frames.map((f) => ({
      ...f,
      id: f.id || String(f._id),
    })));
  } catch (error) {
    console.error("getFrames error:", error);
    return res.status(500).json({ message: `Error fetching frames: ${error.message}` });
  }
};

export const getFrameById = async (req, res) => {
  try {
    const { id } = req.params;
    const frame = await SectionFrame.findOne({
      $or: [{ id }, ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])],
    }).lean();

    if (!frame) {
      return res.status(404).json({ message: "Frame not found" });
    }

    return res.status(200).json({ ...frame, id: frame.id || String(frame._id) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createFrame = async (req, res) => {
  try {
    const body = req.body;
    const { sectionKey, title, image } = body;

    if (!sectionKey || !title || !image) {
      return res.status(400).json({ message: "sectionKey, title, and image are required" });
    }

    const id = body.id || `frm-${sectionKey}-${Date.now()}`;
    const count = await SectionFrame.countDocuments({ sectionKey });
    const displayOrder = body.displayOrder !== undefined ? Number(body.displayOrder) : count + 1;

    const frame = await SectionFrame.create({
      ...body,
      id,
      displayOrder,
      isVisible: body.isVisible !== undefined ? body.isVisible : true,
    });

    return res.status(201).json({ ...frame.toObject(), id: frame.id });
  } catch (error) {
    console.error("createFrame error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateFrame = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const query = [
      { id },
      ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : []),
    ];

    const updated = await SectionFrame.findOneAndUpdate(
      { $or: query },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Frame not found for update" });
    }

    return res.status(200).json({ ...updated.toObject(), id: updated.id });
  } catch (error) {
    console.error("updateFrame error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteFrame = async (req, res) => {
  try {
    const { id } = req.params;
    const query = [
      { id },
      ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : []),
    ];

    const deleted = await SectionFrame.findOneAndDelete({ $or: query });
    if (!deleted) {
      return res.status(404).json({ message: "Frame not found for deletion" });
    }

    return res.status(200).json({ success: true, message: "Frame deleted successfully", id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const reorderFrames = async (req, res) => {
  try {
    const { sectionKey, orderedIds } = req.body;
    if (!sectionKey || !Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "sectionKey and orderedIds array are required" });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await SectionFrame.findOneAndUpdate(
        { sectionKey, $or: [{ id: orderedIds[i] }, ...(/^[0-9a-fA-F]{24}$/.test(orderedIds[i]) ? [{ _id: orderedIds[i] }] : [])] },
        { displayOrder: i + 1 }
      );
    }

    const updated = await SectionFrame.find({ sectionKey }).sort({ displayOrder: 1 });
    return res.status(200).json(updated.map((f) => ({ ...f.toObject(), id: f.id })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

