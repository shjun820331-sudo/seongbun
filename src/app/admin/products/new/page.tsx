import type { Metadata } from "next";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/products/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "새 상품 등록 | 성분지기",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <AdminTopBar title="새 상품 등록" />
      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="등록하기" />
      </div>
    </div>
  );
}
