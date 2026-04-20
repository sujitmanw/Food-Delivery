// ============================================================
//  middleware/auth.js  —  JWT Authentication Middleware
//
//  This runs BEFORE protected route handlers.
//  It reads the token from the request header,
//  verifies it, and adds userId to req.body.
// ============================================================

import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

  // The React frontend sends the token in a custom header called "token"
  const { token } = req.headers;

  // If no token is present, block the request immediately
  if (!token) {
    return res.json({
      success: false,
      message: "Not authorised. Please log in first.",
    });
  }

  try {
    // Decode the token using our secret key
    // If the token is expired or tampered, this will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's ID to req.body so controllers can use it
    req.body.userId = decoded.id;

    // Move on to the actual route handler
    next();

  } catch (error) {
    return res.json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default authMiddleware;