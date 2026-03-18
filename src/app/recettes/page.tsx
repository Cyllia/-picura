import { CatalogBrowser } from "@/components/epicuria/catalog-browser";

type RecipesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;

  return (
    <section className="page-view">
      <div className="page-intro">
        <h1>Toutes nos recettes</h1>
        <p>
          Explorez notre collection de recettes testees et approuvees pour
          regaler toute la tablee.
        </p>
      </div>
      <CatalogBrowser initialQuery={params.q ?? ""} />
    </section>
  );
}
