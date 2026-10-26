export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 text-xs leading-relaxed text-muted">
        <p>
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
          수수료를 제공받습니다.
        </p>
        <p className="mt-1">
          토스쇼핑 제휴 링크를 통해 구매하는 경우에도 일정액의 수수료를
          제공받을 수 있습니다.
        </p>
        <p className="mt-1">© {new Date().getFullYear()} 성분지기</p>
      </div>
    </footer>
  );
}
