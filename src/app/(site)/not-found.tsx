import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="mt-2 text-xl font-bold text-ink">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-sm text-muted">
        주소를 다시 확인하시거나 홈으로 돌아가 주세요.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
