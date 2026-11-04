import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateStatus,
} from "../controllers/product.controllers.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.post("/add", createProduct);
productRouter.post("/bulk-delete", bulkDeleteProducts);
productRouter.post("/bulk-status", bulkUpdateStatus);
productRouter.put("/:id", updateProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.delete("/delete/:id", deleteProduct);

export default productRouter;
