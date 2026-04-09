# Kudip

> 요리 경험을 데이터로 구조화하는 개인 요리 기록 플랫폼

**🔗 배포 URL: [https://kudip.vercel.app](https://kudip.vercel.app)**

---

## 문제 정의

요리를 반복할수록 "이전에 어떻게 했더라?"라는 질문이 자연스럽게 생깁니다.  
평점을 매기고, 재료를 기록하고, 시간대별·카테고리별 통계를 쌓아가면 — 요리가 단순 반복이 아닌 **데이터 기반의 실험**이 됩니다.

Kudip은 레시피 단위로 요리 기록을 축적하고, 패턴을 분석하는 개인 요리 기록 플랫폼입니다.

---

## 서비스 개요

| 기능 | 설명 |
|------|------|
| 레시피 관리 | 카테고리별 레시피 생성·수정·삭제 |
| 요리 기록 | 레시피당 요리 기록 (평점, 재료, 시간대, 메모, 이미지) |
| 재료 추적 | 재료별 사용 빈도 및 평균 평점 집계 |
| 레시피 통계 | 최고 기록, 최근 5개 기록, 시간대별 분포 |
| 전체 대시보드 | 총 요리 횟수, 평점 추이, 상위 레시피, 캘린더 뷰 |
| 이미지 업로드 | 요리 완성 사진 AWS S3 저장 (최대 3장) |

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
- 카테고리별 도넛 차트
- 자주 만드는 요리 Top 5 수평 바 차트
- 최근 조리 기록 피드
- FAB(플로팅 버튼)으로 조리 기록 입력 모달 오픈

### 레시피 목록 `/recipes`
- 카테고리 필터 탭 (전체 / 한식 / 양식 / 일식 / 중식 / 기타)
- 반응형 카드 그리드 (모바일 1열 → 태블릿 2열 → 데스크탑 3열)
- 새 레시피 추가 모달

### 레시피 상세 `/recipes/[id]`
- 총 조리 횟수 / 평균 평점 / 최고 평점 날짜 요약 카드
- 재료별 평균 평점 수평 바 차트 — 핵심 인사이트 화면
- 시간대별(아침 / 점심 / 저녁) 조리 횟수 + 평균 평점 카드
- 조리 기록 타임라인 (날짜 내림차순, 카드 클릭 시 상세 모달)
- 레시피 수정 / 삭제

### 조리 기록 피드 `/logs`
- 필터 바: 날짜 범위 · 카테고리 · 최소 평점
- 로그 카드 리스트 (썸네일 · 재료 태그 · 일기 미리보기)
- 페이지네이션 (번호 버튼 + 이전/다음)
- 카드 클릭 시 상세 모달, 상세 모달에서 수정/삭제

---

## 핵심 설계 결정

### Recipe vs CookingLog를 분리한 이유

"김치찌개"라는 레시피와 "오늘 만든 김치찌개"는 개념이 다릅니다.  
`Recipe`는 이름·카테고리처럼 변하지 않는 정보를, `CookingLog`는 매 실험마다 달라지는 평점·재료·메모를 기록합니다.

두 개념을 분리함으로써:
- 동일 레시피를 여러 번 시도하는 기록 구조를 자연스럽게 표현할 수 있습니다
- 레시피별 평균 평점·최고 기록·재료 패턴을 명확하게 집계할 수 있습니다

### Ingredient를 별도 테이블로 분리한 이유

재료를 문자열로 저장하면 "돼지고기", "돼지고기 앞다리"가 별개 항목으로 집계됩니다.  
별도 테이블로 분리하고 `findOrCreate` 패턴을 적용하면 동일 재료는 하나의 row로 관리되어 재료별 통계가 정확해집니다.  
향후 재료 동의어 처리나 영양 정보 연계도 이 구조에서 자연스럽게 확장됩니다.

### 통계 쿼리를 DB 레이어에서 처리한 이유

재료별 사용 횟수, 평균 평점, 시간대 분포 등을 애플리케이션에서 처리하면 모든 `CookingLog`를 메모리에 로드해야 합니다.  
JPQL 집계 함수(`COUNT`, `AVG`, `GROUP BY`)를 Repository에 직접 정의하고 Projection으로 받아 필요한 데이터만 DB에서 집계해 전송합니다.  
데이터가 늘어날수록 성능 이점이 커집니다.

### 3단계 요리 기록 입력 모달

입력 부담을 낮추기 위해 단계를 분리하고, 상단 진행 바로 현재 위치를 표시합니다.

| 단계 | 내용 |
|------|------|
| 1단계 | 레시피 선택 (기존 목록 or 신규 등록) · 날짜 · 시간대 |
| 2단계 | 재료 태그 입력(자동완성) · 조리 시간 · 레시피 메모 · 과정 메모 |
| 3단계 | 별점 평가(필수) · 요리 일기 · 사진 업로드(최대 3장, 드래그앤드롭) |

---

## 기술 스택

### Frontend

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

### Backend

| 구분 | 기술 |
|------|------|
| Language | Java 21 / Spring Boot 3.4 |
| Security | Spring Security + JWT (HS256, 24h) |
| Database | PostgreSQL (개발: Supabase / 운영: AWS RDS) |
| ORM | Spring Data JPA + Hibernate |
| Storage | AWS S3 (요리 이미지) |
| Infra | AWS EC2 |
| Docs | SpringDoc OpenAPI 2 (Swagger UI) |
| Test | JUnit 5 + Mockito + H2 In-memory |

---

## ERD

**관계 요약**

```
users        1 ──< N recipes
recipes      1 ──< N cooking_logs
cooking_logs 1 ──< N cooking_log_ingredients
cooking_logs 1 ──< N cooking_log_images
ingredients  1 ──< N cooking_log_ingredients
```

---

## API 목록

### 인증 (Auth)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|:----:|
| POST | `/api/auth/signup` | 회원가입 | |
| POST | `/api/auth/login` | 로그인 → JWT 발급 | |

### 레시피 (Recipe)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|:----:|
| GET | `/api/recipes` | 내 레시피 목록 | ✓ |
| POST | `/api/recipes` | 레시피 생성 | ✓ |
| PUT | `/api/recipes/{id}` | 레시피 수정 | ✓ |
| DELETE | `/api/recipes/{id}` | 레시피 삭제 | ✓ |
| GET | `/api/recipes/{id}/stats` | 레시피 상세 통계 | ✓ |

### 요리 기록 (CookingLog)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|:----:|
| POST | `/api/logs` | 요리 기록 생성 | ✓ |
| GET | `/api/logs` | 요리 기록 목록 (필터) | ✓ |
| GET | `/api/logs/{id}` | 요리 기록 상세 | ✓ |
| PUT | `/api/logs/{id}` | 요리 기록 수정 | ✓ |
| DELETE | `/api/logs/{id}` | 요리 기록 삭제 | ✓ |
| POST | `/api/logs/{logId}/images` | 이미지 업로드 (최대 3장) | ✓ |
| DELETE | `/api/logs/{logId}/images/{imageId}` | 이미지 삭제 | ✓ |

### 대시보드 (Dashboard)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|:----:|
| GET | `/api/dashboard` | 전체 통계 대시보드 | ✓ |

---

## 배포

| 구성 요소 | 서비스 | 비고 |
|-----------|--------|------|
| Frontend | Vercel | `main` 브랜치 push 시 자동 배포 |
| Backend | AWS EC2 | Spring Boot JAR |
| Database | AWS RDS | PostgreSQL |
| Storage | AWS S3 | 요리 이미지 |

Frontend → Next.js `rewrites()`로 `/api/*` 요청을 EC2 백엔드로 프록시합니다 (클라이언트에 IP 미노출)

---

## 프로젝트 구조

```
kudip/
├── src/                         # Spring Boot 백엔드
│   └── main/java/
│       └── com/aeginventor/kudip/
│           ├── auth/
│           ├── recipe/
│           ├── cookinglog/
│           ├── dashboard/
│           └── common/
└── frontend/                    # Next.js 프론트엔드
    └── src/
        ├── app/
        │   ├── (auth)/          # 로그인 · 회원가입
        │   ├── (main)/          # 대시보드 · 레시피 · 로그
        │   └── page.tsx         # 랜딩 페이지
        ├── components/
        ├── hooks/
        ├── services/
        ├── stores/
        └── types/
```
