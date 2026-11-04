import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
