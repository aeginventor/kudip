'use client';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

interface Props {
  calendarData: { date: string; count: number }[];
}

function getCellColor(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-orange-200';
  return 'bg-orange-500';
}

export function CookingCalendarSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="w-7 h-7 rounded-sm bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export default function CookingCalendar({ calendarData }: Props) {
  const countMap = new Map(calendarData.map(({ date, count }) => [date, count]));

  // Generate last 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 29 + i);
    return d;
  });

  // Monday-based offset: (Sun=0 → 6, Mon=1 → 0, ..., Sat=6 → 5)
  const firstDayOffset = (days[0].getDay() + 6) % 7;

  // Pad with nulls before and after to fill complete weeks
  const paddedDays: (Date | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...days,
  ];
  // Fill remaining to complete the last row
  const remainder = paddedDays.length % 7;
  if (remainder !== 0) {
    paddedDays.push(...Array(7 - remainder).fill(null));
  }

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const formatLabel = (d: Date) =>
    `${d.getMonth() + 1}월 ${d.getDate()}일`;

  // Compute total count for the period
  const totalCount = calendarData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">최근 30일 조리 활동</h2>
        <span className="text-xs text-gray-400">{totalCount}회 조리</span>
      </div>

      {/* Day of week header */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] text-gray-400 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {paddedDays.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="w-full aspect-square" />;
          }
          const dateStr = formatDate(day);
          const count = countMap.get(dateStr) ?? 0;
          const isToday = dateStr === formatDate(new Date());

          return (
            <div key={dateStr} className="group relative flex items-center justify-center">
              <div
                className={[
                  'w-full aspect-square rounded-sm transition-opacity',
                  getCellColor(count),
                  isToday ? 'ring-2 ring-orange-400 ring-offset-1' : '',
                ].join(' ')}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-lg">
                <span className="font-medium">{formatLabel(day)}</span>
                <span className="text-gray-300 ml-1">
                  {count > 0 ? `${count}회 조리` : '기록 없음'}
                </span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 justify-end">
        <span className="text-[10px] text-gray-400">적음</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-gray-100" />
          <div className="w-4 h-4 rounded-sm bg-orange-200" />
          <div className="w-4 h-4 rounded-sm bg-orange-500" />
        </div>
        <span className="text-[10px] text-gray-400">많음</span>
      </div>
    </div>
  );
}
