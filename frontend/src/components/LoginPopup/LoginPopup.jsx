// ============================================================
//  src/components/LoginPopup/LoginPopup.jsx
//
//  Modal popup that handles both:
//   - Login   (email + password)
//   - Sign Up (name + email + password)
//
//  On success: saves JWT token to localStorage + context
// ============================================================

import React, { useContext, useState } from "react";
import axios                           from "axios";
import { toast }                       from "react-toastify";
import { StoreContext }                from "../../context/StoreContext.jsx";
import "./LoginPopup.css";

// setShowLogin is passed from App.jsx — calling it with false closes this popup
const LoginPopup = ({ setShowLogin }) => {

  const { setToken, BASE_URL } = useContext(StoreContext);

  // Toggle between "Login" and "Sign Up" forms
  const [currentState, setCurrentState] = useState("Login");

  // Form field values
  const [data, setData] = useState({
    name:     "",
    email:    "",
    password: "",
  });

  // Update the relevant field as user types
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Choose the correct API endpoint based on form mode
    const endpoint =
      currentState === "Login"
        ? BASE_URL + "/api/user/login"
        : BASE_URL + "/api/user/register";

    try {
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        // Save the token so the user stays logged in
        const receivedToken = response.data.token;
        setToken(receivedToken);
        localStorage.setItem("token", receivedToken); // Persist across browser sessions

        toast.success(
          currentState === "Login" ? "Welcome back! 👋" : "Account created! 🎉"
        );

        setShowLogin(false); // Close the popup
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    // Clicking the dark overlay closes the popup
    <div className="login-popup-overlay" onClick={() => setShowLogin(false)}>

      {/* Stop clicks inside the form from closing the popup */}
      <div className="login-popup" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="login-popup-header">
          <h2>{currentState}</h2>
          {/* ✕ button closes the popup */}
          <button className="close-btn" onClick={() => setShowLogin(false)}>✕</button>
        </div>

        {/* Form */}
        <form className="login-popup-form" onSubmit={handleSubmit}>

          {/* Name field — only shown on Sign Up */}
          {currentState === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={data.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={data.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars)"
            value={data.password}
            onChange={handleChange}
            required
          />

          {/* Submit button */}
          <button type="submit" className="submit-btn">
            {currentState === "Login" ? "Log In" : "Create Account"}
          </button>

        </form>

        {/* Switch between Login and Sign Up */}
        <p className="login-popup-toggle">
          {currentState === "Login" ? (
            <>
              New here?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>
                Log in
              </span>
            </>
          )}
        </p>

      </div>
    </div>
  );
};

export default LoginPopup;