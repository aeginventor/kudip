# Kudip Frontend

> 요리 경험을 데이터로 구조화하는 개인 요리 기록 플랫폼

**🔗 배포 URL: [https://kudip.vercel.app](https://kudip.vercel.app)**

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
| Form | React Hook Form |

---

## 구현 화면

### 랜딩 페이지 `/`
- 비로그인 사용자 대상 서비스 소개
- 히어로 섹션: 메인 카피 + 대시보드 UI 목업
- 기능 소개 카드 3개 (요리 기록 · 데이터 회고 · 레시피 DB)
- 로그인 상태면 `/dashboard` 자동 리다이렉트

### 대시보드 `/dashboard`
- 총 조리 횟수 / 레시피 수 / 평균 평점 / 이번 달 조리 통계 카드
- 30일 조리 활동 히트맵 캘린더
- 카테고리별 도넛 차트 (Recharts PieChart)
- 자주 만드는 요리 Top 5 수평 바 차트
- 최근 조리 기록 피드
- FAB(플로팅 버튼)으로 조리 기록 입력 모달 오픈

### 레시피 목록 `/recipes`
- 카테고리 필터 탭 (전체 / 한식 / 양식 / 일식 / 중식 / 기타)
- 반응형 카드 그리드 (모바일 1열 → 태블릿 2열 → 데스크탑 3열)
- 새 레시피 추가 모달 (이름 + 카테고리 선택)

### 레시피 상세 `/recipes/[id]`
- 총 조리 횟수 / 평균 평점 / 최고 평점 날짜 요약 카드
- **재료별 평균 평점 수평 바 차트** (Recharts) — 핵심 인사이트 화면
- 시간대별(아침 / 점심 / 저녁) 조리 횟수 + 평균 평점 카드
- 조리 기록 타임라인 (날짜 내림차순, 카드 클릭 시 상세 모달)
- 레시피 수정 / 삭제

### 조리 기록 피드 `/logs`
- 필터 바: 날짜 범위 · 카테고리 · 최소 평점
- 로그 카드 리스트 (썸네일 · 재료 태그 · 일기 미리보기)
- 페이지네이션 (번호 버튼 + 이전/다음)
- 카드 클릭 시 상세 모달, 상세 모달에서 수정/삭제

---

## 핵심 구현 사항

### 3단계 조리 기록 입력 모달
입력 부담을 낮추기 위해 단계를 분리하고, 상단 진행 바로 현재 위치를 표시합니다.

| 단계 | 내용 |
|------|------|
| 1단계 | 레시피 선택 (기존 목록 or 신규 등록) · 날짜 · 시간대 |
| 2단계 | 재료 태그 입력(자동완성) · 조리 시간 · 레시피 메모 · 과정 메모 |
| 3단계 | 별점 평가(필수) · 요리 일기 · 사진 업로드(최대 3장, 드래그앤드롭) |

- **수정 모드**: `mode="edit"` + `initialData` prop으로 기존 데이터 prefill
- **저장 흐름**: `POST /api/logs` → (이미지 있으면) `POST /api/logs/{id}/images` 순차 호출
- **이미지 실패 처리**: 로그 저장 성공 + 이미지 실패 시 부분 성공 인라인 안내

### TanStack Query 서버 상태 관리
- queryKey 계층 구조: `['dashboard']` · `['recipes']` · `['recipes', id, 'stats']` · `['logs', params]`
- Mutation 성공 시 연관 쿼리 전체 invalidate → UI 자동 동기화
- staleTime 1분으로 불필요한 중복 요청 방지

### 모바일 퍼스트 반응형 레이아웃
- **모바일**: 하단 탭 내비게이션 (`BottomNav`), 콘텐츠 영역 하단 패딩 확보
- **데스크탑(md+)**: 좌측 사이드바 + 상단 헤더
- **모달**: 모바일 바텀시트 / 데스크탑 센터 오버레이 자동 전환 (375px 기준 검증)

### API 프록시 (next.config.mjs)
`vercel.json` rewrite의 포트 파싱 이슈로 인해 Next.js `rewrites()`로 구현합니다.

```js
// next.config.mjs
async rewrites() {
  return [{ source: '/api/:path*', destination: `${process.env.API_BASE_URL}/api/:path*` }];
}
```

백엔드 EC2 주소는 서버사이드 환경변수 `API_BASE_URL`로 주입 → 클라이언트에 IP 미노출

---

## 로컬 실행 방법

```bash
# 1. 환경변수 설정
cp .env.example .env.local
# .env.local에 NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 입력

# 2. 의존성 설치 및 실행
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

---

## 배포

**프로덕션**: [https://kudip.vercel.app](https://kudip.vercel.app)
`main` 브랜치 push 시 Vercel 자동 배포

### Vercel 환경변수

| 변수명 | 설명 | 환경 |
|--------|------|------|
| `API_BASE_URL` | EC2 백엔드 주소 (예: `http://1.2.3.4:8080`) | Production · Preview |
| `NEXT_PUBLIC_API_BASE_URL` | 클라이언트 직접 호출 시 사용 (프록시 미사용 시) | 전체 |

> 현재는 Next.js rewrites 프록시 방식 사용 중 → `API_BASE_URL`만 설정하면 됩니다.

### Vercel 프로젝트 설정
- **Root Directory**: `frontend`
- **Framework Preset**: Next.js (자동 감지)

---

## 프로젝트 구조

```
frontend/src/
├── app/
│   ├── (auth)/              # 로그인 · 회원가입
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/              # 인증 필요 페이지
│   │   ├── dashboard/
│   │   ├── recipes/
│   │   │   └── [id]/
│   │   └── logs/
│   └── page.tsx             # 랜딩 페이지
├── components/
│   ├── dashboard/           # StatCard · CookingCalendar · CategoryChart · TopRecipesChart
│   ├── log/                 # LogInputModal · LogDetailModal · LogCard · CookingLogTimeline
│   ├── recipe/              # RecipeCard · IngredientStatChart · CookingLogTimeline
│   ├── layout/              # AuthGuard · Header · Sidebar · BottomNav
│   └── ui/                  # Button · Modal · Input · StarRating · CategoryBadge · TagInput
├── hooks/
│   ├── useRecipes.ts        # useRecipes · useRecipe · useRecipeStats · CRUD mutations
│   ├── useCookingLogs.ts    # useCookingLogs · useCreateCookingLog · CRUD mutations
│   ├── useDashboard.ts
│   └── useAuth.ts
├── services/
│   ├── recipe.ts
│   ├── cookingLog.ts
│   ├── dashboard.ts
│   └── auth.ts
├── stores/
│   └── authStore.ts         # Zustand + persist (accessToken · user)
├── lib/
│   ├── axios.ts             # 인증 인터셉터 · 401 → /login 리다이렉트
│   └── queryClient.ts
└── types/
    └── index.ts             # Category · TimeSlot · Recipe · CookingLog · RecipeStats · PagedData
```
