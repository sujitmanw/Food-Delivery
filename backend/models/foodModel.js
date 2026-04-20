// ============================================================
//  models/foodModel.js  —  MongoDB schema for a Food item
// ============================================================

import mongoose from "mongoose";

// Define the shape of a food document in the database
const foodSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,   // Cannot save a food without a name
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,   // Price in Indian Rupees (₹)
  },

  image: {
    type: String,     // Filename of the uploaded image e.g. "1720000000000burger.jpg"
    required: true,
  },

  category: {
    type: String,     // e.g. "Burgers", "Pizza", "Salads" …
    required: true,
  },

});

// If the model already exists in Mongoose cache, reuse it (avoids re-compile errors)
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;