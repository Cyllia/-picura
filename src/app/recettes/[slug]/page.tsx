import { RecipeDetailView } from "@/components/epicuria/recipe-detail-view";

type RecipeDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;

  return (
    <section className="page-view">
      <RecipeDetailView slug={slug} />
    </section>
  );
}
