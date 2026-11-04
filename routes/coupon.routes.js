import express from "express";
import {
  getAllCouponsAdmin,
  createCouponAdmin,
  updateCouponAdmin,
  toggleCouponAdmin,
  deleteCouponAdmin,
  validateCoupon,
  getActiveCouponsPublic,
} from "../controllers/coupon.controllers.js";

const couponRouter = express.Router();

// Root routes for admin panel and storefront
couponRouter.get("/", getAllCouponsAdmin);
couponRouter.post("/", createCouponAdmin);
couponRouter.put("/:id", updateCouponAdmin);
couponRouter.delete("/:id", deleteCouponAdmin);

// Public / Customer routes
couponRouter.post("/validate", validateCoupon);
couponRouter.get("/active", getActiveCouponsPublic);

// Admin prefixed routes for backward compatibility
couponRouter.get("/admin", getAllCouponsAdmin);
couponRouter.post("/admin", createCouponAdmin);
couponRouter.put("/admin/:id", updateCouponAdmin);
couponRouter.patch("/admin/:id/toggle", toggleCouponAdmin);
couponRouter.delete("/admin/:id", deleteCouponAdmin);

export default couponRouter;
