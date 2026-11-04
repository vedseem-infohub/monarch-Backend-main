import express from "express";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
} from "../controllers/atelier.controllers.js";

const atelierRouter = express.Router();

atelierRouter.post("/book", createBooking);
atelierRouter.post("/", createBooking);
atelierRouter.get("/", getBookings);
atelierRouter.put("/:id/status", updateBookingStatus);

export default atelierRouter;

