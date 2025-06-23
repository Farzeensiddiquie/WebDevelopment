import Home from "../pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Recipes from "../pages/recipes/Recipes";
export default function Routing() {
  return (
 
<BrowserRouter>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Recipes" element={<Recipes />} />
    </Routes>
</BrowserRouter>
  
  )
}
