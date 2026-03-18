"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Search } from "lucide-react";
import { searchRecipes, type FrontRecipe } from "@/lib/epicuria-api";

type HeroSearchProps = {
  initialValue?: string;
};

export function HeroSearch({ initialValue = "" }: HeroSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<FrontRecipe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const trimmedQuery = deferredQuery.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          setIsLoading(true);
          const nextResults = await searchRecipes({ q: trimmedQuery });
          setResults(nextResults.slice(0, 5));
          setIsOpen(true);
        } finally {
          setIsLoading(false);
        }
      })();
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [deferredQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const trimmedQuery = query.trim();
  const showSuggestions = isOpen && trimmedQuery.length >= 2;

  const goToSearchResults = () => {
    router.push(trimmedQuery ? `/recettes?q=${encodeURIComponent(trimmedQuery)}` : "/recettes");
    setIsOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToSearchResults();
  };

  return (
    <div className="search-shell" ref={containerRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <Search color="var(--c-text-muted)" size={18} />
        <input
          type="text"
          placeholder="Rechercher une recette ou un ingredient..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (trimmedQuery.length >= 2) {
              setIsOpen(true);
            }
          }}
        />
        <button aria-label="Rechercher" className="search-submit" type="submit">
          <ArrowRight size={18} />
        </button>
      </form>

      {showSuggestions ? (
        <div className="search-suggestions">
          <div className="search-suggestions-header">
            <span>{isLoading ? "Recherche..." : "Suggestions"}</span>
            <button className="search-link-button" type="button" onClick={goToSearchResults}>
              Voir tout
            </button>
          </div>

          {results.length > 0 ? (
            <div className="search-suggestions-list">
              {results.map((recipe) => (
                <button
                  key={recipe.id}
                  className="search-suggestion-item"
                  type="button"
                  onClick={() => {
                    router.push(recipe.path);
                    setIsOpen(false);
                  }}
                >
                  <img alt={recipe.alt} src={recipe.image} />
                  <span className="search-suggestion-content">
                    <strong>{recipe.title}</strong>
                    <span>{recipe.type}</span>
                  </span>
                  <span className="search-suggestion-meta">
                    <Clock3 size={14} />
                    {recipe.duration}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="search-empty-state">
              <strong>Aucune recette trouvee</strong>
              <p>Lance la recherche pour voir tous les resultats disponibles.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
