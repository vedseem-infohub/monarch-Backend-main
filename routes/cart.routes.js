import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
  getAdminAbandonedCarts,
} from "../controllers/cart.controllers.js";

const cartRouter = express.Router();

cartRouter.get("/admin/all", getAdminAbandonedCarts);
cartRouter.get("/admin/abandoned", getAdminAbandonedCarts);
cartRouter.get("/", isAuth, getCart);
cartRouter.post("/add", isAuth, addToCart);
cartRouter.put("/update", isAuth, updateCartItem);
cartRouter.delete("/clear", isAuth, clearCart);

export default cartRouter;
