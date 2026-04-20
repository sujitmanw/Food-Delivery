// ============================================================
//  controllers/cartController.js
//  Handles:  Add to cart | Remove from cart | Get cart
//
//  Cart is stored inside the User document as:
//  cartData: { "foodId1": 2, "foodId2": 1 }
// ============================================================

import userModel from "../models/userModel.js";

// ─── ADD ITEM TO CART ──────────────────────────────────────
// POST /api/cart/add       (protected — needs auth token)
// Body: { itemId }   (userId is added by authMiddleware)
const addToCart = async (req, res) => {
  try {
    // Fetch the user's current data from the database
    const userData = await userModel.findById(req.body.userId);
    const cartData = userData.cartData;   // e.g. { "abc123": 1 }

    const itemId = req.body.itemId;

    if (!cartData[itemId]) {
      // Item not in cart yet — add it with quantity 1
      cartData[itemId] = 1;
    } else {
      // Item already in cart — increase quantity by 1
      cartData[itemId] += 1;
    }

    // Save the updated cart back to the database
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    res.json({ success: true, message: "Item added to cart" });

  } catch (error) {
    console.error("addToCart error:", error);
    res.json({ success: false, message: "Could not add item to cart" });
  }
};

// ─── REMOVE ITEM FROM CART ─────────────────────────────────
// POST /api/cart/remove    (protected)
// Body: { itemId }
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = userData.cartData;

    const itemId = req.body.itemId;

    if (cartData[itemId] && cartData[itemId] > 0) {
      // Decrease quantity by 1
      cartData[itemId] -= 1;
    }

    // If quantity reaches 0 we leave it as 0 (front-end hides it)
    // Or you can delete it:  delete cartData[itemId];

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    res.json({ success: true, message: "Item removed from cart" });

  } catch (error) {
    console.error("removeFromCart error:", error);
    res.json({ success: false, message: "Could not remove item from cart" });
  }
};

// ─── GET CART DATA ─────────────────────────────────────────
// POST /api/cart/get       (protected)
// Body: {}   (userId added by middleware)
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    // Return just the cartData object to the React frontend
    res.json({ success: true, cartData: userData.cartData });

  } catch (error) {
    console.error("getCart error:", error);
    res.json({ success: false, message: "Could not fetch cart" });
  }
};

export { addToCart, removeFromCart, getCart };