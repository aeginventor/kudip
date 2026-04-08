'use client';

import CategoryBadge from '@/components/ui/CategoryBadge';
import StarRating from '@/components/ui/StarRating';
import { CookingLog, TimeSlot } from '@/types';

interface LogCardProps {
  log: CookingLog;
  onClick: () => void;
}

const TIME_SLOT_LABEL: Record<TimeSlot, string> = {
  MORNING: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  NONE: '',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function LogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex gap-3">
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="h-5 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-5 w-12 bg-gray-100 rounded-full" />
            ))}
          </div>
          <div className="space-y-1">
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-3/4 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function LogCard({ log, onClick }: LogCardProps) {
  const thumbnail = log.images?.[0]?.imageUrl ?? null;
  const dateStr = formatDate(log.cookedAt);
  const slotLabel = log.timeSlot !== 'NONE' ? TIME_SLOT_LABEL[log.timeSlot] : '';
  const dateLine = [dateStr, slotLabel].filter(Boolean).join(' · ');

  const visibleIngredients = log.ingredients.slice(0, 3);
  const extraCount = log.ingredients.length - 3;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      aria-label={`${log.recipeName} 조리 기록 상세 보기`}
    >
      <div className="flex gap-3">
        {/* ── 본문 ── */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* 요리 이름 + 카테고리 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 truncate">{log.recipeName}</span>
            {log.category && <CategoryBadge category={log.category} />}
          </div>

          {/* 날짜 + 시간대 */}
          {dateLine && (
            <p className="text-xs text-gray-400">{dateLine}</p>
          )}

          {/* 별점 */}
          <StarRating value={log.rating} mode="display" size="sm" />

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
              {extraCount > 0 && (
                <span className="text-xs text-orange-500 font-medium">+{extraCount}개 더</span>
              )}
            </div>
          )}

          {/* 일기 미리보기 */}
          {log.diary && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{log.diary}</p>
          )}
        </div>

        {/* ── 썸네일 ── */}
        {thumbnail && (
          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt="조리 사진" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
