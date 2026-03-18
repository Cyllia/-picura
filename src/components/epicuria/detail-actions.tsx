"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Share2 } from "lucide-react";
import { useAppSession } from "@/components/epicuria/app-provider";

type DetailActionsProps = {
  recipeId: number;
  recipeTitle: string;
};

export function DetailActions({ recipeId, recipeTitle }: DetailActionsProps) {
  const router = useRouter();
  const { favorites, toggleFavorite } = useAppSession();
  const isFavorite = Boolean(favorites[recipeId]);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");
  const [shareError, setShareError] = useState("");

  const handleShare = async () => {
    const url = window.location.href;
    setShareError("");

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Epicuria | ${recipeTitle}`,
          text: `Decouvre la recette "${recipeTitle}" sur Epicuria`,
          url,
        });
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(`${recipeTitle} - ${url}`);
        setShareStatus("copied");
      }
    } catch {
      setShareError("Impossible de partager la recette pour le moment.");
      return;
    }

    window.setTimeout(() => {
      setShareStatus("idle");
    }, 2200);
  };

  return (
    <div className="detail-actions-wrap">
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
          className={`btn btn-secondary detail-share-button ${shareStatus !== "idle" ? "is-success" : ""}`}
          type="button"
          onClick={() => {
            void handleShare();
          }}
        >
          {shareStatus === "idle" ? <Share2 size={18} /> : <Check size={18} />}
          {shareStatus === "shared"
            ? "Partagee"
            : shareStatus === "copied"
              ? "Lien copie"
              : "Partager"}
        </button>
      </div>

      {shareError ? <p className="detail-share-feedback">{shareError}</p> : null}
      {shareStatus === "copied" ? (
        <p className="detail-share-feedback">Le lien complet a ete copie dans le presse-papiers.</p>
      ) : null}
      {shareStatus === "shared" ? (
        <p className="detail-share-feedback">La fenetre de partage a ete ouverte.</p>
      ) : null}
    </div>
  );
}
