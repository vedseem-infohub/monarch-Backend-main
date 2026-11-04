import express from "express";
import {
  getFrames,
  getFrameById,
  createFrame,
  updateFrame,
  deleteFrame,
  reorderFrames,
} from "../controllers/sectionFrame.controllers.js";

const sectionFrameRouter = express.Router();

sectionFrameRouter.get("/", getFrames);
sectionFrameRouter.get("/:id", getFrameById);
sectionFrameRouter.post("/", createFrame);
sectionFrameRouter.put("/reorder", reorderFrames);
sectionFrameRouter.put("/:id", updateFrame);
sectionFrameRouter.delete("/:id", deleteFrame);

export default sectionFrameRouter;

