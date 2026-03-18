import type { Prisma } from "@prisma/client";
import { publicUserSelect } from "@/lib/public-user-select";

export const recipeRelationsInclude = {
  categories: true,
  countries: true,
  users: { select: publicUserSelect },
  recipe_diets: { include: { diets: true } },
  recipe_ingredients: { include: { ingredients: true } },
  ratings: true,
  favorites: true,
} satisfies Prisma.recipesInclude;

export const favoriteRelationsInclude = {
  recipes: {
    include: recipeRelationsInclude,
  },
  users: {
    select: publicUserSelect,
  },
} satisfies Prisma.favoritesInclude;
