// ============================================================
//  src/main.jsx  —  React App Entry Point
//
//  This file is the starting point of the React application.
//  It renders the <App /> component into the #root div in index.html
// ============================================================

import React    from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";                             // Global styles

import { BrowserRouter }    from "react-router-dom";  // Enables page routing
import StoreContextProvider from "./context/StoreContext.jsx"; // Global state

// Find the <div id="root"> in index.html and mount React inside it
ReactDOM.createRoot(document.getElementById("root")).render(

  // BrowserRouter: allows React Router to work (handles URL changes)
  <BrowserRouter>

    {/* StoreContextProvider: wraps everything so any component
        can access food list, cart, token, etc. */}
    <StoreContextProvider>
      <App />
    </StoreContextProvider>

  </BrowserRouter>
);