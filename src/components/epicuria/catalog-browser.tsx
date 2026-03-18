"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { RecipeCard } from "@/components/epicuria/recipe-card";
import { HeroSearch } from "@/components/epicuria/hero-search";
import {
  fetchDiets,
  searchRecipes,
  type FrontRecipe,
  type SelectOption,
} from "@/lib/epicuria-api";

type CatalogBrowserProps = {
  initialQuery: string;
};

const typeFilters = [
  { label: "Toutes", categoryId: undefined, clientRapid: false },
  { label: "Entrees", categoryId: 1, clientRapid: false },
  { label: "Plats", categoryId: 2, clientRapid: false },
  { label: "Desserts", categoryId: 3, clientRapid: false },
  { label: "Rapide (moins de 30 min)", categoryId: undefined, clientRapid: true },
];

export function CatalogBrowser({ initialQuery }: CatalogBrowserProps) {
  const [recipes, setRecipes] = useState<FrontRecipe[]>([]);
  const [diets, setDiets] = useState<SelectOption[]>([]);
  const [activeFilter, setActiveFilter] = useState(typeFilters[0].label);
  const [selectedDietId, setSelectedDietId] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");

  const currentFilter =
    typeFilters.find((filter) => filter.label === activeFilter) ?? typeFilters[0];

  useEffect(() => {
    void (async () => {
      try {
        setError("");
        const [dietOptions, recipeResults] = await Promise.all([
          fetchDiets(),
          searchRecipes({
            q: initialQuery,
            categoryId: currentFilter.categoryId,
            dietId: selectedDietId,
          }),
        ]);

        setDiets(dietOptions);
        setRecipes(recipeResults);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger les recettes."
        );
      }
    })();
  }, [currentFilter.categoryId, initialQuery, selectedDietId]);

  const visibleRecipes = useMemo(() => {
    if (!currentFilter.clientRapid) {
      return recipes;
    }

    return recipes.filter((recipe) => recipe.totalMinutes > 0 && recipe.totalMinutes < 30);
  }, [currentFilter.clientRapid, recipes]);

  return (
    <>
      <div style={{ marginBottom: 32, marginTop: 40 }}>
        <HeroSearch initialValue={initialQuery} />
      </div>

      <div className="catalog-controls">
        <div className="filters">
          {typeFilters.map((filter) => (
            <button
              key={filter.label}
              className={`filter-pill ${activeFilter === filter.label ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveFilter(filter.label)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-select filter-pill">
            <select
              className="catalog-select-input"
              value={selectedDietId ?? ""}
              onChange={(event) =>
                setSelectedDietId(event.target.value ? Number(event.target.value) : undefined)
              }
            >
              <option value="">Tous les regimes</option>
              {diets.map((diet) => (
                <option key={diet.id} value={diet.id}>
                  {diet.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {error ? <p className="form-message form-message--error">{error}</p> : null}

      <div className="catalog-summary">
        {initialQuery
          ? `Resultats pour "${initialQuery}" - ${visibleRecipes.length} recette(s)`
          : `${visibleRecipes.length} recette(s) a decouvrir`}
      </div>

      {visibleRecipes.length > 0 ? (
        <div className="recipe-grid">
          {visibleRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <strong>Aucune recette ne correspond a cette recherche</strong>
          <p>Essaie un autre mot-cle, un autre type de plat ou un autre regime.</p>
        </div>
      )}
    </>
  );
}
