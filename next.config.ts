import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 관리자가 실제 상품 이미지 URL을 쿠팡/토스 등 임의의 CDN에서 붙여넣을 수
    // 있어야 해서 호스트를 제한하지 않는다. (더미 데이터용 picsum.photos,
    // placehold.co 포함)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
