import Link from "next/link";
import type { SortOrder } from "@/lib/products";

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

export function SortToggle({
  basePath,
  sort,
  params = {},
}: {
  basePath: string;
  sort: SortOrder;
  params?: Record<string, string>;
}) {
  return (
    <div className="inline-flex rounded-full border border-line bg-surface p-0.5 text-xs">
      {OPTIONS.map((option) => {
        const search = new URLSearchParams({ ...params, sort: option.value });
        const active = sort === option.value;
        return (
          <Link
            key={option.value}
            href={`${basePath}?${search.toString()}`}
            className={`rounded-full px-3 py-1.5 font-medium transition ${
              active ? "bg-brand text-white" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
