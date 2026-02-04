import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q")?.trim();
  const ingredient = searchParams.get("ingredient")?.trim();
  const categoryId = searchParams.get("categoryId");
  const countryId = searchParams.get("countryId");
  const dietId = searchParams.get("dietId");

  const where: Record<string, unknown> = {};

  if (q) {
    where.title = { contains: q };
  }

  if (categoryId) {
    const value = Number(categoryId);
    if (!Number.isNaN(value)) where.category_id = value;
  }

  if (countryId) {
    const value = Number(countryId);
    if (!Number.isNaN(value)) where.country_id = value;
  }

  if (dietId) {
    const value = Number(dietId);
    if (!Number.isNaN(value)) {
      where.recipe_diets = { some: { diet_id: value } };
    }
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
    include: {
      categories: true,
      countries: true,
      users: true,
      recipe_diets: { include: { diets: true } },
      recipe_ingredients: { include: { ingredients: true } },
    },
  });

  return NextResponse.json(recipes);
}
