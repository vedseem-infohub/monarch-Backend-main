import mongoose from "mongoose";

const atelierBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    locationSlug: {
      type: String,
      default: "new-delhi-mehrauli",
    },
    salonName: {
      type: String,
      default: "The Darbar Hall · Mehrauli, New Delhi",
    },
    experienceType: {
      type: String,
      enum: ["BRIDAL_TROUSSEAU", "HAUTE_COUTURE_BESPOKE", "HERITAGE_SARIS_CURATION", "VIRTUAL_VIP_STYLING"],
      default: "BRIDAL_TROUSSEAU",
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      default: "11:00 AM - 01:00 PM",
    },
    weddingDate: {
      type: Date,
      default: null,
    },
    budgetTier: {
      type: String,
      enum: ["IMPERIAL_SIGNATURE", "ROYAL_HERITAGE", "BESPOKE_MONARCH"],
      default: "ROYAL_HERITAGE",
    },
    notes: {
      type: String,
      default: "",
    },
    interestedProducts: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "RESCHEDULED", "IN_SALON_VISIT", "COMPLETED", "CANCELLED", "NO_SHOW"],
      default: "PENDING",
      index: true,
    },
    assignedStylist: {
      type: String,
      default: "Senior Draper Ustad Rehmat",
    },
  },
  {
    timestamps: true,
  }
);

atelierBookingSchema.index({ createdAt: -1 });

const AtelierBooking = mongoose.models.AtelierBooking || mongoose.model("AtelierBooking", atelierBookingSchema);
export default AtelierBooking;

