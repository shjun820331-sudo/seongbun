"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readStore, writeStore } from "@/lib/store";
import { getEffectiveProducts } from "@/lib/products";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/types/product";
import type {
  Category,
  HouseholdSubType,
  MarketSource,
  Product,
} from "@/types/product";

export interface SubmittedValues {
  name?: string;
  category?: string;
  householdSubType?: string;
  price?: string;
  marketSource?: string;
  affiliateUrl?: string;
  imageUrl?: string;
  verificationNote?: string;
  verificationImageUrl?: string;
  comment?: string;
  personallyTried?: boolean;
  onSale?: boolean;
  confirmVerified?: boolean;
}

export interface ProductFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: SubmittedValues;
}

const CATEGORY_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type ParsedProduct = Omit<Product, "id" | "createdAt">;

function parseForm(
  formData: FormData
):
  | { data: ParsedProduct }
  | { fieldErrors: Record<string, string>; values: SubmittedValues } {
  const fieldErrors: Record<string, string> = {};

  const name = String(formData.get("name") ?? "").trim();
  if (!name) fieldErrors.name = "상품명을 입력해주세요.";

  const category = String(formData.get("category") ?? "") as Category;
  if (!CATEGORY_SLUGS.has(category)) {
    fieldErrors.category = "카테고리를 선택해주세요.";
  }

  let householdSubType: HouseholdSubType | undefined;
  if (category === "household") {
    const raw = String(formData.get("householdSubType") ?? "");
    if (raw !== "hygiene" && raw !== "cleaning") {
      fieldErrors.householdSubType = "생활용품 세부 유형을 선택해주세요.";
    } else {
      householdSubType = raw;
    }
  }

  const priceRaw = String(formData.get("price") ?? "");
  const price = Number(priceRaw);
  if (!priceRaw || !Number.isFinite(price) || price <= 0) {
    fieldErrors.price = "가격은 0보다 큰 숫자로 입력해주세요.";
  }

  const marketSource = String(
    formData.get("marketSource") ?? ""
  ) as MarketSource;
  if (marketSource !== "coupang" && marketSource !== "toss") {
    fieldErrors.marketSource = "마켓 출처를 선택해주세요.";
  }

  const affiliateUrl = String(formData.get("affiliateUrl") ?? "").trim();
  if (!isValidUrl(affiliateUrl)) {
    fieldErrors.affiliateUrl = "올바른 URL을 입력해주세요.";
  }

  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!isValidUrl(imageUrl)) {
    fieldErrors.imageUrl = "올바른 이미지 URL을 입력해주세요.";
  }

  const verificationNote = String(
    formData.get("verificationNote") ?? ""
  ).trim();
  if (!verificationNote) {
    fieldErrors.verificationNote = "검증 근거 설명을 입력해주세요.";
  }

  const verificationImageUrl = String(
    formData.get("verificationImageUrl") ?? ""
  ).trim();
  if (!isValidUrl(verificationImageUrl)) {
    fieldErrors.verificationImageUrl = "올바른 이미지 URL을 입력해주세요.";
  }

  const comment = String(formData.get("comment") ?? "").trim();
  if (!comment) fieldErrors.comment = "왜 골랐는지 코멘트를 입력해주세요.";

  const confirmVerified = formData.get("confirmVerified") === "on";
  if (!confirmVerified) {
    fieldErrors.confirmVerified =
      "원재료표·성분표를 확인했다는 항목을 체크해야 등록할 수 있어요.";
  }

  const personallyTried = formData.get("personallyTried") === "on";
  const onSale = formData.get("onSale") === "on";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      values: {
        name,
        category: category || undefined,
        householdSubType,
        price: priceRaw,
        marketSource: marketSource || undefined,
        affiliateUrl,
        imageUrl,
        verificationNote,
        verificationImageUrl,
        comment,
        personallyTried,
        onSale,
        confirmVerified,
      },
    };
  }

  return {
    data: {
      name,
      category,
      householdSubType,
      price,
      marketSource,
      affiliateUrl,
      imageUrl,
      verified: true,
      personallyTried,
      onSale,
      verificationNote,
      verificationImageUrl,
      comment,
    },
  };
}

function generateId(category: string): string {
  return `${category}-${Math.random().toString(36).slice(2, 8)}`;
}

function revalidateProductPaths(product: Pick<Product, "id" | "category">) {
  revalidatePath("/");
  revalidatePath(`/category/${product.category}`);
  revalidatePath(`/products/${product.id}`);
  revalidatePath("/search");
  revalidatePath("/admin");
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseForm(formData);
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors, values: parsed.values };
  }

  const existingIds = new Set((await getEffectiveProducts()).map((p) => p.id));
  let id = generateId(parsed.data.category);
  while (existingIds.has(id)) id = generateId(parsed.data.category);

  const product: Product = {
    ...parsed.data,
    id,
    createdAt: new Date().toISOString(),
  };

  const store = await readStore();
  store.created.push(product);
  await writeStore(store);

  revalidateProductPaths(product);
  redirect("/admin");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const parsed = parseForm(formData);
  if ("fieldErrors" in parsed) {
    return { fieldErrors: parsed.fieldErrors, values: parsed.values };
  }

  const all = await getEffectiveProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return { error: "상품을 찾을 수 없어요." };

  const product: Product = {
    ...parsed.data,
    id,
    createdAt: existing.createdAt,
  };

  const store = await readStore();
  const createdIdx = store.created.findIndex((p) => p.id === id);
  if (createdIdx >= 0) {
    store.created[createdIdx] = product;
  } else {
    store.overrides[id] = product;
  }
  await writeStore(store);

  revalidateProductPaths(product);
  redirect("/admin");
}

export async function deleteProduct(
  id: string,
  _formData: FormData
): Promise<void> {
  const store = await readStore();
  store.created = store.created.filter((p) => p.id !== id);
  delete store.overrides[id];
  if (PRODUCTS.some((p) => p.id === id) && !store.deleted.includes(id)) {
    store.deleted.push(id);
  }
  await writeStore(store);

  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  revalidatePath("/search");
  revalidatePath("/admin");
  for (const c of CATEGORIES) revalidatePath(`/category/${c.slug}`);
  redirect("/admin");
}
