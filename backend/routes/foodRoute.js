// ============================================================
//  routes/foodRoute.js
//  Multer handles file upload; image saved to /uploads folder
// ============================================================

import express from "express";
import multer  from "multer";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// ─── Multer Storage Config ─────────────────────────────────
const storage = multer.diskStorage({
  destination: "uploads",  // Save to /uploads folder
  filename: (req, file, cb) => {
    // Prefix with timestamp to avoid name collisions
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
foodRouter.post("/add",    upload.single("image"), addFood);  // POST with image
foodRouter.get("/list",    listFood);                          // GET — no auth needed
foodRouter.post("/remove", removeFood);                        // POST — admin only

export default foodRouter;