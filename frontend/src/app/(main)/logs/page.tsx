'use client';

import { useState } from 'react';
import LogCard, { LogCardSkeleton } from '@/components/log/LogCard';
import LogDetailModal from '@/components/log/LogDetailModal';
import LogInputModal from '@/components/log/LogInputModal';
import { useCookingLogs } from '@/hooks/useCookingLogs';
import { Category, CookingLog } from '@/types';
import Button from '@/components/ui/Button';

// ── 필터 상태 ──
interface FilterState {
  startDate: string;
  endDate: string;
  category: Category | '';
  minRating: number;
}

const INITIAL_FILTER: FilterState = {
  startDate: '',
  endDate: '',
  category: '',
  minRating: 0,
};

const CATEGORY_OPTIONS: { value: Category | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'KOREAN', label: '한식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'OTHER', label: '기타' },
];

const PAGE_SIZE = 10;

// ── 페이지네이션 버튼 범위 계산 ──
function getPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [];
  const delta = 2;
  const left = current - delta;
  const right = current + delta;
  let prev: number | null = null;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      if (prev !== null && i - prev > 1) pages.push('…');
      pages.push(i);
      prev = i;
    }
  }
  return pages;
}

export default function LogsPage() {
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(INITIAL_FILTER);
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<CookingLog | null>(null);
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);

  const queryParams = {
    page: page - 1, // 서버가 0-indexed인 경우 대응
    size: PAGE_SIZE,
    category: appliedFilter.category || undefined,
    minRating: appliedFilter.minRating > 0 ? appliedFilter.minRating : undefined,
    startDate: appliedFilter.startDate || undefined,
    endDate: appliedFilter.endDate || undefined,
  };

  const { data: paged, isLoading } = useCookingLogs(queryParams);

  const logs = paged?.content ?? [];
  const totalPages = paged?.totalPages ?? 1;

  function setF<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilter() {
    setPage(1);
    setAppliedFilter({ ...filter });
  }

  function resetFilter() {
    setFilter(INITIAL_FILTER);
    setAppliedFilter(INITIAL_FILTER);
    setPage(1);
  }

  const isFilterActive =
    appliedFilter.startDate !== '' ||
    appliedFilter.endDate !== '' ||
    appliedFilter.category !== '' ||
    appliedFilter.minRating > 0;

  const pageRange = getPageRange(page, totalPages);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">조리 기록</h1>
        <Button size="sm" onClick={() => setIsNewLogOpen(true)}>
          + 기록하기
        </Button>
      </div>

      {/* ── 필터 바 ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5 space-y-4">
        {/* 날짜 범위 */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">날짜 범위</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => setF('startDate', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
            <span className="text-gray-400 text-sm shrink-0">~</span>
            <input
              type="date"
              value={filter.endDate}
              min={filter.startDate}
              onChange={(e) => setF('endDate', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">카테고리</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setF('category', opt.value)}
                className={[
                  'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                  filter.category === opt.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 최소 평점 */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            최소 평점
          </p>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setF('minRating', r)}
                className={[
                  'w-9 h-9 rounded-lg text-sm font-medium border transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                  filter.minRating === r
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300',
                ].join(' ')}
                aria-label={r === 0 ? '전체' : `${r}점 이상`}
              >
                {r === 0 ? '전체' : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* 필터 적용/초기화 버튼 */}
        <div className="flex gap-2 pt-1">
          {isFilterActive && (
            <Button variant="secondary" size="sm" onClick={resetFilter}>
              초기화
            </Button>
          )}
          <Button size="sm" fullWidth={!isFilterActive} onClick={applyFilter}>
            필터 적용
          </Button>
        </div>
      </div>

      {/* ── 로그 목록 ── */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <LogCardSkeleton key={i} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-3 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-center text-gray-500">
            {isFilterActive ? '조건에 맞는 기록이 없어요' : '아직 조리 기록이 없어요'}
          </p>
          {isFilterActive && (
            <Button variant="ghost" size="sm" className="mt-3" onClick={resetFilter}>
              필터 초기화
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {logs.map((log) => (
              <LogCard
                key={log.id}
                log={log}
                onClick={() => setSelectedLog(log)}
              />
            ))}
          </div>

          {/* ── 페이지네이션 ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              {/* 이전 */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                aria-label="이전 페이지"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {pageRange.map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={[
                      'w-9 h-9 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                      page === p
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300',
                    ].join(' ')}
                    aria-label={`${p}페이지`}
                    aria-current={page === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              {/* 다음 */}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                aria-label="다음 페이지"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── 로그 상세 모달 ── */}
      <LogDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />

      {/* ── 새 기록 모달 ── */}
      <LogInputModal isOpen={isNewLogOpen} onClose={() => setIsNewLogOpen(false)} />
    </div>
  );
}
