import React, { useState } from "react";
import "./RecipeCard.css";
import Logo from "../logo/Logo";
const RecipeCard = ({ recipe }) => {
  const [checked, setChecked] = useState({ ingredients: new Set(), instructions: new Set() });

  const toggleCheck = (type, index) => {
    const updated = new Set(checked[type]);
    updated.has(index) ? updated.delete(index) : updated.add(index);
    setChecked(prev => ({ ...prev, [type]: updated }));
  };

  return (
    <div className="elegant-card">
      <div className="elegant-img-wrap">
        <img src={recipe.image} alt={recipe.name} className="elegant-img" />
      </div>
      <div className="elegant-content">
        <Logo/>
        <h2>{recipe.name}</h2>
        <div className="elegant-meta">
          <span>{recipe.cuisine} • {recipe.mealType.join(', ')}</span>
          <span className="rating">⭐ {recipe.rating} ({recipe.reviewCount})</span>
        </div>
        <div className="elegant-tags">
          {recipe.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
        </div>
        <div className="elegant-details">
          <span><strong>Prep:</strong> {recipe.prepTimeMinutes} min</span>
          <span><strong>Cook:</strong> {recipe.cookTimeMinutes} min</span>
          <span><strong>Serves:</strong> {recipe.servings}</span>
          <span><strong>Calories:</strong> {recipe.caloriesPerServing}</span>
        </div>

        <div className="elegant-section">
          <h3>🛒 Ingredients</h3>
          {recipe.ingredients.map((item, i) => (
            <label key={i} className={`checkbox ${checked.ingredients.has(i) ? 'checked' : ''}`}>
              <input type="checkbox" onChange={() => toggleCheck('ingredients', i)} />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <div className="elegant-section">
          <h3>👨‍🍳 Instructions</h3>
          {recipe.instructions.map((step, i) => (
            <label key={i} className={`checkbox ${checked.instructions.has(i) ? 'checked' : ''}`}>
              <input type="checkbox" onChange={() => toggleCheck('instructions', i)} />
              <span>{step}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
