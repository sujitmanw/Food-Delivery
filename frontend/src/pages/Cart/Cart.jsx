// ============================================================
//  src/pages/Cart/Cart.jsx
//
//  Shows all items in the user's cart with:
//   - Item name, price, quantity, subtotal
//   - Remove button
//   - Order subtotal, delivery fee, total
//   - "Proceed to Checkout" button
// ============================================================

import React, { useContext }  from "react";
import { useNavigate }         from "react-router-dom";
import { StoreContext }        from "../../context/StoreContext.jsx";
import "./Cart.css";

const Cart = () => {

  const {
    cartItems,           // { foodId: quantity }
    food_list,           // All food items from the database
    removeFromCart,      // Function to decrease quantity
    getTotalCartAmount,  // Returns total price of all items
    BASE_URL,
  } = useContext(StoreContext);

  const navigate   = useNavigate();
  const DELIVERY   = 50; // ₹50 flat delivery charge
  const subtotal   = getTotalCartAmount();
  const grandTotal = subtotal + (subtotal > 0 ? DELIVERY : 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {/* Cart items table */}
      <div className="cart-items">

        {/* Header row */}
        <div className="cart-items-header">
          <p>Item</p>
          <p>Name</p>
          <p>Price</p>
          <p>Qty</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {/* One row per unique food item in the cart */}
        {food_list.map((item) => {
          // Only show items that are actually in the cart
          if (!cartItems[item._id] || cartItems[item._id] === 0) return null;

          return (
            <div key={item._id}>
              <div className="cart-items-row">

                {/* Food image */}
                <img
                  src={`${BASE_URL}/images/${item.image}`}
                  alt={item.name}
                  onError={(e) => { e.target.src = ""; }}
                />

                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>₹{item.price * cartItems[item._id]}</p>

                {/* Remove button (decreases by 1 per click) */}
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  ✕
                </button>

              </div>
              <hr />
            </div>
          );
        })}
      </div>

      {/* Empty cart state */}
      {subtotal === 0 && (
        <div className="cart-empty">
          <p>🛒 Your cart is empty.</p>
          <button onClick={() => navigate("/")}>Browse Menu</button>
        </div>
      )}

      {/* Price summary — only shown if cart has items */}
      {subtotal > 0 && (
        <div className="cart-bottom">

          {/* Order summary */}
          <div className="cart-total">
            <h3>Order Summary</h3>

            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{DELIVERY}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{grandTotal}</b>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/order")}
            >
              Proceed to Checkout →
            </button>
          </div>

          {/* Promo code box */}
          <div className="cart-promocode">
            <h3>Have a promo code?</h3>
            <p>Enter your promo code for a discount</p>
            <div className="promo-input">
              <input type="text" placeholder="Enter promo code" />
              <button>Apply</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;