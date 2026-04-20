// ============================================================
//  models/orderModel.js  —  MongoDB schema for an Order
// ============================================================

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true, // Which user placed this order
  },

  items: {
    type: Array,
    required: true, // Array of food objects with quantities
    // Example: [{ name:"Burger", price:249, quantity:2 }, …]
  },

  amount: {
    type: Number,
    required: true, // Total amount including delivery charge
  },

  address: {
    type: Object,
    required: true, // Delivery address details
    // Example: { firstName:"Sujit", street:"12 MG Road", city:"Delhi" … }
  },

  status: {
    type: String,
    default: "Food Processing", // Order lifecycle stages:
    // "Food Processing" → "Out for Delivery" → "Delivered"
  },

  date: {
    type: Date,
    default: Date.now, // Automatically set when order is created
  },

  payment: {
    type: Boolean,
    default: false, // Becomes true after Stripe payment is confirmed
  },

});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;