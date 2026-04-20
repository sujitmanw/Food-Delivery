// ============================================================
//  src/components/ExploreMenu/ExploreMenu.jsx
//
//  Horizontal scrollable row of category filter buttons.
//  Clicking a category sets it as active and filters the food grid.
// ============================================================

import React from "react";
import "./ExploreMenu.css";

// Category data — emoji + label
const menu_list = [
  { menu_name: "Salad",      menu_image: "🥗" },
  { menu_name: "Rolls",      menu_image: "🌯" },
  { menu_name: "Deserts",    menu_image: "🍰" },
  { menu_name: "Sandwich",   menu_image: "🥪" },
  { menu_name: "Cake",       menu_image: "🎂" },
  { menu_name: "Pure Veg",   menu_image: "🥦" },
  { menu_name: "Pasta",      menu_image: "🍝" },
  { menu_name: "Noodles",    menu_image: "🍜" },
];

const ExploreMenu = ({ category, setCategory }) => {
  // category      : currently selected category (from Home state)
  // setCategory   : updates the selected category in Home

  const handleClick = (name) => {
    // Clicking the active category again resets the filter to "All"
    setCategory((prev) => (prev === name ? "All" : name));
  };

  return (
    <section className="explore-menu">

      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients.
      </p>

      {/* Scrollable row of category cards */}
      <div className="explore-menu-list">
        {menu_list.map((item) => (
          <div
            key={item.menu_name}
            className={`menu-item ${category === item.menu_name ? "active" : ""}`}
            onClick={() => handleClick(item.menu_name)}
          >
            {/* Circle emoji image */}
            <div className="menu-item-img">{item.menu_image}</div>
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>

      {/* Divider line below the menu row */}
      <hr />
    </section>
  );
};

export default ExploreMenu;