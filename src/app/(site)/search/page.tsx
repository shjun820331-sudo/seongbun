import type { Metadata } from "next";
import { searchProducts, type SortOrder } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SortToggle } from "@/components/SortToggle";

export const metadata: Metadata = {
  title: "검색 | 성분지기",
};

function parseSort(value: string | undefined): SortOrder {
  return value === "oldest" ? "oldest" : "newest";
}

export default async function SearchPage(props: PageProps<"/search">) {
  const { q, sort } = await props.searchParams;
  const query = typeof q === "string" ? q : "";
  const order = parseSort(typeof sort === "string" ? sort : undefined);

  const results = query ? await searchProducts(query, order) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-bold text-ink">
        {query ? `‘${query}’ 검색 결과` : "검색"}
      </h1>

      {!query && (
        <p className="mt-2 text-sm text-muted">
          상품 이름으로 검색해보세요.
        </p>
      )}

      {query && (
        <>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{results.length}개 상품</p>
            <SortToggle basePath="/search" sort={order} params={{ q: query }} />
          </div>
          <div className="mt-4">
            <ProductGrid products={results} />
          </div>
        </>
      )}
    </div>
  );
}
