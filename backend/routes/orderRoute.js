// ============================================================
//  routes/orderRoute.js
// ============================================================

import express        from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Protected — only logged-in users can place or view their orders
orderRouter.post("/place",      authMiddleware, placeOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

// Public — Stripe redirects back here after payment
orderRouter.post("/verify", verifyOrder);

// Admin routes (add admin middleware here in production)
orderRouter.get("/list",    listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;