// ============================================================
//  src/components/FoodItem/FoodItem.jsx
//
//  A single food card shown in the grid.
//  Displays: image, name, description, star rating, price,
//            and an Add to Cart / quantity control.
// ============================================================

import React, { useContext } from "react";
import { StoreContext }      from "../../context/StoreContext.jsx";
import "./FoodItem.css";

const FoodItem = ({ id, name, price, description, image }) => {

  // Get cart data and cart actions from global context
  const { cartItems, addToCart, removeFromCart, BASE_URL } = useContext(StoreContext);

  // How many of this item is currently in the cart
  const itemCount = cartItems[id] || 0;

  return (
    <div className="food-item">

      {/* Image section */}
      <div className="food-item-img-container">
        {/* Image served by our backend at /images/filename.jpg */}
        <img
          src={`${BASE_URL}/images/${image}`}
          alt={name}
          className="food-item-image"
          // Fallback emoji if image fails to load
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* Add to Cart button / Quantity controls */}
        <div className="food-item-counter">
          {itemCount === 0 ? (
            // Not in cart → show a simple "+" button
            <button
              className="add-btn"
              onClick={() => addToCart(id)}
            >
              +
            </button>
          ) : (
            // Already in cart → show - count + controls
            <div className="quantity-control">
              <button onClick={() => removeFromCart(id)}>−</button>
              <span>{itemCount}</span>
              <button onClick={() => addToCart(id)}>+</button>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="food-item-info">

        {/* Name + star rating on the same row */}
        <div className="food-item-name-rating">
          <p className="food-name">{name}</p>
          {/* Static 4-star rating (you can make this dynamic later) */}
          <span className="rating">⭐ 4.0</span>
        </div>

        {/* Short description */}
        <p className="food-item-desc">{description}</p>

        {/* Price */}
        <p className="food-item-price">₹{price}</p>

      </div>
    </div>
  );
};

export default FoodItem;