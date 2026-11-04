import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderShipping,
  addOrderNote,
  getOrderInvoice,
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

// Public / Guest / User order creation
orderRouter.post("/", (req, res, next) => {
  // Try isAuth if auth header or cookie present, else proceed as guest
  const hasToken = req.cookies?.token || req.headers.authorization;
  if (hasToken) {
    return isAuth(req, res, next);
  }
  next();
}, createOrder);

orderRouter.post("/cod", (req, res, next) => {
  const hasToken = req.cookies?.token || req.headers.authorization;
  if (hasToken) {
    return isAuth(req, res, next);
  }
  next();
}, createOrder);

// Admin fetches all orders
orderRouter.get("/all", getAllOrders);

// User fetches their own orders
orderRouter.get("/", isAuth, getOrders);

// Single order details
orderRouter.get("/:orderId", getOrderById);
orderRouter.get("/:orderId/invoice", getOrderInvoice);

// Admin updates order status, shipping, notes
orderRouter.put("/:orderId/status", updateOrderStatus);
orderRouter.put("/:orderId/shipping", updateOrderShipping);
orderRouter.post("/:orderId/notes", addOrderNote);

export default orderRouter;
