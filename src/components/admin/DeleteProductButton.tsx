"use client";

export function DeleteProductButton({
  action,
  productName,
}: {
  action: (formData: FormData) => void;
  productName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`'${productName}' 상품을 삭제할까요? 되돌릴 수 없어요.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-line px-3 py-1 text-xs font-medium text-sale transition hover:border-sale"
      >
        삭제
      </button>
    </form>
  );
}
