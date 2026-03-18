"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { CookMode } from "@/components/epicuria/cook-mode";
import { DetailActions } from "@/components/epicuria/detail-actions";
import { RecipeCard } from "@/components/epicuria/recipe-card";
import {
  fetchRecipes,
  fetchRecipeById,
  parseRecipeIdFromSlug,
  type FrontRecipe,
} from "@/lib/epicuria-api";
import { getRecommendedRecipes } from "@/lib/recipe-recommendations";

type RecipeDetailViewProps = {
  slug: string;
};

export function RecipeDetailView({ slug }: RecipeDetailViewProps) {
  const [recipe, setRecipe] = useState<FrontRecipe | null>(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState<FrontRecipe[]>([]);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [error, setError] = useState("");
  const recipeId = parseRecipeIdFromSlug(slug);

  const handleOpenCookMode = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      setIsCookModeOpen(true);
    }, 180);
  };

  useEffect(() => {
    if (!recipeId) {
      return;
    }

    void (async () => {
      try {
        setError("");
        const [recipeData, allRecipes] = await Promise.all([
          fetchRecipeById(recipeId),
          fetchRecipes(),
        ]);

        setRecipe(recipeData);
        setRecommendedRecipes(getRecommendedRecipes(recipeData, allRecipes));
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
    <div className="recipe-detail-stack">
      {isCookModeOpen ? (
        <CookMode
          isOpen={isCookModeOpen}
          recipe={recipe}
          onClose={() => setIsCookModeOpen(false)}
        />
      ) : null}

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
            <DetailActions recipeId={recipe.id} recipeTitle={recipe.title} />
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

            <button
              className="btn btn-primary"
              style={{ marginTop: 24, width: "100%" }}
              type="button"
              onClick={handleOpenCookMode}
            >
              <PlayCircle size={18} />
              Lancer le mode cuisine
            </button>
          </div>
        </div>
      </div>

      <section className="related-recipes-section">
        <div className="section-header">
          <div>
            <h2>Tu pourrais aussi aimer</h2>
            <p className="related-recipes-copy">
              Des suggestions choisies selon le type de plat, les ingredients et les regimes en
              commun avec cette recette.
            </p>
          </div>
          <Link className="btn btn-secondary" href="/recettes">
            Voir plus de recettes
          </Link>
        </div>

        {recommendedRecipes.length > 0 ? (
          <div className="recipe-grid">
            {recommendedRecipes.map((recommendedRecipe) => (
              <RecipeCard key={recommendedRecipe.id} recipe={recommendedRecipe} />
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <strong>Pas encore assez de recettes similaires</strong>
            <p>
              Ajoute davantage de recettes dans le catalogue pour enrichir les recommandations
              automatiques.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
