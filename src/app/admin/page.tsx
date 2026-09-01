import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts, formatPrice } from "@/lib/products";
import { getCategoryMeta } from "@/types/product";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { deleteProduct } from "@/app/admin/products/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "상품 관리 | 성분지기",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const products = await getAllProducts("newest");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <AdminTopBar title="상품 관리" />

      <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-xs leading-relaxed text-brand-dark">
        등록·수정·삭제한 내용은 로컬 파일(data/store.json)에 저장돼요. Vercel
        같은 서버리스 환경에서는 파일 시스템이 요청 간에 유지되지 않아
        배포된 사이트에서는 저장이 되지 않으니, 실제 서비스로 운영하려면 DB
        연동이 필요해요.
      </p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted">{products.length}개 상품</p>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          + 새 상품 등록
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-background text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">상품명</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">가격</th>
              <th className="px-4 py-3 font-medium">뱃지</th>
              <th className="px-4 py-3 font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:text-brand"
                    target="_blank"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {getCategoryMeta(product.category).shortLabel}
                </td>
                <td className="px-4 py-3 text-ink">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 text-xs">
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand-dark">
                      ✅
                    </span>
                    {product.personallyTried && (
                      <span className="rounded-full bg-line px-2 py-0.5 text-muted">
                        🙋
                      </span>
                    )}
                    {product.onSale && (
                      <span className="rounded-full bg-sale-soft px-2 py-0.5 text-sale">
                        🔥
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
                    >
                      수정
                    </Link>
                    <DeleteProductButton
                      action={deleteProduct.bind(null, product.id)}
                      productName={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
