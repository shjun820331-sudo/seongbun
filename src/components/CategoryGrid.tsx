import Link from "next/link";
import { CATEGORIES } from "@/types/product";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-6">
      <h2 className="text-base font-semibold text-ink">카테고리</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-xl border border-line bg-surface p-4 transition hover:border-brand/40 hover:shadow-sm"
          >
            <p className="font-medium text-ink">{category.shortLabel}</p>
            <p className="mt-1 text-xs text-muted">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
