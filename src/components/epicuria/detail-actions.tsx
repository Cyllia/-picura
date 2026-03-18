"use client";

import { useRouter } from "next/navigation";
import { Heart, Share2 } from "lucide-react";
import { useAppSession } from "@/components/epicuria/app-provider";

export function DetailActions({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const { favorites, toggleFavorite } = useAppSession();
  const isFavorite = Boolean(favorites[recipeId]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "Epicuria",
        text: "Decouvre cette recette sur Epicuria",
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="detail-actions">
      <button
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        className="btn btn-secondary btn-round"
        type="button"
        onClick={async () => {
          const result = await toggleFavorite(recipeId);

          if (result.requiresAuth) {
            router.push("/connexion");
          }
        }}
      >
        <Heart fill={isFavorite ? "currentColor" : "none"} size={18} />
      </button>
      <button
        aria-label="Partager la recette"
        className="btn btn-secondary btn-round"
        type="button"
        onClick={() => {
          void handleShare();
        }}
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}
