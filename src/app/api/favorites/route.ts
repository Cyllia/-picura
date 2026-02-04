import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const recipeId = searchParams.get("recipeId");

  const where: Record<string, unknown> = {};

  if (userId) {
    const value = Number(userId);
    if (!Number.isNaN(value)) where.user_id = value;
  }

  if (recipeId) {
    const value = Number(recipeId);
    if (!Number.isNaN(value)) where.recipe_id = value;
  }

  const favorites = await prisma.favorites.findMany({
    where,
    include: { recipes: true, users: true },
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

  const favorite = await prisma.favorites.create({
    data: {
      user_id: userId,
      recipe_id: recipeId,
    },
  });

  return NextResponse.json(favorite, { status: 201 });
}
