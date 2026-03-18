import prisma from "@/lib/prisma";
import { recipeRelationsInclude } from "@/lib/recipe-relations";

type RecipeWriteMode = "create" | "update";

type RawIngredient = {
  name?: unknown;
  quantity?: unknown;
  unit?: unknown;
};

type ParsedIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

function parseNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? undefined : numericValue;
}

function parseIngredient(rawIngredient: RawIngredient): ParsedIngredient | null {
  const name = String(rawIngredient?.name ?? "").trim();

  if (!name) {
    return null;
  }

  const parsedQuantity = parseNumber(rawIngredient?.quantity);

  return {
    name,
    quantity: parsedQuantity && parsedQuantity > 0 ? parsedQuantity : 1,
    unit: String(rawIngredient?.unit ?? "").trim() || "portion",
  };
}

function parseDietIds(input: unknown, mode: RecipeWriteMode) {
  if (input == null || !Array.isArray(input)) {
    return mode === "create" ? [] : null;
  }

  return input
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value));
}

function parseIngredients(input: unknown, mode: RecipeWriteMode) {
  if (input == null || !Array.isArray(input)) {
    return mode === "create" ? [] : null;
  }

  return input
    .map((ingredient) => parseIngredient(ingredient as RawIngredient))
    .filter((ingredient): ingredient is ParsedIngredient => ingredient !== null);
}

export function parseRecipeWriteInput(body: Record<string, unknown>, mode: RecipeWriteMode) {
  return {
    recipeData: {
      user_id: body.user_id != null ? Number(body.user_id) : undefined,
      title: body.title != null ? String(body.title) : undefined,
      description: body.description != null ? String(body.description) : body.description,
      difficulty: body.difficulty != null ? Number(body.difficulty) : undefined,
      prep_time: body.prep_time != null ? Number(body.prep_time) : undefined,
      cook_time: body.cook_time != null ? Number(body.cook_time) : undefined,
      servings: body.servings != null ? Number(body.servings) : undefined,
      instructions: body.instructions != null ? String(body.instructions) : undefined,
      image_url: body.image_url != null ? String(body.image_url) : body.image_url,
      category_id: body.category_id != null ? Number(body.category_id) : undefined,
      country_id: body.country_id != null ? Number(body.country_id) : undefined,
    },
    dietIds: parseDietIds(body.diet_ids, mode),
    ingredients: parseIngredients(body.ingredients, mode),
  };
}

export async function syncRecipeRelations(
  recipeId: number,
  options: {
    dietIds: number[] | null;
    ingredients: ParsedIngredient[] | null;
  }
) {
  const { dietIds, ingredients } = options;

  if (dietIds !== null) {
    await prisma.recipe_diets.deleteMany({
      where: { recipe_id: recipeId },
    });

    if (dietIds.length > 0) {
      await prisma.recipe_diets.createMany({
        data: dietIds.map((dietId) => ({
          recipe_id: recipeId,
          diet_id: dietId,
        })),
      });
    }
  }

  if (ingredients !== null) {
    await prisma.recipe_ingredients.deleteMany({
      where: { recipe_id: recipeId },
    });

    for (const ingredient of ingredients) {
      const existingIngredient = await prisma.ingredients.upsert({
        where: { name: ingredient.name },
        update: {},
        create: {
          name: ingredient.name,
          category: "General",
        },
      });

      await prisma.recipe_ingredients.create({
        data: {
          recipe_id: recipeId,
          ingredient_id: existingIngredient.id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        },
      });
    }
  }
}

export async function fetchRecipeWithRelations(recipeId: number) {
  return prisma.recipes.findUnique({
    where: { id: recipeId },
    include: recipeRelationsInclude,
  });
}
