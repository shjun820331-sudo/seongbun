import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold text-ink">성분지기</span>
          <span className="text-xs text-muted">
            가족에게 먹이고 써도 되는 것만 골랐어요
          </span>
        </Link>

        <form
          action="/search"
          method="GET"
          className="flex w-full max-w-xs items-center gap-2 sm:w-auto"
        >
          <input
            type="search"
            name="q"
            placeholder="상품 이름으로 검색"
            className="w-full rounded-full border border-line bg-background px-4 py-2 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            검색
          </button>
        </form>
      </div>
    </header>
  );
}
