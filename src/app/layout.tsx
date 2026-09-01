import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "성분지기",
  description: "성분과 원재료를 확인하고 고른 상품만 모았어요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
