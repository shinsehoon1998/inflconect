# InflConnect - 인플루언서 마케팅 플랫폼

인플루언서와 광고주를 연결하는 체험단 마케팅 플랫폼입니다.

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth, Database, Storage)

## 주요 기능

### 광고주 (Advertiser)
- 6단계 캠페인 등록 (기본정보 → 홍보유형 → 체험시간 → 미션설정 → 성과목표 → 제공내역)
- 4단계 캠페인 진행 관리 (검수중 → 모집 → 체험&리뷰 → 리뷰마감)
- 인플루언서 추천 및 제안 발송
- 성과 분석 대시보드
- 포인트 충전 기능

### 인플루언서 (Influencer)
- 캠페인 탐색 및 지원
- 체험 관리
- 리뷰 작성

## 설치 및 실행

```bash
cd client
npm install
npm run dev
```

## 환경 변수

`.env.local` 파일에 다음 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
