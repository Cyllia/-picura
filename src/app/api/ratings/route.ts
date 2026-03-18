import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { publicUserSelect } from "@/lib/public-user-select";
import { parseOptionalNumber } from "@/lib/route-utils";
import { syncRecipeRatingStats } from "@/lib/rating-stats";

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

  const ratings = await prisma.ratings.findMany({
    where,
    include: { users: { select: publicUserSelect }, recipes: true },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(ratings);
}

export async function POST(request: Request) {
  const body = await request.json();

  const userId = Number(body?.user_id);
  const recipeId = Number(body?.recipe_id);
  const rating = Number(body?.rating);
  const comment = body?.comment != null ? String(body.comment) : null;

  if (Number.isNaN(userId) || Number.isNaN(recipeId) || Number.isNaN(rating)) {
    return NextResponse.json(
      { error: "user_id, recipe_id and rating are required" },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const created = await prisma.ratings.create({
    data: {
      user_id: userId,
      recipe_id: recipeId,
      rating,
      comment,
    },
  });

  await syncRecipeRatingStats(created.recipe_id);

  return NextResponse.json(created, { status: 201 });
}
