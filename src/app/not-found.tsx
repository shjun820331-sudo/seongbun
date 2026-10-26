import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import SiteNotFound from "./(site)/not-found";

/**
 * 어떤 라우트에도 매칭되지 않는 주소용 404.
 * (site) 그룹의 not-found는 그룹 안에서 notFound()를 호출했을 때만 쓰이므로,
 * 여기서 같은 화면을 헤더/푸터와 함께 감싸서 보여준다.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <SiteNotFound />
      </main>
      <SiteFooter />
    </>
  );
}
