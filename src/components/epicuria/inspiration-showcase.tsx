"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { fetchRecipes, type FrontRecipe } from "@/lib/epicuria-api";

function shuffleRecipes(recipes: FrontRecipe[]) {
  const copy = [...recipes];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function InspirationShowcase() {
  const [recipes, setRecipes] = useState<FrontRecipe[]>([]);
  const [selectionSeed, setSelectionSeed] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger la suggestion."
        );
      }
    })();
  }, []);

  const randomSelection = useMemo(() => {
    if (recipes.length === 0) {
      return [];
    }

    void selectionSeed;
    return shuffleRecipes(recipes).slice(0, 4);
  }, [recipes, selectionSeed]);

  const featuredRecipe = randomSelection[0];
  const extraRecipes = randomSelection.slice(1);

  if (error) {
    return <p className="form-message form-message--error">{error}</p>;
  }

  if (!featuredRecipe) {
    return <p className="catalog-summary">Chargement des suggestions...</p>;
  }

  return (
    <section className="page-view">
      <div className="page-intro inspiration-intro">
        <div className="tag">
          <Sparkles size={14} />
          Suggestion du moment
        </div>
        <h1>Laisse le hasard choisir le prochain plat</h1>
        <p>
          Decouvre une recette surprise, puis ouvre directement sa fiche pour la
          voir et la preparer pas a pas.
        </p>
      </div>

      <div className="inspiration-hero">
        <div className="inspiration-featured">
          <img alt={featuredRecipe.alt} src={featuredRecipe.image} />
          <div className="inspiration-featured-content">
            <div className="tag">{featuredRecipe.type}</div>
            <h2>{featuredRecipe.title}</h2>
            <p>{featuredRecipe.description || "Une idee choisie au hasard dans le catalogue Epicuria."}</p>
            <div className="inspiration-actions">
              <button
                className="btn btn-secondary inspiration-shuffle"
                type="button"
                onClick={() => setSelectionSeed((current) => current + 1)}
              >
                Relancer la suggestion
              </button>
              <Link className="btn btn-primary" href={featuredRecipe.path}>
                Voir la recette et la preparer
              </Link>
            </div>
          </div>
        </div>

        <div className="inspiration-side-grid">
          {extraRecipes.map((recipe) => (
            <Link className="inspiration-side-card" href={recipe.path} key={recipe.id}>
              <img alt={recipe.alt} src={recipe.image} />
              <div>
                <div className="tag">{recipe.tag}</div>
                <h3>{recipe.title}</h3>
                <p>{recipe.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
