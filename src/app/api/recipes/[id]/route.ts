import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const recipe = await prisma.recipes.findUnique({
    where: { id },
    include: {
      categories: true,
      countries: true,
      users: true,
      recipe_diets: { include: { diets: true } },
      recipe_ingredients: { include: { ingredients: true } },
      ratings: true,
      favorites: true,
    },
  });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();

  const recipe = await prisma.recipes.update({
    where: { id },
    data: {
      title: body.title != null ? String(body.title) : undefined,
      description: body.description != null ? String(body.description) : undefined,
      difficulty: body.difficulty != null ? Number(body.difficulty) : undefined,
      prep_time: body.prep_time != null ? Number(body.prep_time) : undefined,
      cook_time: body.cook_time != null ? Number(body.cook_time) : undefined,
      servings: body.servings != null ? Number(body.servings) : undefined,
      instructions: body.instructions != null ? String(body.instructions) : undefined,
      image_url: body.image_url != null ? String(body.image_url) : undefined,
      category_id: body.category_id != null ? Number(body.category_id) : undefined,
      country_id: body.country_id != null ? Number(body.country_id) : undefined,
    },
  });

  return NextResponse.json(recipe);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.recipes.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
