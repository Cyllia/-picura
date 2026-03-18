"use client";

import Link from "next/link";
import { ArrowUpRight, ChefHat } from "lucide-react";
import { useAppSession } from "@/components/epicuria/app-provider";

export function SiteFooter() {
  const { session } = useAppSession();

  return (
    <footer className="site-footer">
      <div className="site-footer-card">
        <div className="site-footer-brand">
          <Link className="logo" href="/">
            <ChefHat size={22} />
            Epicuria
          </Link>
          <p>
            Des recettes du monde, des suggestions utiles et un espace simple
            pour cuisiner, sauvegarder et partager.
          </p>
        </div>

        <div className="site-footer-links">
          <div>
            <h3>Navigation</h3>
            <Link href="/">Accueil</Link>
            <Link href="/recettes">Les recettes</Link>
            <Link href="/inspiration">Les suggestions</Link>
          </div>
          <div>
            <h3>Mon espace</h3>
            <Link href={session ? "/profil" : "/connexion"}>
              {session ? "Mon profil" : "Connexion"}
            </Link>
            <Link href="/profil">Recettes sauvegardees</Link>
            <Link href="/profil">Creer une recette</Link>
          </div>
          <div>
            <h3>Decouvrir</h3>
            <Link href="/recettes?q=vegetarien">Recherche par regime</Link>
            <Link href="/inspiration">Suggestion aleatoire</Link>
            <Link href="/recettes">
              Explorer le catalogue
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
