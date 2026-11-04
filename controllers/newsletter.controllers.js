import Newsletter from "../models/newsletter.model.js";

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(
      subscribers.map((s) => ({
        ...s,
        id: String(s._id),
        subscriptionDate: s.subscriptionDate ? s.subscriptionDate.toISOString().split("T")[0] : "",
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, fullName, preferredCategories } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Newsletter.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.status === "Unsubscribed") {
        existing.status = "Subscribed";
        await existing.save();
      }
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to the royal couture registry.",
        subscriber: existing,
      });
    }

    const newSub = await Newsletter.create({
      email: normalizedEmail,
      fullName: fullName || "Patron",
      preferredCategories: preferredCategories || ["Bridal Lehengas", "Banarasi Sarees"],
      status: "Subscribed",
    });

    return res.status(201).json({
      success: true,
      message: "Welcome to MONARCH Royal Registry. Exclusive private invitations sent.",
      subscriber: newSub,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email: email.trim().toLowerCase() }, { status: "Unsubscribed" });
    return res.status(200).json({ success: true, message: "Unsubscribed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

