'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDashboard } from '@/hooks/useDashboard';
import StatCard, { StatCardSkeleton } from '@/components/dashboard/StatCard';
import CookingCalendar, { CookingCalendarSkeleton } from '@/components/dashboard/CookingCalendar';
import CategoryChart, { CategoryChartSkeleton } from '@/components/dashboard/CategoryChart';
import TopRecipesChart, { TopRecipesChartSkeleton } from '@/components/dashboard/TopRecipesChart';
import StarRating from '@/components/ui/StarRating';

// ──────────────────────────────────────────────
// SVG Icons
// ──────────────────────────────────────────────
function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ──────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────
export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCount =
    data?.calendarData
      .filter((d) => d.date.startsWith(currentYearMonth))
      .reduce((sum, d) => sum + d.count, 0) ?? 0;

  const isEmpty = !isLoading && data?.totalCookCount === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── 1. StatCards ── */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="총 조리 횟수"
              value={`${data?.totalCookCount ?? 0}회`}
              icon={<FlameIcon />}
              iconBg="bg-orange-50"
            />
            <StatCard
              label="보유 레시피"
              value={`${data?.totalRecipeCount ?? 0}개`}
              icon={<BookIcon />}
              iconBg="bg-blue-50"
            />
            <StatCard
              label="평균 평점"
              value={data?.averageRating ? data.averageRating.toFixed(1) : '-'}
              icon={<StarIcon />}
              iconBg="bg-yellow-50"
            />
            <StatCard
              label="이번 달 조리"
              value={`${thisMonthCount}회`}
              icon={<CalendarIcon />}
              iconBg="bg-green-50"
            />
          </>
        )}
      </div>

      {/* ── 2. Calendar ── */}
      {isLoading ? (
        <CookingCalendarSkeleton />
      ) : (
        <CookingCalendar calendarData={data?.calendarData ?? []} />
      )}

      {/* ── 3. Charts ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryChartSkeleton />
          <TopRecipesChartSkeleton />
        </div>
      ) : isEmpty ? null : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryChart categoryStats={data?.categoryStats ?? []} />
          <TopRecipesChart topRecipes={data?.topRecipes ?? []} />
        </div>
      )}

      {/* ── 4. Recent Logs ── */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse space-y-3">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        /* ── Empty State ── */
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-700">첫 요리를 기록해보세요!</p>
            <p className="mt-1 text-sm text-gray-400">오른쪽 아래 버튼으로 조리 기록을 시작하세요.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-gray-700">최근 조리 기록</h2>
            <Link
              href="/logs"
              className="text-xs text-orange-500 font-medium hover:underline"
            >
              전체 보기 →
            </Link>
          </div>

          <ul className="divide-y divide-gray-50">
            {(data?.recentLogs ?? []).slice(0, 7).map((log) => {
              const thumb = log.images?.[0]?.imageUrl;
              return (
                <li
                  key={log.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl bg-orange-50 shrink-0 overflow-hidden flex items-center justify-center">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={log.recipeName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{log.recipeName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(log.cookedAt)}</p>
                  </div>

                  {/* Rating */}
                  <StarRating value={log.rating} mode="display" size="sm" />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── FAB ── */}
      <button
        onClick={() => {
          /* STEP 7: LogInputModal 오픈 */
        }}
        className={[
          'fixed bottom-20 right-4 md:bottom-6 md:right-6',
          'flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg',
          'bg-orange-500 text-white font-semibold text-sm',
          'hover:bg-orange-600 active:bg-orange-700 active:scale-95',
          'transition-all duration-150 z-40',
          isEmpty ? 'animate-bounce' : '',
        ].join(' ')}
        aria-label="조리 기록 추가"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        기록하기
      </button>
    </div>
  );
}
