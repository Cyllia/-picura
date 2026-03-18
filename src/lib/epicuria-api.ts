export type SessionUser = {
  id: number;
  email: string;
  username: string;
  first_name?: string | null;
  profile_image?: string | null;
  bio?: string | null;
};

export type SessionData = {
  token: string;
  user: SessionUser;
};

export type SelectOption = {
  id: number;
  name: string;
};

export type FrontRecipe = {
  id: number;
  slug: string;
  path: string;
  title: string;
  description: string;
  tag: string;
  type: string;
  duration: string;
  servings: string;
  servingsLabel: string;
  prepLabel: string;
  cookLabel: string;
  totalMinutes: number;
  vegetarian: boolean;
  diets: string[];
  image: string;
  imageUrl: string;
  alt: string;
  season: string;
  difficulty: number;
  author: {
    name: string;
    image: string;
  };
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  steps: string[];
  categoryId?: number;
  countryId?: number;
  userId?: number;
  favoriteCount: number;
};

export type FavoriteRecord = {
  id: number;
  recipe_id: number;
  recipe: FrontRecipe | null;
};

export type RecipeFormPayload = {
  user_id: number;
  title: string;
  description: string;
  difficulty: number;
  prep_time: number;
  cook_time: number;
  servings: number;
  instructions: string;
  image_url: string;
  category_id: number;
  country_id: number;
  diet_ids: number[];
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
};

export type ProfileUpdatePayload = {
  profile_image?: string;
  bio?: string;
  password?: string;
};

type ApiRecipeDiet = {
  diets?: {
    name?: string | null;
  } | null;
};

type ApiRecipeIngredient = {
  quantity?: unknown;
  unit?: unknown;
  ingredients?: {
    name?: string | null;
  } | null;
};

type ApiRecipe = {
  id: number;
  title: string;
  description?: string | null;
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number | null;
  difficulty?: number | null;
  instructions?: string | null;
  image_url?: string | null;
  user_id?: number | null;
  category_id?: number | null;
  country_id?: number | null;
  categories?: {
    name?: string | null;
  } | null;
  countries?: {
    name?: string | null;
  } | null;
  users?: SessionUser | null;
  recipe_diets?: ApiRecipeDiet[] | null;
  recipe_ingredients?: ApiRecipeIngredient[] | null;
  favorites?: Array<unknown> | null;
};

type ApiFavoriteRecord = {
  id: number;
  recipe_id: number;
  recipes?: ApiRecipe | null;
};

const fallbackImages = [
  "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const fallbackAvatar =
  "/default-avatar.svg";

const realisticRecipeImages: Array<{ match: string[]; image: string }> = [
  {
    match: ["pates", "pasta", "sauce-tomate"],
    image:
      "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["paella"],
    image:
      "https://images.pexels.com/photos/3928854/pexels-photo-3928854.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["feijoada"],
    image:
      "https://images.pexels.com/photos/5949894/pexels-photo-5949894.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["amok"],
    image:
      "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["bao"],
    image:
      "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["cheesecake"],
    image:
      "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["cornes-de-gazelle"],
    image:
      "https://images.pexels.com/photos/8887056/pexels-photo-8887056.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["apple-pie"],
    image:
      "https://images.pexels.com/photos/2693447/pexels-photo-2693447.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["tiramisu"],
    image:
      "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["pavlova"],
    image:
      "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["bruschetta"],
    image:
      "https://images.pexels.com/photos/5639411/pexels-photo-5639411.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["soupe-aux-pois", "soupe"],
    image:
      "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["beignets-de-riz", "beignets"],
    image:
      "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["samoussas", "samoussas-vegetariens"],
    image:
      "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    match: ["carpaccio-de-saumon", "saumon"],
    image:
      "https://images.pexels.com/photos/3298640/pexels-photo-3298640.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as { error?: string } | T | null;

  if (!response.ok) {
    throw new Error((data as { error?: string } | null)?.error ?? "Une erreur est survenue.");
  }

  return data as T;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDuration(totalMinutes: number) {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}`;
  }

  return `${totalMinutes} min`;
}

function formatAmount(quantity: unknown, unit: unknown) {
  const parsedQuantity = Number(quantity);
  const safeQuantity = Number.isNaN(parsedQuantity)
    ? String(quantity ?? "").trim()
    : Number.isInteger(parsedQuantity)
      ? String(parsedQuantity)
      : parsedQuantity.toFixed(2).replace(/\.?0+$/, "");
  const safeUnit = String(unit ?? "").trim();

  return [safeQuantity, safeUnit].filter(Boolean).join(" ");
}

function resolveRecipeImage(imageUrl: unknown, id: number, title: string) {
  const value = String(imageUrl ?? "").trim();
  const normalizedTitle = slugify(title);
  const mappedImage = realisticRecipeImages.find(({ match }) =>
    match.some((needle) => normalizedTitle.includes(needle))
  )?.image;

  if (mappedImage) {
    return mappedImage;
  }

  if (value) {
    return value;
  }

  return fallbackImages[id % fallbackImages.length];
}

function resolveRecipeType(name: unknown) {
  return String(name ?? "Recette").trim() || "Recette";
}

function resolveAuthorName(user: SessionUser | null | undefined) {
  if (!user) {
    return "Membre Epicuria";
  }

  return user.first_name?.trim() || user.username || "Membre Epicuria";
}

export function getRecipePath(recipe: { id: number; title: string }) {
  return `/recettes/${recipe.id}-${slugify(recipe.title)}`;
}

export function parseRecipeIdFromSlug(slug: string) {
  const rawId = slug.split("-")[0];
  const id = Number(rawId);
  return Number.isNaN(id) ? null : id;
}

export function normalizeRecipe(apiRecipe: ApiRecipe): FrontRecipe {
  const prepTime = Number(apiRecipe.prep_time ?? 0) || 0;
  const cookTime = Number(apiRecipe.cook_time ?? 0) || 0;
  const totalMinutes = prepTime + cookTime || prepTime || cookTime || 0;
  const diets = Array.isArray(apiRecipe.recipe_diets)
    ? apiRecipe.recipe_diets
        .map((item) => item?.diets?.name)
        .filter((diet): diet is string => Boolean(diet))
    : [];

  return {
    id: apiRecipe.id,
    slug: slugify(apiRecipe.title),
    path: getRecipePath({ id: apiRecipe.id, title: apiRecipe.title }),
    title: apiRecipe.title,
    description: apiRecipe.description ?? "",
    tag: resolveRecipeType(apiRecipe.categories?.name),
    type: resolveRecipeType(apiRecipe.categories?.name),
    duration: formatDuration(totalMinutes || 15),
    servings: `${apiRecipe.servings ?? 1} pers`,
    servingsLabel: `${apiRecipe.servings ?? 1} pers`,
    prepLabel: `${prepTime || 0} min`,
    cookLabel: `${cookTime || 0} min`,
    totalMinutes,
    vegetarian: diets.some((diet) => /veg|veget/i.test(diet)),
    diets,
    image: resolveRecipeImage(apiRecipe.image_url, apiRecipe.id, apiRecipe.title),
    imageUrl: String(apiRecipe.image_url ?? "").trim(),
    alt: apiRecipe.title,
    season: apiRecipe.countries?.name || "A decouvrir",
    difficulty: Number(apiRecipe.difficulty ?? 2) || 2,
    author: {
      name: resolveAuthorName(apiRecipe.users),
      image: apiRecipe.users?.profile_image || fallbackAvatar,
    },
    ingredients: Array.isArray(apiRecipe.recipe_ingredients)
      ? apiRecipe.recipe_ingredients.map((item) => ({
          name: item?.ingredients?.name ?? "Ingredient",
          amount: formatAmount(item?.quantity, item?.unit),
        }))
      : [],
    steps: String(apiRecipe.instructions ?? "")
      .split(/\r?\n+/)
      .map((step) => step.trim())
      .filter(Boolean),
    categoryId: apiRecipe.category_id ?? undefined,
    countryId: apiRecipe.country_id ?? undefined,
    userId: apiRecipe.user_id ?? undefined,
    favoriteCount: Array.isArray(apiRecipe.favorites) ? apiRecipe.favorites.length : 0,
  };
}

export async function fetchRecipes(params?: {
  userId?: number;
  search?: string;
  categoryId?: number;
  countryId?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.userId) searchParams.set("userId", String(params.userId));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.categoryId) searchParams.set("categoryId", String(params.categoryId));
  if (params?.countryId) searchParams.set("countryId", String(params.countryId));

  const query = searchParams.toString();
  const url = query ? `/api/recipes?${query}` : "/api/recipes";
  const recipes = await requestJson<ApiRecipe[]>(url);
  return recipes.map(normalizeRecipe);
}

export async function searchRecipes(params?: {
  q?: string;
  ingredient?: string;
  categoryId?: number;
  countryId?: number;
  dietId?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.q) searchParams.set("q", params.q);
  if (params?.ingredient) searchParams.set("ingredient", params.ingredient);
  if (params?.categoryId) searchParams.set("categoryId", String(params.categoryId));
  if (params?.countryId) searchParams.set("countryId", String(params.countryId));
  if (params?.dietId) searchParams.set("dietId", String(params.dietId));

  const query = searchParams.toString();
  const url = query ? `/api/search/recipes?${query}` : "/api/search/recipes";
  const recipes = await requestJson<ApiRecipe[]>(url);
  return recipes.map(normalizeRecipe);
}

export async function fetchRecipeById(id: number) {
  const recipe = await requestJson<ApiRecipe>(`/api/recipes/${id}`);
  return normalizeRecipe(recipe);
}

export function fetchCategories() {
  return requestJson<SelectOption[]>("/api/filters/categories");
}

export function fetchCountries() {
  return requestJson<SelectOption[]>("/api/filters/countries");
}

export function fetchDiets() {
  return requestJson<SelectOption[]>("/api/filters/diets");
}

export function registerRequest(input: {
  first_name?: string;
  email: string;
  username: string;
  password: string;
}) {
  return requestJson<SessionUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginRequest(input: { email: string; password: string }) {
  return requestJson<SessionData>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchFavoritesForUser(userId: number) {
  const records = await requestJson<ApiFavoriteRecord[]>(`/api/favorites?userId=${userId}`);

  return records.map((record) => ({
    id: record.id,
    recipe_id: record.recipe_id,
    recipe: record.recipes ? normalizeRecipe(record.recipes) : null,
  }));
}

export function createFavorite(input: { user_id: number; recipe_id: number }) {
  return requestJson<{ id: number; recipe_id: number }>("/api/favorites", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteFavorite(favoriteId: number) {
  return requestJson<{ success: true }>(`/api/favorites/${favoriteId}`, {
    method: "DELETE",
  });
}

export function createRecipeRequest(payload: RecipeFormPayload) {
  return requestJson<ApiRecipe>("/api/recipes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRecipeRequest(recipeId: number, payload: Partial<RecipeFormPayload>) {
  return requestJson<ApiRecipe>(`/api/recipes/${recipeId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteRecipeRequest(recipeId: number) {
  return requestJson<{ success: true }>(`/api/recipes/${recipeId}`, {
    method: "DELETE",
  });
}

export function updateProfileRequest(userId: number, payload: ProfileUpdatePayload) {
  return requestJson<SessionUser>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
