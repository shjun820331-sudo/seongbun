export type Category =
  | "frozen-instant"
  | "kimchi-banchan"
  | "sauce-jang"
  | "snack"
  | "baby-food"
  | "household";

export type MarketSource = "coupang" | "toss";

/**
 * 생활용품 카테고리 내부에서만 쓰이는 세부 구분.
 * 검증 기준 표시가 하위 유형별로 달라서 필요함 (생리대/물티슈 vs 세제/비누).
 */
export type HouseholdSubType = "hygiene" | "cleaning";

export interface Product {
  id: string;
  name: string;
  category: Category;
  householdSubType?: HouseholdSubType;
  price: number;
  marketSource: MarketSource;
  affiliateUrl: string;
  imageUrl: string;
  /** 성분 확인 뱃지. 등록되는 모든 상품은 항상 true여야 함. */
  verified: true;
  /** 직접 써봄 뱃지. 일부 상품에만 선택적으로 표시. */
  personallyTried: boolean;
  /** 지금 할인중 뱃지. verified === true인 상품에만 true 가능. */
  onSale: boolean;
  verificationNote: string;
  verificationImageUrl: string;
  comment: string;
  createdAt: string;
}

export interface CategoryMeta {
  slug: Category;
  label: string;
  shortLabel: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "frozen-instant",
    label: "냉동즉석식품",
    shortLabel: "냉동·즉석",
    description: "바쁠 때 꺼내 먹어도 마음이 편한 냉동·즉석식품",
  },
  {
    slug: "kimchi-banchan",
    label: "김치·반찬",
    shortLabel: "김치·반찬",
    description: "매일 밥상에 올라가는 김치와 반찬",
  },
  {
    slug: "sauce-jang",
    label: "장·소스",
    shortLabel: "장·소스",
    description: "국간장, 된장, 소스류처럼 요리의 기본이 되는 것들",
  },
  {
    slug: "snack",
    label: "간식",
    shortLabel: "간식",
    description: "아이도 어른도 부담 없이 먹을 수 있는 간식",
  },
  {
    slug: "baby-food",
    label: "이유식·유아식",
    shortLabel: "이유식·유아식",
    description: "원재료 하나하나가 신경 쓰이는 이유식·유아식",
  },
  {
    slug: "household",
    label: "생활용품",
    shortLabel: "생활용품",
    description: "생리대, 비누, 물티슈, 세제, 손수건 등 몸에 닿는 생활용품",
  },
];

export function getCategoryMeta(category: Category): CategoryMeta {
  const meta = CATEGORIES.find((c) => c.slug === category);
  if (!meta) throw new Error(`Unknown category: ${category}`);
  return meta;
}

/**
 * 카테고리(및 생활용품 하위 유형)별로 상품 상세에 노출할 검증 기준 목록.
 */
export function getVerificationCriteria(
  category: Category,
  householdSubType?: HouseholdSubType
): string[] {
  if (category === "household") {
    if (householdSubType === "cleaning") {
      return ["환경마크 인증 여부", "주요 성분 표시"];
    }
    // 기본값(hygiene): 생리대, 물티슈, 손수건 등
    return ["식약처 허가·인증 여부", "유해물질 시험성적서 유무", "KC 인증 여부"];
  }
  // 식품류 전체 공통 기준
  return ["원재료표 확인", "국산·무첨가 여부", "알레르기 표시 확인"];
}
