"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HeroSearch } from "@/components/epicuria/hero-search";
import { RecipeCard } from "@/components/epicuria/recipe-card";
import { fetchRecipes, type FrontRecipe } from "@/lib/epicuria-api";

const homeSpotlight = {
  image:
    "https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=1200",
  alt: "Cuisine en famille",
  floating: {
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=200",
    alt: "Pancakes moelleux",
    title: "Pancakes moelleux",
    subtitle: "Pret en 15 min",
  },
};

export function HomeFeed() {
  const [recipes, setRecipes] = useState<FrontRecipe[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchRecipes();
        setRecipes(data.slice(0, 3));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger les recettes."
        );
      }
    })();
  }, []);

  return (
    <section className="page-view">
      <div className="hero">
        <div className="hero-text">
          <div className="tag" style={{ marginBottom: 24 }}>
            <Sparkles size={14} />
            Pour tout regime
          </div>
          <h1>Que cuisinons-nous aujourd&apos;hui ?</h1>
          <p>
            Des recettes pensees pour rassembler, des ingredients simples
            transformes en moments inoubliables. L&apos;art de la table, en toute
            douceur.
          </p>
          <HeroSearch />
        </div>

        <div className="hero-visual">
          <img alt={homeSpotlight.alt} className="hero-img-main" src={homeSpotlight.image} />
          <div className="floating-card">
            <img alt={homeSpotlight.floating.alt} src={homeSpotlight.floating.image} />
            <div className="floating-card-info">
              <h4>{homeSpotlight.floating.title}</h4>
              <p>{homeSpotlight.floating.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Nos coups de coeur</h2>
        <Link className="btn btn-secondary" href="/recettes">
          Voir tout
        </Link>
      </div>

      {error ? <p className="form-message form-message--error">{error}</p> : null}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
