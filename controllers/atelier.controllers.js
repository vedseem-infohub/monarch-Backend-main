import AtelierBooking from "../models/atelier.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      clientName,
      email,
      phone,
      locationSlug,
      salonName,
      experienceType,
      preferredDate,
      preferredTimeSlot,
      weddingDate,
      budgetTier,
      notes,
      interestedProducts,
    } = req.body;

    if (!clientName || !email || !phone || !preferredDate) {
      return res.status(400).json({ message: "Name, email, phone, and preferred date are required" });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `MNR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${randomSuffix}`;

    const newBooking = await AtelierBooking.create({
      bookingReference,
      clientName,
      email,
      phone,
      locationSlug: locationSlug || "new-delhi-mehrauli",
      salonName: salonName || "The Darbar Hall · Mehrauli, New Delhi",
      experienceType: experienceType || "BRIDAL_TROUSSEAU",
      preferredDate: new Date(preferredDate),
      preferredTimeSlot: preferredTimeSlot || "11:00 AM - 01:00 PM",
      weddingDate: weddingDate ? new Date(weddingDate) : null,
      budgetTier: budgetTier || "ROYAL_HERITAGE",
      notes: notes || "",
      interestedProducts: interestedProducts || [],
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Atelier consultation requested successfully. Our royal concierge will contact you.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { status, limit } = req.query;
    let filter = {};
    if (status && status !== "ALL") {
      filter.status = status;
    }

    let query = AtelierBooking.find(filter).sort({ preferredDate: 1, createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const bookings = await query;
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedStylist } = req.body;

    const booking = await AtelierBooking.findOne({
      $or: [{ bookingReference: id }, ...(/^[0-9a-fA-F]{24}$/.test(id) ? [{ _id: id }] : [])],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    if (assignedStylist) booking.assignedStylist = assignedStylist;

    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

