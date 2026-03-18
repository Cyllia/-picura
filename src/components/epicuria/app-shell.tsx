"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChefHat, Heart, LogOut } from "lucide-react";
import { AppProvider, useAppSession } from "@/components/epicuria/app-provider";
import { SiteFooter } from "@/components/epicuria/site-footer";

const navItems = [
  { href: "/", label: "Accueil", match: "/" },
  { href: "/recettes", label: "Recettes", match: "/recettes" },
  { href: "/inspiration", label: "Suggestion", match: "/inspiration" },
];

function isActive(pathname: string, href: string, match: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (match === "/recettes") {
    return pathname.startsWith("/recettes");
  }

  if (match === "/inspiration") {
    return pathname.startsWith("/inspiration");
  }

  return pathname === match;
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout, favorites, favoriteAddedPulse } = useAppSession();

  const favoritesCount = useMemo(() => Object.keys(favorites).length, [favorites]);
  const profileName =
    session?.user.first_name?.trim() || session?.user.username || "Profil";
  const profileImage = session?.user.profile_image || "/default-avatar.svg";

  return (
    <>
      <div aria-hidden="true" className="ambient-glow">
        <div className="glow-blob glow-1" />
        <div className="glow-blob glow-2" />
        <div className="glow-blob glow-3" />
      </div>

      <nav className="site-nav">
        <div className="nav-inner">
          <Link className="logo" href="/">
            <ChefHat size={22} />
            Epicuria
          </Link>

          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                className={`nav-link ${isActive(pathname, item.href, item.match) ? "is-active" : ""}`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {session ? (
              <>
                <Link
                  aria-label="Favoris"
                  className="btn btn-secondary btn-round nav-favorite-button"
                  href="/profil"
                >
                  <Heart color="var(--c-accent)" size={18} />
                  {favoritesCount > 0 ? (
                    <span className="nav-favorite-count">{favoritesCount}</span>
                  ) : null}
                  {favoriteAddedPulse > 0 ? (
                    <span className="nav-favorite-pulse" key={favoriteAddedPulse}>
                      +1
                    </span>
                  ) : null}
                </Link>
                <Link aria-label={`Acceder au profil de ${profileName}`} href="/profil">
                  <img alt={profileName} className="avatar" src={profileImage} />
                </Link>
                <button
                  className="btn btn-primary"
                  style={{ padding: "12px 24px" }}
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut size={18} />
                  Deconnexion
                </button>
              </>
            ) : (
              <Link
                className="btn btn-primary"
                href="/connexion"
                style={{ padding: "12px 24px" }}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="site-main container">{children}</main>
      <div className="container">
        <SiteFooter />
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ShellContent>{children}</ShellContent>
    </AppProvider>
  );
}
