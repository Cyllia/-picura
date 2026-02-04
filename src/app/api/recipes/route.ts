import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim();
  const categoryId = searchParams.get("categoryId");
  const countryId = searchParams.get("countryId");
  const userId = searchParams.get("userId");

  const where: Record<string, unknown> = {};

  if (search) {
    where.title = { contains: search };
  }

  if (categoryId) {
    const value = Number(categoryId);
    if (!Number.isNaN(value)) where.category_id = value;
  }

  if (countryId) {
    const value = Number(countryId);
    if (!Number.isNaN(value)) where.country_id = value;
  }

  if (userId) {
    const value = Number(userId);
    if (!Number.isNaN(value)) where.user_id = value;
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

export async function POST(request: Request) {
  const body = await request.json();

  const requiredFields = ["user_id", "title", "instructions", "category_id", "country_id"];
  const missing = requiredFields.filter((field) => body?.[field] == null);

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const recipe = await prisma.recipes.create({
    data: {
      user_id: Number(body.user_id),
      title: String(body.title),
      description: body.description ? String(body.description) : null,
      difficulty: body.difficulty != null ? Number(body.difficulty) : undefined,
      prep_time: body.prep_time != null ? Number(body.prep_time) : undefined,
      cook_time: body.cook_time != null ? Number(body.cook_time) : undefined,
      servings: body.servings != null ? Number(body.servings) : undefined,
      instructions: String(body.instructions),
      image_url: body.image_url ? String(body.image_url) : null,
      category_id: Number(body.category_id),
      country_id: Number(body.country_id),
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}
