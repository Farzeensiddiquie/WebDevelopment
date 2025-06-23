import React, { useState, useEffect } from "react";
import "./Modal.css";

export default function Modal({ modalIsOpen, setIsOpen, recipe, onUpdate }) {
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    tags: "",
    type: "",
    servings: "",
    prepTimeMinutes: "",
    cookTimeMinutes: "",
    caloriesPerServing: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (recipe) {
      setForm({
        title: recipe.title || "",
        ingredients: (recipe.ingredients || []).join("\n"),
        instructions: (recipe.instructions || []).join("\n"),
        tags: (recipe.tags || []).join(", "),
        type: recipe.type || "",
        servings: recipe.servings || "",
        prepTimeMinutes: recipe.prepTimeMinutes || "",
        cookTimeMinutes: recipe.cookTimeMinutes || "",
        caloriesPerServing: recipe.caloriesPerServing || "",
        imageUrl: recipe.imageUrl || "",
      });
      setPreviewImage(recipe.imageUrl || "");
    }
  }, [recipe]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "todo-app");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlj5qr22y/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    const {
      title,
      ingredients,
      instructions,
      tags,
      type,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
      caloriesPerServing,
    } = form;

    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      alert("Please fill all required fields");
      return;
    }

    let imageUrl = previewImage;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
    }

    const updatedRecipe = {
      ...recipe,
      title,
      ingredients: ingredients.split("\n").map((i) => i.trim()).filter(Boolean),
      instructions: instructions.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      type,
      servings: Number(servings),
      prepTimeMinutes: Number(prepTimeMinutes),
      cookTimeMinutes: Number(cookTimeMinutes),
      caloriesPerServing: Number(caloriesPerServing),
      imageUrl,
    };

    onUpdate(updatedRecipe);
    setIsOpen(false);
  };

  if (!modalIsOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Update Recipe</h2>

        <input
          className="modal-input"
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
        />

        <textarea
          className="modal-textarea"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          placeholder="Ingredients (one per line)"
        />

        <textarea
          className="modal-textarea"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          placeholder="Instructions (one step per line)"
        />

        <input
          className="modal-input"
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Tags (comma-separated)"
        />

        <select
          className="modal-select"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </select>

        <div className="modal-row">
          <input
            className="modal-input"
            type="number"
            placeholder="Servings"
            value={form.servings}
            onChange={(e) => setForm({ ...form, servings: e.target.value })}
          />
          <input
            className="modal-input"
            type="number"
            placeholder="Calories/Serving"
            value={form.caloriesPerServing}
            onChange={(e) =>
              setForm({ ...form, caloriesPerServing: e.target.value })
            }
          />
        </div>

        <div className="modal-row">
          <input
            className="modal-input"
            type="number"
            placeholder="Prep Time (min)"
            value={form.prepTimeMinutes}
            onChange={(e) =>
              setForm({ ...form, prepTimeMinutes: e.target.value })
            }
          />
          <input
            className="modal-input"
            type="number"
            placeholder="Cook Time (min)"
            value={form.cookTimeMinutes}
            onChange={(e) =>
              setForm({ ...form, cookTimeMinutes: e.target.value })
            }
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setPreviewImage(URL.createObjectURL(file));
            }
          }}
        />

        {previewImage && (
          <img className="modal-preview" src={previewImage} alt="Preview" />
        )}

        <div className="modal-buttons">
          <button className="modal-btn" onClick={handleSubmit}>
            Update
          </button>
          <button className="modal-btn cancel" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
