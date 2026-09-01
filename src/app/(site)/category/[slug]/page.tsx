import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES } from "@/types/product";
import { getProductsByCategory, type SortOrder } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SortToggle } from "@/components/SortToggle";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/category/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const meta = CATEGORIES.find((c) => c.slug === slug);
  if (!meta) return {};
  return {
    title: `${meta.label} | 성분지기`,
    description: meta.description,
  };
}

function parseSort(value: string | undefined): SortOrder {
  return value === "oldest" ? "oldest" : "newest";
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">
) {
  const { slug } = await props.params;
  const { sort } = await props.searchParams;
  const meta = CATEGORIES.find((c) => c.slug === slug);
  if (!meta) notFound();

  const order = parseSort(typeof sort === "string" ? sort : undefined);
  const products = await getProductsByCategory(meta.slug, order);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link href="/" className="text-sm text-muted hover:text-brand">
        ← 홈으로
      </Link>
      <h1 className="mt-2 text-xl font-bold text-ink">{meta.label}</h1>
      <p className="mt-1 text-sm text-muted">{meta.description}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">{products.length}개 상품</p>
        <SortToggle basePath={`/category/${meta.slug}`} sort={order} />
      </div>

      <div className="mt-3">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
