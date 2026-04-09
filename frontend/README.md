# Kudip Frontend

> 요리 경험을 데이터로 구조화하는 개인 요리 기록 플랫폼

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Server State | TanStack Query (React Query v5) |
| Client State | Zustand |
| HTTP | Axios |
| Charts | Recharts |
| Form | React Hook Form + Zod |

---

## 주요 화면

### 대시보드
> `<!-- 스크린샷: dashboard.png -->`

- 총 조리 횟수 / 레시피 수 / 평균 평점 / 이번 달 조리 통계 카드
- 30일 조리 활동 히트맵 캘린더
- 카테고리별 도넛 차트
- 자주 만드는 요리 Top 5 바 차트
- 최근 조리 기록 피드

### Recipe 상세
> `<!-- 스크린샷: recipe-detail.png -->`

- 총 조리 횟수 / 평균 평점 / 최고 평점 날짜 요약 카드
- **재료별 평균 평점 수평 바 차트** — 핵심 인사이트 화면
- 시간대별(아침/점심/저녁) 통계 카드
- 조리 기록 타임라인

---

## 핵심 구현 사항

### 3단계 로그 입력 모달 UX
입력 부담을 낮추기 위해 조리 기록을 3단계로 분리합니다.

| 단계 | 내용 |
|------|------|
| 1단계 | 레시피 선택 / 날짜 / 시간대 |
| 2단계 | 재료 · 조리 시간 · 메모 |
| 3단계 | 평점(필수) · 일기 · 사진 업로드 |

- 수정 모드: `initialData` prop으로 기존 데이터 prefill, `PUT /api/logs/{id}` 호출
- 이미지: 로그 저장 후 `POST /api/logs/{id}/images` 별도 호출 (실패 시 부분 성공 안내)

### TanStack Query 기반 서버 상태 관리
- `queryKey` 구조: `['recipes']`, `['recipes', id, 'stats']`, `['logs', params]`
- Mutation 성공 시 관련 쿼리(`dashboard` · `recipes` · `logs`) 전체 invalidate
- staleTime 1분 설정으로 불필요한 중복 요청 방지

### 모바일 퍼스트 반응형 레이아웃
- 모바일: 하단 탭 내비게이션 (`BottomNav`)
- 데스크탑(md+): 좌측 사이드바 + 상단 헤더
- 모달: 모바일 바텀시트 / 데스크탑 센터 오버레이 자동 전환

---

## 로컬 실행 방법

### 1. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 API 서버 주소를 입력합니다:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 배포

### Vercel 자동 배포 (main 브랜치 push 시)

**1. Vercel 프로젝트 설정**

- Root Directory: `frontend`
- Framework Preset: Next.js (자동 감지)
- Build Command: `npm run build` (기본값)

**2. 환경변수 설정**

Vercel 대시보드 → 프로젝트 선택 → **Settings → Environment Variables**

| 변수명 | 값 | 적용 환경 |
|--------|-----|-----------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.your-domain.com` | Production |
| `NEXT_PUBLIC_API_BASE_URL` | `http://EC2_IP:8080` | Preview |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Development |

> Production · Preview · Development 각각 별도로 설정 가능합니다.

**3. API 프록시 vs 직접 호출**

`vercel.json`에 Rewrites 설정이 포함되어 있습니다. 두 방식의 차이는 다음과 같습니다:

**Vercel Rewrites 프록시 방식** (`vercel.json` 사용)
```
클라이언트 → Vercel Edge → EC2 백엔드
```
- EC2 IP가 클라이언트에 노출되지 않음
- 백엔드 CORS 설정 불필요
- 백엔드 주소 변경 시 환경변수 하나만 수정
- Vercel Edge 프록시 홉으로 미세 지연 추가

**직접 호출 방식** (`vercel.json` 삭제 + 환경변수로 EC2 주소 직접 지정)
```
클라이언트 → EC2 백엔드 (직접)
```
- 프록시 홉 없이 낮은 지연
- Vercel Function 실행 횟수 절약
- EC2에서 CORS 헤더 설정 필수 (`Access-Control-Allow-Origin`)
- EC2 IP가 브라우저 네트워크 탭에 노출됨

> 권장: 프로덕션은 Rewrites 프록시, 로컬 개발은 직접 호출

**4. `vercel.json` EC2 주소 교체**

배포 전 `vercel.json`의 `{EC2_IP}` 플레이스홀더를 실제 EC2 퍼블릭 IP 또는 도메인으로 교체하세요:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://1.2.3.4:8080/api/:path*"
    }
  ]
}
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인 · 회원가입
│   ├── (main)/          # 인증 필요 페이지 (대시보드 · 레시피 · 로그)
│   └── page.tsx         # 랜딩 페이지
├── components/
│   ├── dashboard/       # 대시보드 전용 컴포넌트
│   ├── log/             # 로그 입력 · 상세 · 카드
│   ├── recipe/          # 레시피 카드 · 차트 · 타임라인
│   ├── layout/          # 공통 레이아웃 컴포넌트
│   └── ui/              # 공통 UI (Button · Modal · Input · StarRating 등)
├── hooks/               # TanStack Query 훅
├── services/            # API 호출 함수
├── stores/              # Zustand 상태 (인증)
├── lib/                 # axios 인스턴스 · queryClient 설정
└── types/               # 공통 TypeScript 타입
```
