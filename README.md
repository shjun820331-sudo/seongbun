# 성분지기 (가칭)

"가족에게 먹이고 써도 되는 것만 골랐어요" 컨셉의 제휴 마케팅 큐레이션 웹앱.
쿠팡파트너스 / 토스쇼핑 제휴 링크를 사용하며, 상품은 성분·원재료·인증 기준으로
검증 후 등록한다. 뱃지 시스템(✅ 성분 확인 / 🙋 직접 써봄 / 🔥 지금 할인중)이
핵심 원칙이며, "직접 다 먹어봤어요" 같은 과장된 문구는 쓰지 않는다.

다른 컴퓨터에서 이어서 작업할 때 이 문서만 보고 바로 세팅할 수 있도록 정리했다.

## 기술 스택

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- 배포 대상: Vercel (아직 미배포 — 아래 "진행 상황" 참고)

## 로컬 개발 환경 세팅

### 1. Node.js 설치

`package.json`의 `engines.node`는 `>=20`. nvm으로 설치하는 걸 권장한다.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 터미널을 새로 열거나 아래 실행
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
```

### 2. 클론 + 설치

```bash
git clone https://github.com/shjun820331-sudo/seongbun.git
cd seongbun
npm install
```

### 3. 환경변수 설정

`.env.example`을 복사해서 `.env.local`을 만들고 값을 채운다. **실제 값은 보안상
git에 올리지 않았으므로 별도로 보관해둔 값을 넣거나 새로 정한다.**

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|---|---|
| `ADMIN_PASSWORD` | 관리자 페이지(`/admin`) 로그인 비밀번호 |
| `ADMIN_SESSION_SECRET` | 로그인 세션 쿠키 서명용 임의의 긴 문자열 (아무 값이나, 노출 금지) |

### 4. 실행

```bash
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin/login

### 자주 쓰는 명령

```bash
npm run build     # 프로덕션 빌드 (정적 생성 여부 등 라우트별 렌더링 방식이 출력됨)
npx tsc --noEmit  # 타입 체크
npx eslint .       # 린트
```

## 프로젝트 구조

```
src/app/(site)/     공개 페이지 — 홈, 카테고리 상세, 상품 상세, 검색
                     (route group이라 URL에는 안 나타남)
src/app/admin/       관리자 페이지 — 로그인, 상품 등록/수정/삭제
src/components/      공개 페이지용 UI 컴포넌트
src/components/admin/ 관리자 페이지용 UI 컴포넌트 (폼, 로그인폼, 삭제버튼 등)
src/data/products.ts 더미 시드 상품 데이터 (26개, 카테고리별 4~6개)
src/types/product.ts 상품/카테고리 타입, 카테고리별 검증 기준 정의
src/lib/products.ts  상품 조회/정렬/검색 데이터 레이어 (시드 + 관리자 스토어 병합)
src/lib/store.ts     관리자 CRUD용 로컬 JSON 파일 스토어 (data/store.json)
src/lib/auth.ts       관리자 인증 토큰 생성 (비밀번호 자체는 저장하지 않음)
src/proxy.ts          /admin/* 라우트 보호 (Next 16부터 middleware가 proxy로 개칭됨)
```

## 알아둘 점 / 한계

- **관리자 CRUD 저장 방식**: 등록/수정/삭제한 내용은 로컬 파일(`data/store.json`,
  git에 안 올라감)에 저장된다. **Vercel 같은 서버리스 환경은 파일시스템이 요청
  간 유지되지 않아 배포 후에는 관리자 페이지에서 저장이 안 된다.** 실서비스로
  가려면 DB(예: Postgres, Supabase 등)로 교체 필요 — 원래 계획에도 "이후 확장"
  항목으로 명시돼 있던 부분.
- **이미지**: 파일 업로드가 아니라 이미지 URL을 붙여넣는 방식. 그래서
  `next.config.ts`의 `images.remotePatterns`가 모든 https 호스트를 허용하도록
  열려 있음.
- **더미 데이터**: 상품 26개, 쿠팡/토스 제휴 링크는 전부 자리표시자(`PLACEHOLDER`
  포함된 가짜 URL). 실제 서비스 전에 진짜 상품/제휴 링크로 교체해야 함.
- **인증**: 별도 로그인 시스템이 아니라 비밀번호 1개 + 서명된 쿠키 방식 (단일
  운영자 기준으로 단순화한 것).

## 진행 상황

원래 계획한 8단계 중 1~7단계 완료:

1. ✅ Next.js 프로젝트 초기 세팅 + Tailwind 설정
2. ✅ 상품 데이터 스키마 및 더미 데이터
3. ✅ 홈 화면 (핫딜 섹션 + 카테고리 그리드 + 상품 리스트)
4. ✅ 카테고리 상세 페이지
5. ✅ 상품 상세 페이지 (뱃지 시스템 포함)
6. ✅ 검색/정렬 기능
7. ✅ 관리자 페이지 (인증 + 상품 등록/수정/삭제)
8. ⬜ SEO/OG 메타 설정 및 Vercel 배포 — **아직 미착수.** 사이트 문구·디자인을
   먼저 검토하고 나서 진행하기로 보류 중.

## 다음에 할 일

- 사이트 직접 둘러보고 문구 / 카테고리 구성 / 색상 등 수정하고 싶은 부분 정리
- 8단계 진행: 메타 디스크립션, OG 이미지, 파비콘 설정 → Vercel 배포
  (배포 시 Vercel 프로젝트 환경변수에 `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
  등록 필요)
- (장기) 관리자 데이터 영구 저장을 위한 DB 연동, 실제 상품/제휴 링크로 교체
