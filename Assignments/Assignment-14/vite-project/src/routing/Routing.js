import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Freinds from "../pages/freinds/Freinds";
import Gaming from "../pages/gaming/Gaming";
import Videos from "../pages/videopage/Videos.js";
import Groups from "../pages/groups/Groups";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Freinds" element={<Freinds />} />
      <Route path="/Gaming" element={<Gaming />} />
      <Route path="/Videos" element={<Videos />} />
      <Route path="/Groups" element={<Groups />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}
