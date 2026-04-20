// ============================================================
//  routes/cartRoute.js
//  All routes protected — user must be logged in
// ============================================================

import express      from "express";
import authMiddleware from "../middleware/auth.js";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

// authMiddleware runs first → verifies JWT → adds userId to req.body
cartRouter.post("/add",    authMiddleware, addToCart);      // POST /api/cart/add
cartRouter.post("/remove", authMiddleware, removeFromCart); // POST /api/cart/remove
cartRouter.post("/get",    authMiddleware, getCart);        // POST /api/cart/get

export default cartRouter;