import express from "express";
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collection.controllers.js";

const collectionRouter = express.Router();

collectionRouter.get("/", getCollections);
collectionRouter.get("/:id", getCollectionById);
collectionRouter.post("/", createCollection);
collectionRouter.put("/:id", updateCollection);
collectionRouter.delete("/:id", deleteCollection);

export default collectionRouter;

