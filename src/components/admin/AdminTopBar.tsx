import Link from "next/link";
import { logout } from "@/app/admin/login/actions";

export function AdminTopBar({ title }: { title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs text-muted">관리자</p>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-muted hover:text-brand">
          상품 목록
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:border-brand hover:text-brand"
          >
            로그아웃
          </button>
        </form>
      </div>
    </div>
  );
}
