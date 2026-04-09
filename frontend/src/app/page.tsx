'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

// ── 로그인 사용자 리다이렉트 ──
function useAuthRedirect() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    if (accessToken) router.replace('/dashboard');
  }, [accessToken, router]);
  return accessToken;
}

// ── 대시보드 UI 목업 ──
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
      {/* 배경 글로우 */}
      <div className="absolute -inset-4 bg-orange-400/10 rounded-3xl blur-2xl" aria-hidden="true" />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 space-y-3 text-xs">
        {/* 헤더 바 */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-4 bg-gray-100 rounded-md" />
        </div>

        {/* Stat 카드 4개 */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '총 조리', value: '42회', color: 'bg-orange-50', dot: 'bg-orange-400' },
            { label: '레시피', value: '8개', color: 'bg-blue-50', dot: 'bg-blue-400' },
            { label: '평균 평점', value: '4.2', color: 'bg-yellow-50', dot: 'bg-yellow-400' },
            { label: '이번 달', value: '7회', color: 'bg-green-50', dot: 'bg-green-400' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-2 text-center`}>
              <div className={`w-4 h-4 ${s.dot} rounded-full mx-auto mb-1 opacity-70`} />
              <p className="font-bold text-gray-800 text-sm leading-none">{s.value}</p>
              <p className="text-gray-400 text-[9px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 캘린더 히트맵 */}
        <div className="bg-white rounded-xl border border-gray-100 p-2.5">
          <p className="text-gray-500 text-[9px] font-semibold mb-1.5">최근 조리 활동</p>
          <div className="grid grid-cols-[repeat(30,1fr)] gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const intensity = [0, 0, 1, 0, 2, 1, 0, 0, 1, 3, 0, 1, 0, 2, 1, 0, 0, 1, 0, 3, 2, 0, 1, 0, 0, 2, 1, 0, 3, 1][i];
              const colors = ['bg-gray-100', 'bg-orange-200', 'bg-orange-400', 'bg-orange-600'];
              return (
                <div key={i} className={`aspect-square rounded-sm ${colors[intensity]}`} />
              );
            })}
          </div>
        </div>

        {/* 바 차트 */}
        <div className="bg-white rounded-xl border border-gray-100 p-2.5">
          <p className="text-gray-500 text-[9px] font-semibold mb-2">자주 만드는 요리</p>
          <div className="space-y-1.5">
            {[
              { name: '된장찌개', pct: 90, rating: '4.8' },
              { name: '제육볶음', pct: 72, rating: '4.5' },
              { name: '파스타', pct: 55, rating: '4.1' },
              { name: '김치볶음밥', pct: 38, rating: '3.9' },
            ].map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="text-gray-500 w-14 truncate text-[9px]">{r.name}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="text-orange-500 text-[9px] font-semibold w-5 text-right">★{r.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 재료 평점 바 차트 */}
        <div className="bg-white rounded-xl border border-gray-100 p-2.5">
          <p className="text-gray-500 text-[9px] font-semibold mb-2">재료별 성공률</p>
          <div className="space-y-1.5">
            {[
              { name: '국내산 돼지고기', pct: 85, color: 'bg-orange-500' },
              { name: '수입산 돼지고기', pct: 62, color: 'bg-orange-300' },
              { name: '청양고추', pct: 48, color: 'bg-orange-200' },
            ].map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="text-gray-500 w-20 truncate text-[9px]">{r.name}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 기능 카드 데이터 ──
const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: '요리 경험 기록',
    desc: '성공이든 실패든 내 경험치로 쌓입니다. 재료, 조리 과정, 느낀 점을 모두 남겨보세요.',
    color: 'bg-orange-50 text-orange-500',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: '데이터로 회고',
    desc: '재료별 성공률, 시간대별 결과를 한눈에 확인하세요. 숫자가 말해주는 내 요리 패턴.',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: '나만의 레시피 DB',
    desc: '이전 시도를 참고해서 더 맛있게 개선하세요. 반복하면 할수록 완성도가 높아집니다.',
    color: 'bg-green-50 text-green-500',
  },
];

// ── 페이지 ──
export default function LandingPage() {
  const accessToken = useAuthRedirect();

  // 로그인 상태면 리다이렉트 중이므로 빈 화면
  if (accessToken) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ──────────── 헤더 ──────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <span className="text-lg font-bold text-gray-900">Kudip</span>
          </div>

          {/* 네비게이션 */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ──────────── 히어로 섹션 ──────────── */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 좌측: 카피 + CTA */}
            <div>
              {/* 배지 */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full text-xs font-semibold text-orange-600 mb-6">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                요리는 실험이다
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
                요리할수록
                <br />
                <span className="text-orange-500">쌓이는</span> 나만의
                <br />
                레시피 데이터
              </h1>

              <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                매번 달라지는 요리 경험을 기록하고,
                <br className="hidden sm:block" />
                무엇이 맛있었는지 데이터로 확인하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl transition-colors shadow-lg shadow-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  무료로 시작하기
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  로그인
                </Link>
              </div>

              {/* 소셜 프루프 */}
              <p className="text-xs text-gray-400 mt-5">
                무료 · 카드 등록 불필요 · 언제든 탈퇴 가능
              </p>
            </div>

            {/* 우측: 대시보드 목업 */}
            <div className="lg:pl-4">
              <DashboardMockup />
            </div>
          </div>
        </section>

        {/* ──────────── 기능 소개 ──────────── */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                요리 기록이 자산이 되는 방법
              </h2>
              <p className="text-gray-500 text-base">
                기록이 쌓일수록 요리 실력도, 데이터도 함께 성장합니다
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────── 하단 CTA ──────────── */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 아이콘 */}
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              지금 바로 요리를 기록해보세요
            </h2>
            <p className="text-gray-500 text-base mb-8">
              첫 번째 기록부터 데이터가 쌓이기 시작합니다
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl transition-colors shadow-lg shadow-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              시작하기
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ──────────── 푸터 ──────────── */}
      <footer className="border-t border-gray-100 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            <span className="font-medium text-gray-500">Kudip</span>
          </div>
          <p>© 2026 Kudip. 요리는 실험이다.</p>
        </div>
      </footer>
    </div>
  );
}
