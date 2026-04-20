// ============================================================
//  src/context/StoreContext.jsx
//
//  This is the "global store" for our app.
//  It uses React Context so any component can access:
//    - food_list     : all food items from the database
//    - cartItems     : what the user has in their cart
//    - token         : the user's JWT login token
//    - addToCart / removeFromCart / getTotalCartAmount
// ============================================================

import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create the context object
// Other components import this and use useContext(StoreContext)
export const StoreContext = createContext(null);

// The URL of our backend API
const BASE_URL = "http://localhost:4000";

const StoreContextProvider = ({ children }) => {

  // ── State Variables ──────────────────────────────────────
  const [food_list, setFoodList]   = useState([]);   // All food items from DB
  const [cartItems, setCartItems]  = useState({});   // { foodId: quantity }
  const [token, setToken]          = useState("");   // JWT auth token

  // ── Add Item to Cart ─────────────────────────────────────
  const addToCart = async (itemId) => {
    // Update local state immediately (optimistic update — feels instant)
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    // If user is logged in, also sync to the backend database
    if (token) {
      await axios.post(
        BASE_URL + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // ── Remove Item from Cart ─────────────────────────────────
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0), // Never go below 0
    }));

    if (token) {
      await axios.post(
        BASE_URL + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // ── Calculate Total Cart Value ────────────────────────────
  const getTotalCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        // Find the food item in our list to get its price
        const itemInfo = food_list.find((food) => food._id === itemId);
        if (itemInfo) {
          total += itemInfo.price * cartItems[itemId];
        }
      }
    }

    return total;
  };

  // ── Load All Food from Backend ────────────────────────────
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(BASE_URL + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("fetchFoodList error:", error);
    }
  };

  // ── Load Cart from Backend (for logged-in users) ──────────
  const loadCartData = async (userToken) => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("loadCartData error:", error);
    }
  };

  // ── On App Load ───────────────────────────────────────────
  // This runs once when the app first opens
  useEffect(() => {
    const init = async () => {
      await fetchFoodList(); // Always load food

      // Check if user was logged in from a previous session
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken); // Restore their cart
      }
    };

    init();
  }, []); // Empty array = run once on mount

  // ── Context Value (everything components can access) ──────
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    BASE_URL,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;