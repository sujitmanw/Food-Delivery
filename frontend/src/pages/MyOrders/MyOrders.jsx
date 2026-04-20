// ============================================================
//  src/pages/MyOrders/MyOrders.jsx
//
//  Shows the logged-in user's full order history.
//  Each order card shows:
//   - Food emoji icon
//   - Item names + quantities
//   - Total amount
//   - Number of items
//   - Order status (e.g. "Food Processing", "Out for Delivery")
//   - "Track Order" button
// ============================================================

import React, { useContext, useEffect, useState } from "react";
import axios                                       from "axios";
import { StoreContext }                            from "../../context/StoreContext.jsx";
import "./MyOrders.css";

const MyOrders = () => {

  const { BASE_URL, token } = useContext(StoreContext);

  // List of orders for this user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from the backend when the component mounts
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/order/userorders",
        {},                          // Empty body — userId comes from the token
        { headers: { token } }
      );

      if (response.data.success) {
        // Show newest orders first
        setOrders(response.data.data.reverse());
      }
    } catch (error) {
      console.error("fetchOrders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]); // Re-fetch whenever the token changes (e.g. on login)

  // Status → colour mapping for the status badge
  const statusColor = (status) => {
    if (status === "Delivered")        return "#22c55e"; // Green
    if (status === "Out for Delivery") return "#f59e0b"; // Amber
    return "#e8402a";                                    // Red (Processing)
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {/* Loading state */}
      {loading && <p className="orders-msg">Loading your orders...</p>}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <p className="orders-msg">You haven't placed any orders yet.</p>
      )}

      {/* Order cards */}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">

            {/* Left: icon */}
            <div className="order-icon">🍽️</div>

            {/* Middle: item list */}
            <div className="order-details">
              {/* Map items array to "Name x Qty" strings, joined with commas */}
              <p className="order-items">
                {order.items
                  .map((item) => `${item.name} x${item.quantity}`)
                  .join(", ")}
              </p>
              <p className="order-amount">₹{order.amount}</p>
              <p className="order-count">Items: {order.items.length}</p>
            </div>

            {/* Right: status + button */}
            <div className="order-status-col">
              {/* Coloured dot + status text */}
              <p className="order-status">
                <span
                  className="status-dot"
                  style={{ background: statusColor(order.status) }}
                />
                {order.status}
              </p>

              {/* Refresh button — re-fetches from backend */}
              <button
                className="track-btn"
                onClick={fetchOrders}
              >
                Track Order
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;