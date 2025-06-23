import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase"; // Import the db from firebase.js

// Create recipe async thunk
export const createRecipe = createAsyncThunk(
    "recipes/createRecipe",
    async (recipeData, { rejectWithValue }) => {
        try {
            const docRef = await addDoc(collection(db, "recipes"), recipeData);
            console.log("Document written with ID: ", docRef.id);
            return { id: docRef.id, ...recipeData };
        } catch (e) {
            console.error("Error adding document: ", e);
            return rejectWithValue(e.message);
        }
    }
);

// Get recipes async thunk
export const getRecipes = createAsyncThunk(
    "recipes/getRecipes",
    async (_, { rejectWithValue }) => {
        try {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            let recipes = [];
            querySnapshot.forEach((doc) => {
                recipes.push({ id: doc.id, ...doc.data() });
            });
            return recipes;
        } catch (e) {
            console.error("Error getting documents: ", e);
            return rejectWithValue(e.message);
        }
    }
);

// Delete recipe async thunk
export const deleteRecipe = createAsyncThunk(
    "recipes/deleteRecipe",
    async (recipeId, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, "recipes", recipeId));
            return recipeId;
        } catch (e) {
            console.error("Error deleting document: ", e);
            return rejectWithValue(e.message);
        }
    }
);

// Update recipe async thunk
export const updateRecipe = createAsyncThunk(
    "recipes/updateRecipe",
    async ({ recipeId, recipeData }, { rejectWithValue }) => {
        try {
            const docRef = doc(db, "recipes", recipeId);
            await updateDoc(docRef, recipeData);
            return { id: recipeId, ...recipeData };
        } catch (e) {
            console.error("Error updating document: ", e);
            return rejectWithValue(e.message);
        }
    }
);

export const recipeSlice = createSlice({
    name: "recipes",
    initialState: {
        recipes: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = [action.payload, ...state.recipes];
                state.error = null;
            })
            .addCase(createRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(getRecipes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = action.payload;
                state.error = null;
            })
            .addCase(getRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(deleteRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = state.recipes.filter((recipe) => recipe.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(updateRecipe.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Updated recipe:", action.payload);
                state.recipes = state.recipes.map((recipe) =>
                    recipe.id === action.payload.id ? action.payload : recipe
                );
                state.error = null;
            })
            .addCase(updateRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default recipeSlice.reducer;
