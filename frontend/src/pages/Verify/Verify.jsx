// ============================================================
//  src/pages/Verify/Verify.jsx
//
//  This page is where Stripe redirects the user after payment.
//  URL will be either:
//    /verify?success=true&orderId=abc123   (payment succeeded)
//    /verify?success=false&orderId=abc123  (payment cancelled)
//
//  It calls the backend to confirm or cancel the order,
//  then redirects the user to /myorders or /
// ============================================================

import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios                             from "axios";
import { useContext }                    from "react";
import { StoreContext }                  from "../../context/StoreContext.jsx";
import "./Verify.css";

const Verify = () => {

  const { BASE_URL } = useContext(StoreContext);
  const navigate     = useNavigate();

  // Read query parameters from the URL
  // e.g. /verify?success=true&orderId=abc  →  success="true", orderId="abc"
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Tell the backend whether payment succeeded
        const response = await axios.post(BASE_URL + "/api/order/verify", {
          success,
          orderId,
        });

        if (response.data.success) {
          // Payment confirmed → go to My Orders
          navigate("/myorders");
        } else {
          // Payment failed → go back to home
          navigate("/");
        }
      } catch (error) {
        // Network error — fallback to home
        navigate("/");
      }
    };

    verifyPayment();
  }, []); // Run once when the page mounts

  return (
    // Show a spinner while we wait for the backend response
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying your payment...</p>
    </div>
  );
};

export default Verify;