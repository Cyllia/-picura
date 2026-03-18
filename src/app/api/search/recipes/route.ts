import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recipeRelationsInclude } from "@/lib/recipe-relations";
import { parseOptionalNumber } from "@/lib/route-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q")?.trim();
  const ingredient = searchParams.get("ingredient")?.trim();
  const categoryId = parseOptionalNumber(searchParams.get("categoryId"));
  const countryId = parseOptionalNumber(searchParams.get("countryId"));
  const dietId = parseOptionalNumber(searchParams.get("dietId"));

  const where: Record<string, unknown> = {};

  if (q) {
    where.title = { contains: q };
  }

  if (categoryId !== undefined) {
    where.category_id = categoryId;
  }

  if (countryId !== undefined) {
    where.country_id = countryId;
  }

  if (dietId !== undefined) {
    where.recipe_diets = { some: { diet_id: dietId } };
  }

  if (ingredient) {
    const ingredientId = Number(ingredient);
    if (!Number.isNaN(ingredientId)) {
      where.recipe_ingredients = { some: { ingredient_id: ingredientId } };
    } else {
      where.recipe_ingredients = {
        some: { ingredients: { name: { contains: ingredient } } },
      };
    }
  }

  const recipes = await prisma.recipes.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: recipeRelationsInclude,
  });

  return NextResponse.json(recipes);
}
