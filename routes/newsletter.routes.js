import express from "express";
import {
  getSubscribers,
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "../controllers/newsletter.controllers.js";

const newsletterRouter = express.Router();

newsletterRouter.get("/", getSubscribers);
newsletterRouter.post("/subscribe", subscribeNewsletter);
newsletterRouter.post("/", subscribeNewsletter);
newsletterRouter.post("/unsubscribe", unsubscribeNewsletter);

export default newsletterRouter;

