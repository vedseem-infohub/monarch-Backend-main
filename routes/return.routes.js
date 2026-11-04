import express from "express";
import {
  getReturns,
  createReturn,
  updateReturnStatus,
} from "../controllers/return.controllers.js";

const returnRouter = express.Router();

returnRouter.get("/", getReturns);
returnRouter.post("/", createReturn);
returnRouter.put("/:id/status", updateReturnStatus);

export default returnRouter;

