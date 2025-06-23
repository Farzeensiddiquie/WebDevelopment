import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async () => {
    const res = await fetch('https://dummyjson.com/recipes');
    const data = await res.json();
    return data.recipes;
  }
);


export const fetchRecipesBySearch = createAsyncThunk(
  'recipes/fetchRecipesBySearch',
  async (searchTerm) => {
    const res = await fetch(`https://dummyjson.com/recipes/search?q=${searchTerm}`);
    const data = await res.json();
    return data.recipes;
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })


      .addCase(fetchRecipesBySearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecipesBySearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRecipesBySearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default recipesSlice.reducer;
