import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recipeRelationsInclude } from "@/lib/recipe-relations";
import { parseOptionalNumber } from "@/lib/route-utils";
import {
  fetchRecipeWithRelations,
  parseRecipeWriteInput,
  syncRecipeRelations,
} from "@/lib/recipe-write";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim();
  const categoryId = parseOptionalNumber(searchParams.get("categoryId"));
  const countryId = parseOptionalNumber(searchParams.get("countryId"));
  const userId = parseOptionalNumber(searchParams.get("userId"));

  const where: Record<string, unknown> = {};

  if (search) {
    where.title = { contains: search };
  }

  if (categoryId !== undefined) {
    where.category_id = categoryId;
  }

  if (countryId !== undefined) {
    where.country_id = countryId;
  }

  if (userId !== undefined) {
    where.user_id = userId;
  }

  const recipes = await prisma.recipes.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: recipeRelationsInclude,
  });

  return NextResponse.json(recipes);
}

export async function POST(request: Request) {
  const body = await request.json();

  const requiredFields = [
    "user_id",
    "title",
    "instructions",
    "category_id",
    "country_id",
    "image_url",
  ];
  const missing = requiredFields.filter((field) => body?.[field] == null);

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const parsed = parseRecipeWriteInput(body, "create");

  const recipe = await prisma.recipes.create({
    data: {
      user_id: Number(parsed.recipeData.user_id),
      title: String(parsed.recipeData.title),
      description: parsed.recipeData.description ? String(parsed.recipeData.description) : null,
      difficulty: parsed.recipeData.difficulty,
      prep_time: parsed.recipeData.prep_time,
      cook_time: parsed.recipeData.cook_time,
      servings: parsed.recipeData.servings,
      instructions: String(parsed.recipeData.instructions),
      image_url: parsed.recipeData.image_url ? String(parsed.recipeData.image_url) : null,
      category_id: Number(parsed.recipeData.category_id),
      country_id: Number(parsed.recipeData.country_id),
    },
  });

  await syncRecipeRelations(recipe.id, {
    dietIds: parsed.dietIds,
    ingredients: parsed.ingredients,
  });

  const fullRecipe = await fetchRecipeWithRelations(recipe.id);

  return NextResponse.json(fullRecipe, { status: 201 });
}
