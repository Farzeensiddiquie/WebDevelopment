import React from "react";
import Routing from "./Routing/Routing.js";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.js";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}
