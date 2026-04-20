// ============================================================
//  server.js  —  QuickBite Backend Entry Point
//  Run:  npm run dev   (starts on http://localhost:4000)
// ============================================================

import express    from "express";   // Web framework
import cors       from "cors";      // Allow cross-origin requests from React
import mongoose   from "mongoose";  // MongoDB ODM
import dotenv     from "dotenv";    // Load .env variables

// Import our route files
import foodRouter  from "./routes/foodRoute.js";
import userRouter  from "./routes/userRoute.js";
import cartRouter  from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Load environment variables from .env file
dotenv.config();

// Create the Express application
const app  = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ────────────────────────────────────────────
app.use(express.json());   // Parse JSON request bodies
app.use(cors());           // Allow React (port 5173) to call this API

// Serve uploaded food images as static files
// e.g.  http://localhost:4000/images/burger.jpg
app.use("/images", express.static("uploads"));

// ─── Connect to MongoDB ────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  MongoDB connected");
  } catch (err) {
    // If DB fails, stop the app — nothing works without it
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// ─── API Routes ────────────────────────────────────────────
// Every route is prefixed so we know which resource it touches

app.use("/api/food",  foodRouter);   // GET /api/food/list, POST /api/food/add …
app.use("/api/user",  userRouter);   // POST /api/user/register, /api/user/login
app.use("/api/cart",  cartRouter);   // POST /api/cart/add, /api/cart/get …
app.use("/api/order", orderRouter);  // POST /api/order/place, /api/order/verify …

// Health-check route
app.get("/", (req, res) => res.send("🍔 QuickBite API is running!"));

// ─── Start Server ──────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Server running at http://localhost:${PORT}`);
  });
});