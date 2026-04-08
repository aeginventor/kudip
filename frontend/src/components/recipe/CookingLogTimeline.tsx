'use client';

import { useState } from 'react';
import StarRating from '@/components/ui/StarRating';
import { CookingLog, TimeSlot } from '@/types';

interface Props {
  logs: CookingLog[];
  onCardClick?: (log: CookingLog) => void;
}

const timeSlotLabel: Record<TimeSlot, string> = {
  MORNING: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  NONE: '시간대 미지정',
};

const timeSlotColor: Record<TimeSlot, string> = {
  MORNING: 'bg-yellow-100 text-yellow-700',
  LUNCH: 'bg-orange-100 text-orange-700',
  DINNER: 'bg-indigo-100 text-indigo-700',
  NONE: 'bg-gray-100 text-gray-500',
};

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface LogCardProps {
  log: CookingLog;
  onClick: () => void;
}

function LogCard({ log, onClick }: LogCardProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleIngredients = showAllTags ? log.ingredients : log.ingredients.slice(0, 3);
  const hasMoreTags = log.ingredients.length > 3;
  const thumbnail = log.images[0]?.imageUrl ?? null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      aria-label={`${formatDateTime(log.cookedAt)} 조리 기록 상세 보기`}
    >
      <div className="flex gap-3">
        {/* ── 본문 ── */}
        <div className="flex-1 min-w-0">
          {/* 날짜 + 시간대 + 평점 */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-sm font-medium text-gray-700">
              {formatDateTime(log.cookedAt)}
            </span>
            <span
              className={[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                timeSlotColor[log.timeSlot],
              ].join(' ')}
            >
              {timeSlotLabel[log.timeSlot]}
            </span>
            <StarRating value={log.rating} mode="display" size="sm" />
          </div>

          {/* 일기 첫 줄 미리보기 */}
          {log.diary && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{log.diary}</p>
          )}

          {/* 재료 태그 */}
          {log.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {visibleIngredients.map((ing) => (
                <span
                  key={ing.name}
                  className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {ing.name}
                </span>
              ))}
              {hasMoreTags && !showAllTags && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllTags(true);
                  }}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium focus-visible:outline-none"
                >
                  +{log.ingredients.length - 3}개 더보기
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── 썸네일 ── */}
        {thumbnail && (
          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt="조리 사진"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CookingLogTimelineSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-12 bg-gray-200 rounded-full" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-5 w-12 bg-gray-100 rounded-full" />
                ))}
              </div>
            </div>
            <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CookingLogTimeline({ logs, onCardClick }: Props) {
  // 날짜 내림차순 정렬
  const sorted = [...logs].sort((a, b) => {
    if (!a.cookedAt) return 1;
    if (!b.cookedAt) return -1;
    return new Date(b.cookedAt).getTime() - new Date(a.cookedAt).getTime();
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 mb-2 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-sm">아직 조리 기록이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((log) => (
        <LogCard
          key={log.id}
          log={log}
          onClick={() => onCardClick?.(log)}
        />
      ))}
    </div>
  );
}
