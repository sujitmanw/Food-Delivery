// ============================================================
//  models/userModel.js  —  MongoDB schema for a User
// ============================================================

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,   // No two users can share an email
    },

    password: {
      type: String,
      required: true, // Stored as a bcrypt hash — NEVER plain text
    },

    // cartData stores  { "foodId": quantity }
    // Example:  { "64abc": 2, "64def": 1 }
    cartData: {
      type: Object,
      default: {},    // New users start with an empty cart
    },
  },
  {
    // minimize: false  → keeps empty objects ({}) in the DB
    // Without this, Mongoose removes empty cartData fields
    minimize: false,
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;