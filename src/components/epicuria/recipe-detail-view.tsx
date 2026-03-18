"use client";

import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { DetailActions } from "@/components/epicuria/detail-actions";
import {
  fetchRecipeById,
  parseRecipeIdFromSlug,
  type FrontRecipe,
} from "@/lib/epicuria-api";

type RecipeDetailViewProps = {
  slug: string;
};

export function RecipeDetailView({ slug }: RecipeDetailViewProps) {
  const [recipe, setRecipe] = useState<FrontRecipe | null>(null);
  const [error, setError] = useState("");
  const recipeId = parseRecipeIdFromSlug(slug);

  useEffect(() => {
    if (!recipeId) {
      return;
    }

    void (async () => {
      try {
        setError("");
        const data = await fetchRecipeById(recipeId);
        setRecipe(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger cette recette."
        );
      }
    })();
  }, [recipeId]);

  if (!recipeId) {
    return <p className="form-message form-message--error">Recette introuvable.</p>;
  }

  if (error) {
    return <p className="form-message form-message--error">{error}</p>;
  }

  if (!recipe) {
    return <p className="catalog-summary">Chargement de la recette...</p>;
  }

  return (
    <div className="recipe-layout">
      <div>
        <img alt={recipe.alt} className="recipe-hero-img" src={recipe.image} />
      </div>

      <div className="recipe-content">
        <div className="tag">
          {recipe.type} - {recipe.season}
        </div>
        <h1>{recipe.title}</h1>

        <div className="recipe-author">
          <img alt={recipe.author.name} src={recipe.author.image} />
          <div className="author-info">
            <p>Recette proposee par</p>
            <strong>{recipe.author.name}</strong>
          </div>
          <DetailActions recipeId={recipe.id} />
        </div>

        <div className="recipe-stats">
          <div className="stat-box">
            <span>Preparation</span>
            <strong>{recipe.prepLabel}</strong>
          </div>
          <div className="stat-box">
            <span>Cuisson</span>
            <strong>{recipe.cookLabel}</strong>
          </div>
          <div className="stat-box">
            <span>Portions</span>
            <strong>{recipe.servingsLabel}</strong>
          </div>
        </div>

        <div className="ingredients-list">
          <h3>Ingredients</h3>
          {recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient) => (
              <label className="ingredient-item" key={`${ingredient.name}-${ingredient.amount}`}>
                <input type="checkbox" />
                <span className="ingredient-label">{ingredient.name}</span>
                <b>{ingredient.amount}</b>
              </label>
            ))
          ) : (
            <p>Aucun ingredient detaille pour cette recette.</p>
          )}
        </div>

        <div className="instructions-list">
          <h3>Preparation</h3>
          {recipe.steps.length > 0 ? (
            recipe.steps.map((step, index) => (
              <div className="instruction-step" key={`${recipe.id}-${index + 1}`}>
                <div className="step-num">{index + 1}</div>
                <div className="step-content">
                  <p>{step}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Les etapes de preparation seront ajoutees prochainement.</p>
          )}

          <button className="btn btn-primary" style={{ marginTop: 24, width: "100%" }}>
            <PlayCircle size={18} />
            Lancer le mode cuisine
          </button>
        </div>
      </div>
    </div>
  );
}
