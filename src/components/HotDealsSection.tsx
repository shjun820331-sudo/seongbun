import { getHotDeals } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export async function HotDealsSection() {
  const deals = await getHotDeals();
  if (deals.length === 0) return null;

  return (
    <section className="border-b border-line bg-brand-soft/40">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-base font-semibold text-ink">
          지금 할인중인 검증 상품
        </h2>
        <p className="mt-1 text-sm text-muted">
          성분 확인을 마친 상품 중 지금 할인중인 것만 모았어요. 할인 여부와
          가격은 판매처 사정에 따라 바뀔 수 있어요.
        </p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {deals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-40 shrink-0 sm:w-44"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
