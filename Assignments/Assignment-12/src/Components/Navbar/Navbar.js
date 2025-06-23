import React from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../Button/Button.js";
import "./Navbar.css";
import Logo from '../Logo/Logo.js';
const Navbar = () => {
  const location = useLocation();

  return (


    <nav className="navbar">
      <Logo/>
    <div className="nav-list-container">
      <ul className="navbar-list">
        <li className={`navbar-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/About" ? "active" : ""}`}>
          <Link to="/About" className="navbar-link">About Us</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/Buying" ? "active" : ""}`}>
          <Link to="/Buying" className="navbar-link">Buying</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/Renting" ? "active" : ""}`}>
          <Link to="/Renting" className="navbar-link">Renting</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/Selling" ? "active" : ""}`}>
          <Link to="/Selling" className="navbar-link">Selling</Link>
        </li>
        <li className={`navbar-item ${location.pathname === "/Contact" ? "active" : ""}`}>
          <Link to="/Contact" className="navbar-link">Contact Us</Link>
        </li>
        <li className={`login navbar-item ${location.pathname === "/Login" ? "active" : ""}`}>
          <Link to="/Login" className="navbar-link">Login</Link>
        </li>
        
        <li>
        <Link to="/Signup" className="navbar-link">
        <Button text="Sign Up" width="80px"  height="40px" fontSize="15px"marginTop="3px"/>
        </Link>
        </li>

      </ul>
      </div>
    </nav>
    
  );
};

export default Navbar;