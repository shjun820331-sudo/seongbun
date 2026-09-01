import type { Product } from "@/types/product";

const BADGE_STYLES = {
  verified: "bg-brand-soft text-brand-dark",
  tried: "bg-line text-muted",
  sale: "bg-sale-soft text-sale",
} as const;

function Badge({
  children,
  style,
}: {
  children: React.ReactNode;
  style: keyof typeof BADGE_STYLES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${BADGE_STYLES[style]}`}
    >
      {children}
    </span>
  );
}

export function ProductBadges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.verified && <Badge style="verified">✅ 성분 확인</Badge>}
      {product.personallyTried && <Badge style="tried">🙋 직접 써봄</Badge>}
      {product.onSale && <Badge style="sale">🔥 지금 할인중</Badge>}
    </div>
  );
}
