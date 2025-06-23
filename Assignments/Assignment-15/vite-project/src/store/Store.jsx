import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from '../features/counter/AddRecipesSlice';
import recipesSlice from '../features/counter/RecipesSlice';  // Keep this slice for old UI if necessary

const store = configureStore({
  reducer: {
    recipes: recipesSlice,    // Old UI state here (if used for something different)
    firebaseRecipes: recipeReducer, // Firebase-based recipes state here
  },
});

export default store;
