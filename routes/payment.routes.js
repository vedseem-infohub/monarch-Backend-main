import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createRazorpayOrder, verifyPayment, webhookHandler, getAllPayments } from "../controllers/payment.controllers.js";

const paymentRouter = express.Router();

paymentRouter.get("/all", getAllPayments);
paymentRouter.get("/", getAllPayments);

const optionalAuth = (req, res, next) => {
  const hasToken = req.cookies?.token || req.headers.authorization;
  if (hasToken) {
    return isAuth(req, res, next);
  }
  next();
};

paymentRouter.post("/create-order", optionalAuth, createRazorpayOrder);
paymentRouter.post("/verify", optionalAuth, verifyPayment);
paymentRouter.post("/webhook", webhookHandler); // No auth for webhook

export default paymentRouter;
