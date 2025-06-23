import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../../features/counter/RecipesSlice";
import RecipeCard from "../recipeCard/RecipeCard";
import "./Gallery.css";


const Gallery = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.items);
  const status = useSelector((state) => state.recipes.status);
  const error = useSelector((state) => state.recipes.error);

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRecipes());
    }
  }, [status, dispatch]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", !!selectedRecipe);
  }, [selectedRecipe]);

  return (
    <>
      <div className="gallery-wrapper">
    <div className="gallery-container">
        <h2 className="Gallery-heading">Some Sample Recipes</h2>
      <div className="gallery">
        {status === "loading" && <p>Loading recipes...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && (
          recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="thumbnail-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img src={recipe.image} alt={recipe.name} />
                <div className="caption">{recipe.name}</div>
              </div>
            ))
          ) : (
            <p>No recipes found.</p> 
          )
        )}
      </div>
</div>
</div>
      {selectedRecipe && (
        <div className="overlay">
          <div
            className="overlay-bg"
            onClick={() => setSelectedRecipe(null)}
          ></div>
          <div className="overlay-card">
            <RecipeCard recipe={selectedRecipe} />
          </div>
        </div>
        
      )}
    </>
  );
};

export default Gallery;
