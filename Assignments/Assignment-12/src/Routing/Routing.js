import React from "react";

import { Route, Routes } from "react-router-dom";
import Home from "./../Pages/Home/Home.js";
import About from "./../Pages/About/About";
import Contact from "./../Pages/Contact/Contact";
import Buying from "./../Pages/Buying/Buying";
import Selling from "./../Pages/Selling/Selling";
import Renting from "./../Pages/Renting/Renting";
import Login from "./../Pages/Login/Login";
import Signup from "./../Pages/Signup/Signup";
export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Buying" element={<Buying />} />
      <Route path="/Selling" element={<Selling />} />
      <Route path="/Renting" element={<Renting />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
