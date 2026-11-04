import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import collectionRouter from "./routes/collection.routes.js";
import adminRouter from "./routes/admin.routes.js";
import customerRouter from "./routes/customer.routes.js";
import atelierRouter from "./routes/atelier.routes.js";
import reviewRouter from "./routes/review.routes.js";
import returnRouter from "./routes/return.routes.js";
import newsletterRouter from "./routes/newsletter.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import shippingRouter from "./routes/shipping.js";
import settingsRouter from "./routes/settings.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import sectionFrameRouter from "./routes/sectionFrame.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import { startTrackingCron } from "./jobs/trackingCron.js";
import { validateEnv } from "./config/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.set("trust proxy", 1);

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/^["']|["']$/g, ""))
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.includes("devtunnels.ms")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly permissive CORS
    },
    credentials: true,
  })
);

const port = process.env.PORT || 8000;
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/admins", adminRouter);
app.use("/api/customers", customerRouter);
app.use("/api/atelier", atelierRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/returns", returnRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/storefront/frames", sectionFrameRouter);
app.use("/api/frames", sectionFrameRouter);
app.use("/api/upload", uploadRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", app: "MONARCH Haute Couture API", timestamp: new Date() });
});

// Centralized error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, error: "Malformed JSON payload in request." });
  }
  console.error("Unhandled API error:", err);
  return res.status(err.status || 500).json({ success: false, error: err.message || "Internal server error" });
});

app.listen(port, () => {
  try {
    validateEnv();
  } catch (e) {
    console.warn("Env validation notice:", e.message);
  }
  connectDb();
  try {
    startTrackingCron();
  } catch (e) {
    console.warn("Cron notice:", e.message);
  }
  console.log(`👑 MONARCH Haute Couture Atelier API running on port ${port}`);
});
