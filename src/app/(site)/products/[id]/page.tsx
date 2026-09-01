import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById } from "@/lib/products";
import { getCategoryMeta, getVerificationCriteria } from "@/types/product";
import { formatPrice } from "@/lib/products";
import { ProductBadges } from "@/components/ProductBadges";

const MARKET_LABEL: Record<string, string> = {
  coupang: "쿠팡",
  toss: "토스쇼핑",
};

// 관리자 페이지에서 등록/수정/삭제한 내용이 재배포 없이 바로 반영되도록
// 정적 프리렌더 대신 매 요청마다 렌더링한다.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/products/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} | 성분지기`,
    description: product.comment,
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/products/[id]">
) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) notFound();

  const categoryMeta = getCategoryMeta(product.category);
  const criteria = getVerificationCriteria(
    product.category,
    product.householdSubType
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        href={`/category/${product.category}`}
        className="text-sm text-muted hover:text-brand"
      >
        ← {categoryMeta.label}
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-line/40">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
            priority
          />
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-muted backdrop-blur">
            {MARKET_LABEL[product.marketSource]}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted">{categoryMeta.label}</p>
            <h1 className="mt-1 text-xl font-bold text-ink">
              {product.name}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-ink">
              {formatPrice(product.price)}
            </p>
          </div>

          <ProductBadges product={product} />

          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-xs font-medium text-muted">왜 골랐는지</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              {product.comment}
            </p>
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored nofollow"
            className="mt-auto rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {MARKET_LABEL[product.marketSource]}에서 구매하기
          </a>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">검증 근거</h2>
        <p className="mt-1 text-sm text-muted">
          아래 기준을 확인하고 원재료표·성분표가 기준에 맞아 등록한
          상품이에요.
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {criteria.map((item) => (
            <li
              key={item}
              className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand-dark"
            >
              ✓ {item}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm leading-relaxed text-ink">
          {product.verificationNote}
        </p>

        <div className="relative mt-4 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border border-line">
          <Image
            src={product.verificationImageUrl}
            alt={`${product.name} 검증 근거 이미지`}
            fill
            sizes="384px"
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
}
