import express from "express";
import { getDashboardStats } from "../controllers/analytics.controllers.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/dashboard", getDashboardStats);
analyticsRouter.get("/kpis", getDashboardStats);

export default analyticsRouter;

