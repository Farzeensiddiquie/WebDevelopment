import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createRecipe } from "../../features/counter/AddRecipesSlice";
import { useNavigate } from "react-router-dom";
import "./AddRecipe.css";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState("");
  const [type, setType] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");
  const [cookTimeMinutes, setCookTimeMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [caloriesPerServing, setCaloriesPerServing] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goBack = () => navigate("/Recipes");

  const onClickHandler = async () => {
    // Validate inputs
    if (
      !title.trim() ||
      !ingredients.trim() ||
      !instructions.trim() ||
      !image ||
      !type.trim() ||
      !prepTimeMinutes.trim() ||
      !cookTimeMinutes.trim() ||
      !servings.trim() ||
      !caloriesPerServing.trim()
    ) {
      alert("Please fill all fields and upload an image");
      return;
    }

    // Create new recipe object
    const newRecipe = {
      title: title.trim(),
      image: image,
      createdAt: new Date().toISOString(),
      ingredients: ingredients.split("\n").filter(Boolean),
      instructions: instructions.split("\n").filter(Boolean),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      mealType: [type.trim()],
      prepTimeMinutes: parseInt(prepTimeMinutes),
      cookTimeMinutes: parseInt(cookTimeMinutes),
      servings: parseInt(servings),
      caloriesPerServing: parseInt(caloriesPerServing),
      cuisine: "Custom",
      rating: 0,
      reviewCount: 0,
    };

    // Dispatch createRecipe action
    setLoading(true);
    try {
      await dispatch(createRecipe(newRecipe));
      goBack();
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeImageHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "todo-app"); // Your Cloudinary upload preset

      // Upload image to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dlj5qr22y/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImage(data.secure_url);  // Set the Cloudinary URL
      console.log("Image uploaded successfully:", data.secure_url); // Debugging: Check the uploaded image URL
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    console.log("Image load failed, using fallback image.");
    setImage("https://res.cloudinary.com/dlj5qr22y/image/upload/v1652080123/default_image.jpg"); // Cloudinary fallback image URL
  };

  console.log("Image state:", image); // Debugging: Check the image state before rendering

  return (
    <div className="create-recipe-container">
      <h1>Create Recipe</h1>
      <div className="create-recipe-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Ingredients (one per line)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <textarea
          placeholder="Instructions (one per line)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="row-inputs">
          <input
            type="number"
            placeholder="Prep Time (min)"
            value={prepTimeMinutes}
            onChange={(e) => setPrepTimeMinutes(e.target.value)}
          />
          <input
            type="number"
            placeholder="Cook Time (min)"
            value={cookTimeMinutes}
            onChange={(e) => setCookTimeMinutes(e.target.value)}
          />
        </div>

        <div className="row-inputs">
          <input
            type="number"
            placeholder="Servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
          <input
            type="number"
            placeholder="Calories/Serving"
            value={caloriesPerServing}
            onChange={(e) => setCaloriesPerServing(e.target.value)}
          />
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </select>

        <input type="file" onChange={onChangeImageHandler} />
        {image && (
          <img
            src={image}
            alt="Uploaded"
            className="preview-img"
            onError={handleImageError} // In case of error, show fallback image
          />
        )}
        {loading && <p>Uploading...</p>}
        <button onClick={onClickHandler} disabled={loading}>
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </div>
    </div>
  );
}