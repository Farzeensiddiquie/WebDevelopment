import { Link } from "react-router";
import { useState } from "react";
import React from 'react'
import Logo from "../logo/Logo";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <>
      <nav className="navbar">
<Logo/>
<div className={`nav-links ${menuOpen ? "open" : ""}`}>
  <Link to="/">Home</Link>
  <Link to="/recipes">Your Recipes</Link>
  <a href="#about">About</a>
  <a href="#contact">Contact</a>
</div>
<div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
  <div className="line" />
  <div className="line" />
  <div className="line" />
</div>
</nav>
    </>
  )
}

