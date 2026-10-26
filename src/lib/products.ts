import { PRODUCTS } from "@/data/products";
import type { Category, Product } from "@/types/product";
import { readStore } from "@/lib/store";

export type SortOrder = "newest" | "oldest";

export function sortProducts(
  products: Product[],
  order: SortOrder = "newest"
): Product[] {
  const sorted = [...products].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return order === "newest" ? sorted.reverse() : sorted;
}

/** 시드 더미 데이터 위에 관리자 스토어(등록/수정/삭제)를 덧씌운 최종 상품 목록. */
export async function getEffectiveProducts(): Promise<Product[]> {
  const store = await readStore();
  const merged = new Map<string, Product>();
  for (const p of PRODUCTS) merged.set(p.id, p);
  for (const p of store.created) merged.set(p.id, p);
  for (const [id, p] of Object.entries(store.overrides)) merged.set(id, p);
  for (const id of store.deleted) merged.delete(id);
  return Array.from(merged.values());
}

export async function getAllProducts(
  order: SortOrder = "newest"
): Promise<Product[]> {
  return sortProducts(await getEffectiveProducts(), order);
}

export async function getProductsByCategory(
  category: Category,
  order: SortOrder = "newest"
): Promise<Product[]> {
  const all = await getEffectiveProducts();
  return sortProducts(
    all.filter((p) => p.category === category),
    order
  );
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getEffectiveProducts();
  return all.find((p) => p.id === id);
}

export async function searchProducts(
  query: string,
  order: SortOrder = "newest"
): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getEffectiveProducts();
  return sortProducts(
    all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.comment.toLowerCase().includes(q)
    ),
    order
  );
}

/** 홈 상단 "지금 할인중인 검증 상품" 섹션 — verified && onSale 상품만 대상. */
export async function getHotDeals(limit = 5): Promise<Product[]> {
  const all = await getEffectiveProducts();
  return sortProducts(all.filter((p) => p.verified && p.onSale)).slice(
    0,
    limit
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}
