import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/types/product";

/**
 * 관리자 페이지에서 등록/수정/삭제한 내용을 담는 로컬 파일 기반 저장소.
 * 더미 시드 데이터(src/data/products.ts)는 건드리지 않고, 그 위에 덧씌워지는
 * created(신규 등록) / overrides(기존 상품 수정) / deleted(삭제) 세 겹으로 관리한다.
 *
 * 주의: Vercel 같은 서버리스 환경은 파일 시스템이 요청 간에 유지되지 않아
 * 배포 후에는 이 저장소가 정상 동작하지 않는다. 로컬 개발용 임시 구현이며,
 * 실제 서비스로 확장할 때는 DB로 교체해야 한다.
 */
export interface Store {
  created: Product[];
  overrides: Record<string, Product>;
  deleted: string[];
}

const EMPTY_STORE: Store = { created: [], overrides: {}, deleted: [] };
const STORE_PATH = path.join(process.cwd(), "data", "store.json");

export async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      created: parsed.created ?? [],
      overrides: parsed.overrides ?? {},
      deleted: parsed.deleted ?? [],
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...EMPTY_STORE };
    }
    throw err;
  }
}

export async function writeStore(store: Store): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2) + "\n", "utf-8");
}
