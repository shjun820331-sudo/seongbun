export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs leading-relaxed text-muted">
        <p>
          본 사이트는 쿠팡파트너스 및 토스쇼핑 제휴 활동을 통해 일정액의
          수수료를 제공받습니다.
        </p>
        <p className="mt-1">© {new Date().getFullYear()} 성분지기</p>
      </div>
    </footer>
  );
}
