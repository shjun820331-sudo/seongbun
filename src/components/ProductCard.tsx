import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/products";
import { ProductBadges } from "@/components/ProductBadges";

const MARKET_LABEL: Record<Product["marketSource"], string> = {
  coupang: "쿠팡",
  toss: "토스쇼핑",
};

export function ProductCard({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-brand/40 hover:shadow-sm ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-line/40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-medium text-muted backdrop-blur">
          {MARKET_LABEL[product.marketSource]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 text-sm text-ink">{product.name}</p>
        <p className="text-base font-semibold text-ink">
          {formatPrice(product.price)}
        </p>
        <ProductBadges product={product} />
      </div>
    </Link>
  );
}
