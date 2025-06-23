import React from 'react'
import Navbar from './components/navbar/Navbar'
import Routing from "./Routing/Routing.js";
import { BrowserRouter } from "react-router-dom";
import './App.css'
import HomeSections from './components/homeSections/HomeSections';
export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <HomeSections/>
    <Routing />
  </BrowserRouter>
  )
}

