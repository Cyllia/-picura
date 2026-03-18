"use client";

import { useEffect, useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSession } from "@/components/epicuria/app-provider";
import { RecipeCard } from "@/components/epicuria/recipe-card";
import {
  createRecipeRequest,
  deleteRecipeRequest,
  fetchCategories,
  fetchCountries,
  fetchDiets,
  fetchFavoritesForUser,
  fetchRecipes,
  normalizeRecipe,
  updateProfileRequest,
  updateRecipeRequest,
  type FrontRecipe,
  type ProfileUpdatePayload,
  type RecipeFormPayload,
  type SelectOption,
} from "@/lib/epicuria-api";

type TabId = "favorites" | "my-recipes" | "editor" | "settings";

type IngredientInput = {
  name: string;
  quantity: string;
  unit: string;
};

type RecipeFormState = {
  title: string;
  description: string;
  difficulty: string;
  prep_time: string;
  cook_time: string;
  servings: string;
  instructions: string;
  image_url: string;
  category_id: string;
  country_id: string;
  diet_ids: number[];
  ingredients: IngredientInput[];
};

type ProfileFormState = {
  profile_image: string;
  bio: string;
  password: string;
  passwordConfirm: string;
};

function createEmptyRecipeForm(): RecipeFormState {
  return {
    title: "",
    description: "",
    difficulty: "2",
    prep_time: "20",
    cook_time: "30",
    servings: "4",
    instructions: "",
    image_url: "",
    category_id: "",
    country_id: "",
    diet_ids: [],
    ingredients: [{ name: "", quantity: "1", unit: "portion" }],
  };
}

function getIngredientParts(amount: string) {
  const [quantity = "1", ...unitParts] = amount.split(" ");
  return {
    quantity,
    unit: unitParts.join(" ") || "portion",
  };
}

export function ProfileShowcase() {
  const router = useRouter();
  const {
    session,
    isReady,
    favorites: favoriteMap,
    refreshFavorites,
    updateSessionUser,
  } = useAppSession();
  const [activeTab, setActiveTab] = useState<TabId>("favorites");
  const [favoriteRecipes, setFavoriteRecipes] = useState<FrontRecipe[]>([]);
  const [myRecipes, setMyRecipes] = useState<FrontRecipe[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [diets, setDiets] = useState<SelectOption[]>([]);
  const [formState, setFormState] = useState<RecipeFormState>(createEmptyRecipeForm);
  const [editingRecipeId, setEditingRecipeId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [visibleFavoritesCount, setVisibleFavoritesCount] = useState(6);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    profile_image: "",
    bio: "",
    password: "",
    passwordConfirm: "",
  });

  const userDisplayName =
    session?.user.first_name?.trim() || session?.user.username || "Membre";

  const profileStats = useMemo(
    () => [
      {
        value: String(
          favoriteRecipes.filter((recipe) => favoriteMap[recipe.id]).length
        ),
        label: "Favoris",
      },
      { value: String(myRecipes.length), label: "Mes recettes" },
      { value: String(diets.length), label: "Regimes" },
    ],
    [diets.length, favoriteMap, favoriteRecipes, myRecipes.length]
  );

  useEffect(() => {
    void (async () => {
      if (!session?.user.id) {
        setFavoriteRecipes([]);
        setMyRecipes([]);
        setCategories([]);
        setCountries([]);
        setDiets([]);
        return;
      }

      try {
        setErrorMessage("");
        const [favoriteRecords, ownRecipes, categoryOptions, countryOptions, dietOptions] =
          await Promise.all([
            fetchFavoritesForUser(session.user.id),
            fetchRecipes({ userId: session.user.id }),
            fetchCategories(),
            fetchCountries(),
            fetchDiets(),
          ]);

        setFavoriteRecipes(
          favoriteRecords
            .map((record) => record.recipe)
            .filter((recipe): recipe is FrontRecipe => Boolean(recipe))
        );
        setMyRecipes(ownRecipes);
        setCategories(categoryOptions);
        setCountries(countryOptions);
        setDiets(dietOptions);
      } catch (loadError) {
        setErrorMessage(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger le profil."
        );
      }
    })();
  }, [session?.user.id]);

  const visibleFavorites = useMemo(
    () => favoriteRecipes.filter((recipe) => Boolean(favoriteMap[recipe.id])),
    [favoriteMap, favoriteRecipes]
  );

  const openSettingsTab = () => {
    setProfileForm({
      profile_image: session?.user.profile_image || "",
      bio: session?.user.bio || "",
      password: "",
      passwordConfirm: "",
    });
    setActiveTab("settings");
  };

  const resetForm = () => {
    setEditingRecipeId(null);
    setFormState(createEmptyRecipeForm());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user.id) {
      router.push("/connexion");
      return;
    }

    setErrorMessage("");
    setStatusMessage("");

    try {
      const payload: RecipeFormPayload = {
        user_id: session.user.id,
        title: formState.title.trim(),
        description: formState.description.trim(),
        difficulty: Number(formState.difficulty) || 2,
        prep_time: Number(formState.prep_time) || 0,
        cook_time: Number(formState.cook_time) || 0,
        servings: Number(formState.servings) || 1,
        instructions: formState.instructions.trim(),
        image_url: formState.image_url.trim(),
        category_id: Number(formState.category_id),
        country_id: Number(formState.country_id),
        diet_ids: formState.diet_ids,
        ingredients: formState.ingredients
          .filter((ingredient) => ingredient.name.trim())
          .map((ingredient) => ({
            name: ingredient.name.trim(),
            quantity: Number(ingredient.quantity) || 1,
            unit: ingredient.unit.trim() || "portion",
          })),
      };

      if (editingRecipeId) {
        const updatedRecipe = await updateRecipeRequest(editingRecipeId, payload);
        const normalizedRecipe = normalizeRecipe(updatedRecipe);
        setMyRecipes((current) =>
          current.map((recipe) =>
            recipe.id === editingRecipeId ? normalizedRecipe : recipe
          )
        );
        setStatusMessage("Recette mise a jour.");
      } else {
        const createdRecipe = await createRecipeRequest(payload);
        const normalizedRecipe = normalizeRecipe(createdRecipe);
        setMyRecipes((current) => [normalizedRecipe, ...current]);
        setStatusMessage("Recette creee avec succes.");
      }

      resetForm();
      setActiveTab("my-recipes");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : "Impossible d'enregistrer la recette."
      );
    }
  };

  const handleEditRecipe = (recipe: FrontRecipe) => {
    setEditingRecipeId(recipe.id);
    setErrorMessage("");
    setStatusMessage("");
    setFormState({
      title: recipe.title,
      description: recipe.description,
      difficulty: String(recipe.difficulty || 2),
      prep_time: recipe.prepLabel.replace(" min", ""),
      cook_time: recipe.cookLabel.replace(" min", ""),
      servings: recipe.servingsLabel.replace(" pers", ""),
      instructions: recipe.steps.join("\n"),
      image_url: recipe.imageUrl || recipe.image,
      category_id: recipe.categoryId ? String(recipe.categoryId) : "",
      country_id: recipe.countryId ? String(recipe.countryId) : "",
      diet_ids: diets
        .filter((diet) => recipe.diets.includes(diet.name))
        .map((diet) => diet.id),
      ingredients:
        recipe.ingredients.length > 0
          ? recipe.ingredients.map((ingredient) => {
              const parts = getIngredientParts(ingredient.amount);
              return {
                name: ingredient.name,
                quantity: parts.quantity,
                unit: parts.unit,
              };
            })
          : [{ name: "", quantity: "1", unit: "portion" }],
    });
    setActiveTab("editor");
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!window.confirm("Supprimer cette recette ?")) {
      return;
    }

    try {
      setErrorMessage("");
      setStatusMessage("");
      await deleteRecipeRequest(recipeId);
      setMyRecipes((current) => current.filter((recipe) => recipe.id !== recipeId));

      if (editingRecipeId === recipeId) {
        resetForm();
      }

      setStatusMessage("Recette supprimee.");
      await refreshFavorites();
    } catch (deleteError) {
      setErrorMessage(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer la recette."
      );
    }
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user.id) {
      router.push("/connexion");
      return;
    }

    if (profileForm.password && profileForm.password !== profileForm.passwordConfirm) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setStatusMessage("");
      return;
    }

    const payload: ProfileUpdatePayload = {
      profile_image: profileForm.profile_image.trim(),
      bio: profileForm.bio.trim(),
      password: profileForm.password.trim() || undefined,
    };

    try {
      setErrorMessage("");
      setStatusMessage("");
      const updatedUser = await updateProfileRequest(session.user.id, payload);
      updateSessionUser(updatedUser);
      setProfileForm((current) => ({
        ...current,
        password: "",
        passwordConfirm: "",
      }));
      setStatusMessage("Profil mis a jour.");
    } catch (updateError) {
      setErrorMessage(
        updateError instanceof Error
          ? updateError.message
          : "Impossible de mettre a jour le profil."
      );
    }
  };

  if (!isReady) {
    return <p className="catalog-summary">Chargement du profil...</p>;
  }

  if (!session) {
    return (
      <div className="empty-panel">
        <strong>Connecte-toi pour gerer ton espace</strong>
        <p>
          Tu pourras sauvegarder des recettes, creer tes propres plats et gerer
          ton profil depuis cette page.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="profile-header">
        <img
          alt={userDisplayName}
          src={
            session.user.profile_image ||
            "/default-avatar.svg"
          }
        />
        <div className="profile-info">
          <h1 className="font-display">{userDisplayName}</h1>
          <p>
            {session.user.bio ||
              "Cree, sauvegarde et partage tes suggestions culinaires en toute simplicite."}
          </p>
          <div className="profile-stats">
            {profileStats.map((stat) => (
              <div className="p-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn btn-secondary"
          style={{ alignSelf: "flex-start", marginLeft: "auto" }}
          type="button"
          onClick={openSettingsTab}
        >
          <Settings size={18} />
          Gerer
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "favorites" ? "is-active" : ""}`}
          type="button"
          onClick={() => {
            setVisibleFavoritesCount(6);
            setActiveTab("favorites");
          }}
        >
          Recettes sauvegardees
        </button>
        <button
          className={`tab ${activeTab === "my-recipes" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("my-recipes")}
        >
          Mes recettes
        </button>
        <button
          className={`tab ${activeTab === "editor" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("editor")}
        >
          {editingRecipeId ? "Modifier la recette" : "Creer une recette"}
        </button>
        <button
          className={`tab ${activeTab === "settings" ? "is-active" : ""}`}
          type="button"
          onClick={openSettingsTab}
        >
          Modifier mon profil
        </button>
      </div>

      {errorMessage ? <p className="form-message form-message--error">{errorMessage}</p> : null}
      {statusMessage ? <p className="form-message form-message--success">{statusMessage}</p> : null}

      {activeTab === "favorites" ? (
        visibleFavorites.length > 0 ? (
          <>
            <div className="recipe-grid recipe-grid--favorites">
              {visibleFavorites.slice(0, visibleFavoritesCount).map((recipe) => (
                <RecipeCard compact key={recipe.id} recipe={recipe} />
              ))}
            </div>
            {visibleFavorites.length > visibleFavoritesCount ? (
              <div className="profile-actions-row">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setVisibleFavoritesCount((current) => current + 3)}
                >
                  Afficher plus
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="empty-panel">
            <strong>Aucune recette sauvegardee pour l&apos;instant</strong>
            <p>Ajoute des likes depuis le catalogue ou la page detail pour les retrouver ici.</p>
          </div>
        )
      ) : null}

      {activeTab === "my-recipes" ? (
        myRecipes.length > 0 ? (
          <div className="profile-recipes-list">
            {myRecipes.map((recipe) => (
              <div className="profile-recipe-item" key={recipe.id}>
                <RecipeCard compact recipe={recipe} />
                <div className="profile-recipe-actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleEditRecipe(recipe)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      void handleDeleteRecipe(recipe.id);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <strong>Tu n&apos;as pas encore publie de recette</strong>
            <p>
              Commence par creer un plat simple avec un titre, un pays, un type
              et quelques ingredients.
            </p>
          </div>
        )
      ) : null}

      {activeTab === "editor" ? (
        <form className="recipe-editor" onSubmit={handleSubmit}>
          <div className="recipe-editor-grid">
            <div className="form-group">
              <label htmlFor="recipe-title">Titre</label>
              <input
                className="form-input"
                id="recipe-title"
                required
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-image">Photo de la recette</label>
              <input
                className="form-input"
                id="recipe-image"
                placeholder="/ressources/tiramisu.png"
                required
                value={formState.image_url}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, image_url: event.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-category">Type de plat</label>
              <select
                className="form-input"
                id="recipe-category"
                required
                value={formState.category_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    category_id: event.target.value,
                  }))
                }
              >
                <option value="">Choisir</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recipe-country">Pays</label>
              <select
                className="form-input"
                id="recipe-country"
                required
                value={formState.country_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    country_id: event.target.value,
                  }))
                }
              >
                <option value="">Choisir</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recipe-prep">Preparation (min)</label>
              <input
                className="form-input"
                id="recipe-prep"
                min="0"
                type="number"
                value={formState.prep_time}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    prep_time: event.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-cook">Cuisson (min)</label>
              <input
                className="form-input"
                id="recipe-cook"
                min="0"
                type="number"
                value={formState.cook_time}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    cook_time: event.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-servings">Portions</label>
              <input
                className="form-input"
                id="recipe-servings"
                min="1"
                type="number"
                value={formState.servings}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    servings: event.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipe-difficulty">Difficulte (1-5)</label>
              <input
                className="form-input"
                id="recipe-difficulty"
                max="5"
                min="1"
                type="number"
                value={formState.difficulty}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    difficulty: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipe-description">Description</label>
            <textarea
              className="form-input form-textarea"
              id="recipe-description"
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="form-group editor-inline-section">
            <label className="editor-section-label">Regimes alimentaires</label>
            <div className="diet-grid">
              {diets.map((diet) => {
                const checked = formState.diet_ids.includes(diet.id);

                return (
                  <label className="diet-option" key={diet.id}>
                    <input
                      checked={checked}
                      type="checkbox"
                      onChange={() =>
                        setFormState((current) => ({
                          ...current,
                          diet_ids: checked
                            ? current.diet_ids.filter((id) => id !== diet.id)
                            : [...current.diet_ids, diet.id],
                        }))
                      }
                    />
                    <span>{diet.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            <div className="ingredient-editor-list">
              {formState.ingredients.map((ingredient, index) => (
                <div className="ingredient-editor-row" key={`ingredient-${index + 1}`}>
                  <input
                    className="form-input"
                    placeholder="Nom"
                    value={ingredient.name}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        ingredients: current.ingredients.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, name: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <input
                    className="form-input"
                    min="0"
                    placeholder="Quantite"
                    step="0.1"
                    type="number"
                    value={ingredient.quantity}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        ingredients: current.ingredients.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, quantity: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <input
                    className="form-input"
                    placeholder="Unite"
                    value={ingredient.unit}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        ingredients: current.ingredients.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, unit: event.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() =>
                      setFormState((current) => ({
                        ...current,
                        ingredients:
                          current.ingredients.length === 1
                            ? current.ingredients
                            : current.ingredients.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() =>
                setFormState((current) => ({
                  ...current,
                  ingredients: [
                    ...current.ingredients,
                    { name: "", quantity: "1", unit: "portion" },
                  ],
                }))
              }
            >
              Ajouter un ingredient
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="recipe-instructions">Preparation</label>
            <textarea
              className="form-input form-textarea"
              id="recipe-instructions"
              placeholder={"Etape 1\nEtape 2\nEtape 3"}
              required
              value={formState.instructions}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  instructions: event.target.value,
                }))
              }
            />
          </div>

          <div className="profile-recipe-actions">
            <button className="btn btn-primary" type="submit">
              {editingRecipeId ? "Mettre a jour la recette" : "Creer la recette"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                resetForm();
                setStatusMessage("");
                setErrorMessage("");
              }}
            >
              Reinitialiser
            </button>
          </div>
        </form>
      ) : null}

      {activeTab === "settings" ? (
        <form className="profile-settings-card" onSubmit={handleProfileSubmit}>
          <div className="profile-settings-header">
            <div>
              <h3>Modifier le profil</h3>
              <p>Photo, description et mot de passe dans un seul espace.</p>
            </div>
            <img
              alt={userDisplayName}
              className="profile-settings-avatar"
              src={profileForm.profile_image.trim() || "/default-avatar.svg"}
            />
          </div>

          <div className="recipe-editor-grid">
            <div className="form-group">
              <label htmlFor="profile-image">Photo de profil</label>
              <input
                className="form-input"
                id="profile-image"
                placeholder="https://..."
                value={profileForm.profile_image}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    profile_image: event.target.value,
                  }))
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-password">Nouveau mot de passe</label>
              <input
                className="form-input"
                id="profile-password"
                minLength={8}
                placeholder="Minimum 8 caracteres"
                type="password"
                value={profileForm.password}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="profile-bio">Description</label>
            <textarea
              className="form-input form-textarea"
              id="profile-bio"
              placeholder="Parle un peu de ta cuisine et de ce que tu aimes partager."
              value={profileForm.bio}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...current,
                  bio: event.target.value,
                }))
              }
            />
          </div>

          <div className="form-group profile-password-row">
            <div>
              <label htmlFor="profile-password-confirm">Confirmer le mot de passe</label>
              <input
                className="form-input"
                id="profile-password-confirm"
                minLength={8}
                placeholder="Retape le mot de passe"
                type="password"
                value={profileForm.passwordConfirm}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    passwordConfirm: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="profile-recipe-actions">
            <button className="btn btn-primary" type="submit">
              Enregistrer le profil
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() =>
                setProfileForm({
                  profile_image: session.user.profile_image || "",
                  bio: session.user.bio || "",
                  password: "",
                  passwordConfirm: "",
                })
              }
            >
              Reinitialiser
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
}
