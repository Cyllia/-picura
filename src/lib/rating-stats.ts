import prisma from "@/lib/prisma";

export async function syncRecipeRatingStats(recipeId: number) {
  const aggregates = await prisma.ratings.aggregate({
    where: { recipe_id: recipeId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.recipes.update({
    where: { id: recipeId },
    data: {
      avg_rating: aggregates._count.rating > 0 ? Number(aggregates._avg.rating ?? 0) : 0,
      total_ratings: aggregates._count.rating,
    },
  });
}
