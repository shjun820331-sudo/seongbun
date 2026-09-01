import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인 | 성분지기",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage(
  props: PageProps<"/admin/login">
) {
  const { next } = await props.searchParams;
  const nextPath = typeof next === "string" ? next : "/admin";

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-16">
      <h1 className="text-lg font-bold text-ink">관리자 로그인</h1>
      <p className="mt-1 text-sm text-muted">운영자만 접근할 수 있어요.</p>
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <LoginForm next={nextPath} />
      </div>
    </div>
  );
}
