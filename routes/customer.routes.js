import express from "express";
import {
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customer.controllers.js";

const customerRouter = express.Router();

customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.put("/:id", updateCustomer);

export default customerRouter;

