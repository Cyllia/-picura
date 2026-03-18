import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { favoriteRelationsInclude } from "@/lib/recipe-relations";
import { parseOptionalNumber } from "@/lib/route-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = parseOptionalNumber(searchParams.get("userId"));
  const recipeId = parseOptionalNumber(searchParams.get("recipeId"));

  const where: Record<string, unknown> = {};

  if (userId !== undefined) {
    where.user_id = userId;
  }

  if (recipeId !== undefined) {
    where.recipe_id = recipeId;
  }

  const favorites = await prisma.favorites.findMany({
    where,
    include: favoriteRelationsInclude,
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const body = await request.json();

  const userId = Number(body?.user_id);
  const recipeId = Number(body?.recipe_id);

  if (Number.isNaN(userId) || Number.isNaN(recipeId)) {
    return NextResponse.json(
      { error: "user_id and recipe_id are required" },
      { status: 400 }
    );
  }

  const existingFavorite = await prisma.favorites.findFirst({
    where: {
      user_id: userId,
      recipe_id: recipeId,
    },
  });

  const favorite =
    existingFavorite ??
    (await prisma.favorites.create({
      data: {
        user_id: userId,
        recipe_id: recipeId,
      },
    }));

  return NextResponse.json(favorite, { status: 201 });
}
