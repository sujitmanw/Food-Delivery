// ============================================================
//  src/pages/PlaceOrder/PlaceOrder.jsx
//
//  Checkout page where user:
//   1. Fills in their delivery address
//   2. Sees the order total
//   3. Clicks "Pay Now" → redirected to Stripe
// ============================================================

import React, { useContext, useState } from "react";
import { useNavigate }                  from "react-router-dom";
import axios                            from "axios";
import { toast }                        from "react-toastify";
import { StoreContext }                 from "../../context/StoreContext.jsx";
import "./PlaceOrder.css";

const PlaceOrder = () => {

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    BASE_URL,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Delivery address form state
  const [data, setData] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    street:    "",
    city:      "",
    state:     "",
    zipcode:   "",
    country:   "",
    phone:     "",
  });

  // Update any field when user types
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const DELIVERY  = 50;
  const subtotal  = getTotalCartAmount();
  const total     = subtotal + (subtotal > 0 ? DELIVERY : 0);

  // Submit order to the backend → get Stripe URL → redirect
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build the list of ordered items
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,                          // Include name, price, etc.
        quantity: cartItems[item._id],    // Add the ordered quantity
      }));

    const orderData = {
      address: data,
      items:   orderItems,
      amount:  total,
    };

    try {
      const response = await axios.post(
        BASE_URL + "/api/order/place",
        orderData,
        { headers: { token } }            // Auth header
      );

      if (response.data.success) {
        // Redirect to Stripe payment page
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message || "Could not place order");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Redirect to login if not logged in
  if (!token) {
    return (
      <div className="login-required">
        <p>Please log in to place an order.</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <form className="place-order" onSubmit={handleSubmit}>

      {/* ── Left: Address Form ────────────────────────── */}
      <div className="place-order-left">
        <h2>Delivery Information</h2>

        <div className="form-row">
          <input name="firstName" placeholder="First name"  value={data.firstName} onChange={handleChange} required />
          <input name="lastName"  placeholder="Last name"   value={data.lastName}  onChange={handleChange} required />
        </div>

        <input name="email"   type="email" placeholder="Email address" value={data.email}   onChange={handleChange} required />
        <input name="street"              placeholder="Street address" value={data.street}  onChange={handleChange} required />

        <div className="form-row">
          <input name="city"    placeholder="City"    value={data.city}    onChange={handleChange} required />
          <input name="state"   placeholder="State"   value={data.state}   onChange={handleChange} required />
        </div>

        <div className="form-row">
          <input name="zipcode" placeholder="Zip code" value={data.zipcode} onChange={handleChange} required />
          <input name="country" placeholder="Country"  value={data.country} onChange={handleChange} required />
        </div>

        <input name="phone" type="tel" placeholder="Phone number" value={data.phone} onChange={handleChange} required />
      </div>

      {/* ── Right: Order Summary ──────────────────────── */}
      <div className="place-order-right">
        <h2>Order Summary</h2>

        <div className="summary-row">
          <p>Subtotal</p>
          <p>₹{subtotal}</p>
        </div>
        <div className="summary-row">
          <p>Delivery Fee</p>
          <p>₹{subtotal > 0 ? DELIVERY : 0}</p>
        </div>
        <hr />
        <div className="summary-row total-row">
          <b>Total</b>
          <b>₹{total}</b>
        </div>

        <button type="submit" className="pay-btn">
          Proceed to Payment →
        </button>
      </div>

    </form>
  );
};

export default PlaceOrder;