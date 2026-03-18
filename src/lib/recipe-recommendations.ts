import type { FrontRecipe } from "@/lib/epicuria-api";

function normalizeLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function countSharedValues(left: string[], right: string[]) {
  const rightSet = new Set(right.map(normalizeLabel));

  return left.reduce((count, value) => {
    return rightSet.has(normalizeLabel(value)) ? count + 1 : count;
  }, 0);
}

export function getRecommendedRecipes(
  currentRecipe: FrontRecipe,
  recipes: FrontRecipe[],
  limit = 3
) {
  const currentIngredients = currentRecipe.ingredients.map((ingredient) => ingredient.name);
  const currentDiets = currentRecipe.diets;
  const currentType = normalizeLabel(currentRecipe.type);
  const currentSeason = normalizeLabel(currentRecipe.season);

  return recipes
    .filter((recipe) => recipe.id !== currentRecipe.id)
    .map((recipe) => {
      const sharedIngredients = countSharedValues(
        currentIngredients,
        recipe.ingredients.map((ingredient) => ingredient.name)
      );
      const sharedDiets = countSharedValues(currentDiets, recipe.diets);
      const sameType = normalizeLabel(recipe.type) === currentType ? 1 : 0;
      const sameSeason = normalizeLabel(recipe.season) === currentSeason ? 1 : 0;
      const score =
        sameType * 8 +
        sharedIngredients * 3 +
        sharedDiets * 2 +
        sameSeason;

      return {
        recipe,
        score,
        sharedIngredients,
        sharedDiets,
        sameType: Boolean(sameType),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.sharedIngredients !== left.sharedIngredients) {
        return right.sharedIngredients - left.sharedIngredients;
      }

      return right.recipe.favoriteCount - left.recipe.favoriteCount;
    })
    .slice(0, limit)
    .map((entry) => entry.recipe);
}
