"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSession } from "@/components/epicuria/app-provider";

export function AuthCard() {
  const router = useRouter();
  const { authLoading, login, register } = useAppSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formState, setFormState] = useState({
    firstName: "",
    username: "",
    email: "",
    password: "",
  });

  const isLogin = mode === "login";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        await login({
          email: formState.email,
          password: formState.password,
        });
      } else {
        await register({
          first_name: formState.firstName,
          username:
            formState.username.trim() ||
            formState.email.split("@")[0] ||
            `chef${Date.now()}`,
          email: formState.email,
          password: formState.password,
        });
      }

      setSuccess(isLogin ? "Connexion reussie." : "Compte cree avec succes.");
      router.push("/profil");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible de finaliser la demande."
      );
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-visual">
        <img
          alt="Cuisine chaleureuse"
          src="https://images.pexels.com/photos/2059151/pexels-photo-2059151.jpeg?auto=compress&cs=tinysrgb&w=800"
        />
      </div>

      <div className="auth-form-area">
        <h3>{isLogin ? "Se connecter" : "Creer un compte"}</h3>
        <p className="subtitle">
          {isLogin
            ? "Heureux de te revoir parmi nous."
            : "Commence ton aventure culinaire."}
        </p>

        <form onSubmit={handleSubmit}>
          {isLogin ? null : (
            <>
              <div className="form-group">
                <label htmlFor="first-name">Prenom</label>
                <input
                  className="form-input"
                  id="first-name"
                  placeholder="Camille"
                  type="text"
                  value={formState.firstName}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Nom d&apos;utilisateur</label>
                <input
                  className="form-input"
                  id="username"
                  placeholder="camille_d"
                  type="text"
                  value={formState.username}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              className="form-input"
              id="email"
              placeholder={isLogin ? "bonjour@exemple.com" : "camille@exemple.com"}
              required
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label className={isLogin ? "form-label-row" : undefined} htmlFor="password">
              <span>Mot de passe</span>
              {isLogin ? <span className="form-muted-link">Securise</span> : null}
            </label>
            <input
              className="form-input"
              id="password"
              placeholder={isLogin ? "........" : "Minimum 8 caracteres"}
              required
              type="password"
              value={formState.password}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </div>

          {error ? <p className="form-message form-message--error">{error}</p> : null}
          {success ? <p className="form-message form-message--success">{success}</p> : null}

          <button className="btn btn-primary auth-btn" disabled={authLoading} type="submit">
            {authLoading
              ? "Chargement..."
              : isLogin
                ? "Acceder a mon espace"
                : "Rejoindre Epicuria"}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Nouveau cuisinier ? " : "Deja membre ? "}
          <button
            type="button"
            onClick={() => {
              setMode(isLogin ? "signup" : "login");
              setError("");
              setSuccess("");
            }}
          >
            {isLogin ? "Creer un compte" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
