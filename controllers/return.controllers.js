import ReturnRequest from "../models/return.model.js";

export const getReturns = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== "All") filter.status = status;

    const returns = await ReturnRequest.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(returns.map((r) => ({ ...r, id: String(r._id) })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createReturn = async (req, res) => {
  try {
    const body = req.body;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const returnNumber = body.returnNumber || `RET-${randomSuffix}-A`;

    const newReturn = await ReturnRequest.create({
      ...body,
      returnNumber,
      status: "Requested",
      timeline: [
        {
          status: "Requested",
          date: new Date().toISOString().split("T")[0],
          note: "Return/alteration request initiated by patron",
        },
      ],
    });

    return res.status(201).json(newReturn);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, inspectionNotes } = req.body;

    const ret = await ReturnRequest.findOne({
      $or: [{ returnNumber: id }, ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])],
    });
    if (!ret) return res.status(404).json({ message: "Return request not found" });

    if (status) {
      ret.status = status;
      ret.timeline.push({
        status,
        date: new Date().toISOString().split("T")[0],
        note: note || `Status updated to ${status}`,
      });
    }
    if (inspectionNotes) ret.inspectionNotes = inspectionNotes;

    await ret.save();
    return res.status(200).json(ret);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

