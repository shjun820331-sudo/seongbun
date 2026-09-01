import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/products/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "상품 수정 | 성분지기",
  robots: { index: false, follow: false },
};

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">
) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <AdminTopBar title={`상품 수정 · ${product.name}`} />
      <div className="mt-6">
        <ProductForm
          action={updateProduct.bind(null, id)}
          product={product}
          submitLabel="저장하기"
        />
      </div>
    </div>
  );
}
