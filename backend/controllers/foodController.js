// ============================================================
//  controllers/foodController.js
//  Handles:  Add food | List all food | Remove food
// ============================================================

import foodModel from "../models/foodModel.js";
import fs        from "fs"; // Built-in Node.js module to delete files

// ─── ADD FOOD (Admin only) ─────────────────────────────────
// POST /api/food/add
// Expects: multipart/form-data with { name, description, price, category, image }
const addFood = async (req, res) => {

  // multer saves the uploaded image to /uploads and gives us the filename
  const image_filename = req.file?.filename;

  // Create a new food document using the data from the form
  const food = new foodModel({
    name:        req.body.name,
    description: req.body.description,
    price:       Number(req.body.price), // Convert string → number
    image:       image_filename,
    category:    req.body.category,
  });

  try {
    await food.save(); // Save to MongoDB
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("addFood error:", error);
    res.json({ success: false, message: "Error adding food item" });
  }
};

// ─── LIST ALL FOOD ─────────────────────────────────────────
// GET /api/food/list
// Returns every food item in the database
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}); // {} means "no filter — get all"
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("listFood error:", error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// ─── REMOVE FOOD (Admin only) ──────────────────────────────
// POST /api/food/remove
// Expects: { id: "mongoId" }
const removeFood = async (req, res) => {
  try {
    // First find the food so we can get the image filename
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    // Delete the image file from the /uploads folder
    // () => {} is an empty callback — we ignore file-not-found errors
    fs.unlink(`uploads/${food.image}`, () => {});

    // Delete the food document from MongoDB
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("removeFood error:", error);
    res.json({ success: false, message: "Error removing food item" });
  }
};

export { addFood, listFood, removeFood };