// ============================================================
//  controllers/orderController.js
//  Handles:  Place order | Verify payment | User orders |
//            Admin: list all orders | update status
// ============================================================

import orderModel from "../models/orderModel.js";
import userModel  from "../models/userModel.js";
import Stripe     from "stripe";

// Initialise Stripe with our secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Flat delivery charge added to every order
const DELIVERY_CHARGE = 50; // ₹50

// ─── PLACE ORDER ──────────────────────────────────────────
// POST /api/order/place   (protected)
// Body: { items: [...], amount, address }
const placeOrder = async (req, res) => {
  // Where to redirect after Stripe checkout
  const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    // 1. Save the order to the database (payment is still false)
    const newOrder = new orderModel({
      userId:  req.body.userId,
      items:   req.body.items,
      amount:  req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // 2. Clear the user's cart now that the order is placed
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // 3. Build Stripe line items — one per food item
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",            // Indian Rupees
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Stripe uses paise (smallest unit)
      },
      quantity: item.quantity,
    }));

    // 4. Add a separate line item for delivery
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: DELIVERY_CHARGE * 100,
      },
      quantity: 1,
    });

    // 5. Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      // On success → go to /verify?success=true&orderId=…
      success_url: `${FRONTEND}/verify?success=true&orderId=${newOrder._id}`,
      // On cancel  → go to /verify?success=false&orderId=…
      cancel_url: `${FRONTEND}/verify?success=false&orderId=${newOrder._id}`,
    });

    // 6. Return the Stripe URL — React will redirect the user there
    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("placeOrder error:", error);
    res.json({ success: false, message: "Could not place order" });
  }
};

// ─── VERIFY PAYMENT ───────────────────────────────────────
// POST /api/order/verify
// Body: { orderId, success }   ("success" comes from Stripe redirect URL)
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      // Payment succeeded — mark the order as paid
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified ✅" });
    } else {
      // Payment was cancelled — delete the order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed. Order cancelled." });
    }
  } catch (error) {
    console.error("verifyOrder error:", error);
    res.json({ success: false, message: "Verification error" });
  }
};

// ─── GET USER'S ORDERS ────────────────────────────────────
// POST /api/order/userorders   (protected)
// Returns only the orders belonging to the logged-in user
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("userOrders error:", error);
    res.json({ success: false, message: "Could not fetch orders" });
  }
};

// ─── LIST ALL ORDERS (Admin) ──────────────────────────────
// GET /api/order/list
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("listOrders error:", error);
    res.json({ success: false, message: "Could not list orders" });
  }
};

// ─── UPDATE ORDER STATUS (Admin) ──────────────────────────
// POST /api/order/status
// Body: { orderId, status }
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error("updateStatus error:", error);
    res.json({ success: false, message: "Could not update status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };