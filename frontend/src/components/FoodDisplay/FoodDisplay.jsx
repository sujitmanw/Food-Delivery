// ============================================================
//  src/components/FoodDisplay/FoodDisplay.jsx
//
//  Renders the grid of FoodItem cards.
//  Filters the food_list based on the selected category.
// ============================================================

import React, { useContext } from "react";
import { StoreContext }      from "../../context/StoreContext.jsx";
import FoodItem              from "../FoodItem/FoodItem.jsx";
import "./FoodDisplay.css";

// category : the currently selected filter (e.g. "Pizza" or "All")
const FoodDisplay = ({ category }) => {

  // Get the full food list from global context (fetched from backend)
  const { food_list } = useContext(StoreContext);

  return (
    <section className="food-display">

      <h2>Top Dishes Near You</h2>

      {/* Responsive grid of food cards */}
      <div className="food-display-list">
        {food_list.map((item) => {

          // Show the item if:
          //  1. No category filter selected ("All")
          //  2. The item's category matches the selected one
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}           // Unique MongoDB ID
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }

          // Don't render items that don't match the category
          return null;
        })}
      </div>

      {/* Empty state — shown when no items match the filter */}
      {food_list.filter(
        (item) => category === "All" || item.category === category
      ).length === 0 && (
        <p className="no-items">No items found in this category.</p>
      )}

    </section>
  );
};

export default FoodDisplay;