"use client";

import { useRouter } from "next/navigation";
import { Clock3, Heart, Users } from "lucide-react";
import { useAppSession } from "@/components/epicuria/app-provider";
import type { FrontRecipe } from "@/lib/epicuria-api";

type RecipeCardProps = {
  recipe: FrontRecipe;
  compact?: boolean;
};

function getDescriptionExcerpt(description: string) {
  const trimmedDescription = description.trim();

  if (trimmedDescription.length <= 132) {
    return trimmedDescription;
  }

  return `${trimmedDescription.slice(0, 129).trim()}...`;
}

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const router = useRouter();
  const { favorites, toggleFavorite } = useAppSession();
  const isFavorite = Boolean(favorites[recipe.id]);
  const descriptionExcerpt = getDescriptionExcerpt(recipe.description);

  return (
    <article
      className={`recipe-card ${compact ? "recipe-card--compact" : ""}`}
      onClick={() => router.push(recipe.path)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(recipe.path);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="recipe-card-media">
        <img src={recipe.image} alt={recipe.alt} />
        <button
          className={`card-like ${isFavorite ? "is-favorite" : ""}`}
          type="button"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={async (event) => {
            event.stopPropagation();
            const result = await toggleFavorite(recipe.id);

            if (result.requiresAuth) {
              router.push("/connexion");
            }
          }}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="recipe-card-content">
        <div className="tag">{recipe.tag}</div>
        <h3>{recipe.title}</h3>
        {descriptionExcerpt ? (
          <p className="recipe-card-description">{descriptionExcerpt}</p>
        ) : null}
        {compact ? null : (
          <div className="recipe-meta">
            <span className="meta-item">
              <Clock3 />
              {recipe.duration}
            </span>
            <span className="meta-item">
              <Users />
              {recipe.servings}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
