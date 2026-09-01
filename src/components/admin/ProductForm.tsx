"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CATEGORIES } from "@/types/product";
import type { Category, Product } from "@/types/product";
import type { ProductFormState } from "@/app/admin/products/actions";

const initialState: ProductFormState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-sale" role="alert">
      {message}
    </p>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? "저장 중..." : label}
    </button>
  );
}

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (
    state: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  product?: Product;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const [category, setCategory] = useState<Category | "">(
    product?.category ?? ""
  );
  const errors = state?.fieldErrors ?? {};
  const v = state?.values;

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none";
  const labelClass = "text-sm font-medium text-ink";

  return (
    // 서버 액션이 필드 오류를 반환하면 브라우저가 폼을 네이티브로 리셋해
    // 입력값이 사라진다. state가 바뀔 때마다 폼을 다시 마운트해 방금
    // 제출했던 값(state.values)을 defaultValue로 다시 채워 넣는다.
    <form
      key={JSON.stringify(state)}
      action={formAction}
      className="flex flex-col gap-5"
    >
      {state?.error && (
        <p className="rounded-lg bg-sale-soft px-3 py-2 text-sm text-sale" role="alert">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          상품명
        </label>
        <input
          id="name"
          name="name"
          defaultValue={v?.name ?? product?.name}
          className={inputClass}
        />
        <FieldError message={errors.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={labelClass}>
            카테고리
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            <option value="" disabled>
              선택해주세요
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.category} />
        </div>

        {category === "household" && (
          <div>
            <label htmlFor="householdSubType" className={labelClass}>
              생활용품 세부 유형
            </label>
            <select
              id="householdSubType"
              name="householdSubType"
              defaultValue={
                v?.householdSubType ?? product?.householdSubType ?? ""
              }
              className={inputClass}
            >
              <option value="" disabled>
                선택해주세요
              </option>
              <option value="hygiene">위생용품 (생리대·물티슈·손수건 등)</option>
              <option value="cleaning">세제·비누</option>
            </select>
            <FieldError message={errors.householdSubType} />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={labelClass}>
            가격 (원)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={v?.price ?? product?.price}
            className={inputClass}
          />
          <FieldError message={errors.price} />
        </div>

        <div>
          <label htmlFor="marketSource" className={labelClass}>
            마켓 출처
          </label>
          <select
            id="marketSource"
            name="marketSource"
            defaultValue={v?.marketSource ?? product?.marketSource ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              선택해주세요
            </option>
            <option value="coupang">쿠팡</option>
            <option value="toss">토스쇼핑</option>
          </select>
          <FieldError message={errors.marketSource} />
        </div>
      </div>

      <div>
        <label htmlFor="affiliateUrl" className={labelClass}>
          제휴 링크 URL
        </label>
        <input
          id="affiliateUrl"
          name="affiliateUrl"
          defaultValue={v?.affiliateUrl ?? product?.affiliateUrl}
          placeholder="https://link.coupang.com/a/..."
          className={inputClass}
        />
        <FieldError message={errors.affiliateUrl} />
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClass}>
          상품 이미지 URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={v?.imageUrl ?? product?.imageUrl}
          placeholder="https://..."
          className={inputClass}
        />
        <FieldError message={errors.imageUrl} />
      </div>

      <div>
        <label htmlFor="verificationNote" className={labelClass}>
          검증 근거 설명
        </label>
        <textarea
          id="verificationNote"
          name="verificationNote"
          rows={3}
          defaultValue={v?.verificationNote ?? product?.verificationNote}
          placeholder="원재료표에서 무엇을 확인했는지 적어주세요."
          className={inputClass}
        />
        <FieldError message={errors.verificationNote} />
      </div>

      <div>
        <label htmlFor="verificationImageUrl" className={labelClass}>
          검증 근거 이미지 URL (원재료표·인증서)
        </label>
        <input
          id="verificationImageUrl"
          name="verificationImageUrl"
          defaultValue={
            v?.verificationImageUrl ?? product?.verificationImageUrl
          }
          placeholder="https://..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted">
          파일 업로드는 아직 지원하지 않아요. 이미지가 올라가 있는 URL을
          입력해주세요.
        </p>
        <FieldError message={errors.verificationImageUrl} />
      </div>

      <div>
        <label htmlFor="comment" className={labelClass}>
          왜 골랐는지
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={2}
          defaultValue={v?.comment ?? product?.comment}
          placeholder="예: 원재료표를 확인하고 골랐어요."
          className={inputClass}
        />
        <FieldError message={errors.comment} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="personallyTried"
            defaultChecked={v?.personallyTried ?? product?.personallyTried}
            className="h-4 w-4 rounded border-line accent-brand"
          />
          🙋 직접 써봄 뱃지 표시
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="onSale"
            defaultChecked={v?.onSale ?? product?.onSale}
            className="h-4 w-4 rounded border-line accent-brand"
          />
          🔥 지금 할인중 뱃지 표시
        </label>
        <div className="border-t border-line pt-3">
          <label className="flex items-start gap-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              name="confirmVerified"
              defaultChecked={v?.confirmVerified ?? Boolean(product?.verified)}
              className="mt-0.5 h-4 w-4 rounded border-line accent-brand"
            />
            <span>
              ✅ 원재료표·성분표를 확인했고, 기준에 맞아요
              <span className="block text-xs font-normal text-muted">
                이 항목을 체크해야 상품이 등록·저장돼요. (성분 확인 뱃지는
                항상 표시되며, 이 체크가 그 확인 절차를 의미해요.)
              </span>
            </span>
          </label>
          <FieldError message={errors.confirmVerified} />
        </div>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
