import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./Hero.css";
import { fetchRecipes, fetchRecipesBySearch } from "../../features/counter/RecipesSlice";
import Navbar from "../navbar/Navbar";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

   
    if (value.trim() === '') {
      dispatch(fetchRecipes()); 
    } else {
      dispatch(fetchRecipesBySearch(value)); 
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() === '') {
      dispatch(fetchRecipes());
    } else {
      dispatch(fetchRecipesBySearch(searchTerm));
    }
  };

  return (
    <header className="hero-container">
<Navbar/>

      <div className="hero-content">
        <h1>Find Your Next Favorite Recipe</h1>
        <p>From quick snacks to gourmet meals, search your cravings now!</p>
        <div className="search-bar">
          <input
          name="search"
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search recipes..."
          />
          <button onClick={handleSearchClick}>Search</button> 
        </div>
      </div>
    </header>
  );
};

export default Hero;
