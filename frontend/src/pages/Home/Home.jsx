// ============================================================
//  src/pages/Home/Home.jsx
//
//  The main landing page. Contains:
//   1. Hero banner (header with search)
//   2. ExploreMenu (category filter)
//   3. FoodDisplay  (food grid filtered by category)
// ============================================================

import React, { useState } from "react";
import ExploreMenu         from "../../components/ExploreMenu/ExploreMenu.jsx";
import FoodDisplay         from "../../components/FoodDisplay/FoodDisplay.jsx";
import "./Home.css";

const Home = () => {

  // Tracks which category is selected — "All" means show everything
  const [category, setCategory] = useState("All");

  return (
    <div className="home">

      {/* ── Hero Banner ───────────────────────────────────── */}
      <div className="header">
        <div className="header-contents">
          <h2>Order your favourite food here</h2>
          <p>
            Choose from a diverse menu featuring a delectable array of dishes
            crafted with the finest ingredients.
          </p>
          {/* This button scrolls the user to the menu section */}
          <button onClick={() => {
            document.getElementById("explore-menu").scrollIntoView({ behavior: "smooth" });
          }}>
            View Menu
          </button>
        </div>
      </div>

      {/* ── Category Filter ───────────────────────────────── */}
      <div id="explore-menu">
        <ExploreMenu
          category={category}
          setCategory={setCategory}
        />
      </div>

      {/* ── Food Grid ─────────────────────────────────────── */}
      <FoodDisplay category={category} />

    </div>
  );
};

export default Home;