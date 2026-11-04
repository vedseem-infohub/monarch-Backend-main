import express from "express";
import {
  getReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} from "../controllers/review.controllers.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getReviews);
reviewRouter.post("/", createReview);
reviewRouter.put("/:id/status", updateReviewStatus);
reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;

