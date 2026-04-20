// ============================================================
//  src/components/Navbar/Navbar.jsx
//
//  Top navigation bar with:
//   - Logo
//   - Nav links (Home, Menu, Mobile App, Contact Us)
//   - Cart icon with item count badge
//   - Sign In / profile button
// ============================================================

import React, { useContext, useState } from "react";
import { Link, useNavigate }           from "react-router-dom";
import { StoreContext }                from "../../context/StoreContext.jsx";
import "./Navbar.css";

// setShowLogin is passed from App.jsx to open the login popup
const Navbar = ({ setShowLogin }) => {

  // Which nav link is currently active (for underline highlight)
  const [activeMenu, setActiveMenu] = useState("home");

  // Get cart items and token from global context
  const { cartItems, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  // Count total items in the cart (sum all quantities)
  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  // Log out: clear token from state and localStorage, go to home
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo — clicking takes you home */}
      <Link to="/" className="navbar-logo">
        Quick<span>Bite</span>
      </Link>

      {/* Navigation links */}
      <ul className="navbar-menu">
        {["home", "menu", "mobile-app", "contact-us"].map((item) => (
          <li
            key={item}
            className={activeMenu === item ? "active" : ""}
            onClick={() => setActiveMenu(item)}
          >
            {/* Capitalise and replace hyphens for display */}
            {item.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </li>
        ))}
      </ul>

      {/* Right side: cart icon + auth button */}
      <div className="navbar-right">

        {/* Cart icon — Link navigates to /cart page */}
        <Link to="/cart" className="navbar-cart">
          🛒
          {/* Badge showing number of items in cart */}
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {/* If logged in: show profile dropdown; else show Sign In button */}
        {token ? (
          <div className="navbar-profile">
            <span className="profile-icon">👤</span>
            {/* Dropdown menu appears on hover (CSS handles this) */}
            <ul className="profile-dropdown">
              <li onClick={() => navigate("/myorders")}>📦 My Orders</li>
              <li onClick={handleLogout}>🚪 Logout</li>
            </ul>
          </div>
        ) : (
          <button
            className="navbar-signin"
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;