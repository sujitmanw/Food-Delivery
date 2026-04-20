// ============================================================
//  controllers/userController.js
//  Handles:  Register new user | Login existing user
// ============================================================

import userModel from "../models/userModel.js";
import jwt       from "jsonwebtoken";
import bcrypt    from "bcrypt";
import validator from "validator"; // Email format checker

// ─── Helper: Create JWT Token ──────────────────────────────
// Signs a token that expires… never (omitting expiresIn keeps it permanent)
// You can add  { expiresIn: "7d" }  as 3rd arg to make it expire
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// ─── REGISTER ─────────────────────────────────────────────
// POST /api/user/register
// Body: { name, email, password }
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already has an account
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists with this email" });
    }

    // 2. Validate email format  (e.g. missing @ or .com)
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email address" });
    }

    // 3. Enforce minimum password length
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // 4. Hash the password — bcrypt adds a "salt" to prevent rainbow table attacks
    //    saltRounds = 10 is the standard security/performance balance
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Save user to the database
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // 6. Return a JWT so the user is immediately logged in
    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    console.error("registerUser error:", error);
    res.json({ success: false, message: "Registration failed. Try again." });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────
// POST /api/user/login
// Body: { email, password }
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "No account found with this email" });
    }

    // 2. Compare the entered password with the hashed one in the database
    //    bcrypt.compare handles the salt automatically
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // 3. Passwords match — issue a JWT token
    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    console.error("loginUser error:", error);
    res.json({ success: false, message: "Login failed. Try again." });
  }
};

export { registerUser, loginUser };