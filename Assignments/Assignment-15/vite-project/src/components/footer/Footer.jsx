import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="logo">🍳 RecipeGallery</h3>
        <p>Your one-stop destination for delicious and easy-to-follow recipes.</p>
        
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
        </div>

        <p className="footer-bottom">© {new Date().getFullYear()} RecipeGallery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
