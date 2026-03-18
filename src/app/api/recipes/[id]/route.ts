import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recipeRelationsInclude } from "@/lib/recipe-relations";
import { parseRequiredNumber } from "@/lib/route-utils";
import { fetchRecipeWithRelations, parseRecipeWriteInput, syncRecipeRelations } from "@/lib/recipe-write";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseRequiredNumber(idParam);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existingRecipe = await prisma.recipes.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingRecipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const recipe = await prisma.recipes.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: recipeRelationsInclude,
  });

  return NextResponse.json(recipe);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseRequiredNumber(idParam);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = parseRecipeWriteInput(body, "update");

  await prisma.recipes.update({
    where: { id },
    data: {
      title: parsed.recipeData.title,
      description: parsed.recipeData.description,
      difficulty: parsed.recipeData.difficulty,
      prep_time: parsed.recipeData.prep_time,
      cook_time: parsed.recipeData.cook_time,
      servings: parsed.recipeData.servings,
      instructions: parsed.recipeData.instructions,
      image_url: parsed.recipeData.image_url,
      category_id: parsed.recipeData.category_id,
      country_id: parsed.recipeData.country_id,
    },
  });

  await syncRecipeRelations(id, {
    dietIds: parsed.dietIds,
    ingredients: parsed.ingredients,
  });

  const recipe = await fetchRecipeWithRelations(id);

  return NextResponse.json(recipe);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = parseRequiredNumber(idParam);

  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.recipes.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
