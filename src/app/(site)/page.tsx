import { HotDealsSection } from "@/components/HotDealsSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductGrid } from "@/components/ProductGrid";
import { SortToggle } from "@/components/SortToggle";
import { getAllProducts, type SortOrder } from "@/lib/products";

function parseSort(value: string | undefined): SortOrder {
  return value === "oldest" ? "oldest" : "newest";
}

export default async function Home(props: PageProps<"/">) {
  const { sort } = await props.searchParams;
  const order = parseSort(typeof sort === "string" ? sort : undefined);
  const products = await getAllProducts(order);

  return (
    <>
      <HotDealsSection />
      <CategoryGrid />
      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">전체 상품</h2>
            <p className="mt-1 text-sm text-muted">
              성분을 확인한 상품만 모았어요.
            </p>
          </div>
          <SortToggle basePath="/" sort={order} />
        </div>
        <div className="mt-4">
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
