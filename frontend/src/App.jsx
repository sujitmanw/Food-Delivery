// ============================================================
//  src/App.jsx  —  Root Component
//
//  Defines the overall page layout and all URL routes.
//  Structure:
//    - LoginPopup  (shown on top when user clicks "Sign In")
//    - Navbar      (always visible at top)
//    - <Routes>    (swaps page content based on URL)
//    - Footer      (always visible at bottom)
// ============================================================

import React, { useState } from "react";
import { Route, Routes }   from "react-router-dom";
import { ToastContainer }  from "react-toastify";      // Toast notifications
import "react-toastify/dist/ReactToastify.css";         // Toast styles

// Layout components
import Navbar     from "./components/Navbar/Navbar.jsx";
import Footer     from "./components/Footer/Footer.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx";

// Page components
import Home       from "./pages/Home/Home.jsx";
import Cart       from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Verify     from "./pages/Verify/Verify.jsx";
import MyOrders   from "./pages/MyOrders/MyOrders.jsx";

const App = () => {
  // Controls whether the login/signup popup is visible
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Show login popup overlay when showLogin is true */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      {/* Toast notifications appear anywhere in the app */}
      <ToastContainer />

      {/* Navbar is always visible. We pass setShowLogin so the
          "Sign In" button in Navbar can open the login popup */}
      <Navbar setShowLogin={setShowLogin} />

      {/* Main content area — changes based on the URL */}
      <div className="app">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/order"    element={<PlaceOrder />} />
          <Route path="/verify"   element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>

      {/* Footer is always visible */}
      <Footer />
    </>
  );
};

export default App;