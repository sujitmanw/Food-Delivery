// ============================================================
//  src/components/Footer/Footer.jsx
// ============================================================

import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* Brand column */}
        <div className="footer-col">
          <h2 className="footer-logo">Quick<span>Bite</span></h2>
          <p>
            Delicious food delivered fast to your doorstep. Quality meals from
            the best local restaurants.
          </p>
          {/* Social icons (plain text / emoji for simplicity) */}
          <div className="footer-socials">
            <span>📘</span>
            <span>🐦</span>
            <span>📸</span>
          </div>
        </div>

        {/* Company links column */}
        <div className="footer-col">
          <h3>Company</h3>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="footer-col">
          <h3>Get In Touch</h3>
          <ul>
            <li>+91 98765 43210</li>
            <li>contact@quickbite.in</li>
          </ul>
        </div>

      </div>

      {/* Bottom copyright bar */}
      <hr />
      <p className="footer-copyright">
        © {new Date().getFullYear()} QuickBite — All rights reserved.
      </p>

    </footer>
  );
};

export default Footer;