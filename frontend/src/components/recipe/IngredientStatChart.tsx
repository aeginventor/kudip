'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { RecipeStats } from '@/types';

interface Props {
  ingredientStats: RecipeStats['ingredientStats'];
}

function barColor(rating: number): string {
  if (rating >= 4.5) return '#f97316';
  if (rating >= 3.5) return '#fb923c';
  if (rating >= 2.5) return '#fdba74';
  return '#fed7aa';
}

export function IngredientStatChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-7 bg-gray-200 rounded" style={{ width: `${60 - i * 10}%` }} />
            <div className="h-4 w-36 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IngredientStatChart({ ingredientStats }: Props) {
  // 평점 높은 순 정렬
  const sorted = [...ingredientStats].sort((a, b) => b.averageRating - a.averageRating);

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">재료별 평균 평점</h2>
        <div className="flex flex-col items-center justify-center h-36 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9 mb-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">재료 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  const chartHeight = sorted.length * 52 + 20;

  // 바 오른쪽 레이블 커스텀 컴포넌트 (sorted 클로저)
  const RightLabel = (props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
  }) => {
    const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props;
    const item = sorted[index];
    if (!item) return null;
    return (
      <text
        x={x + width + 10}
        y={y + height / 2}
        fill="#6b7280"
        dominantBaseline="central"
        fontSize={11}
      >
        {item.ingredientName} · {item.useCount}회 · 평균 {item.averageRating.toFixed(1)}점
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">재료별 평균 평점</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 200, left: 0, bottom: 0 }}
          barSize={26}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            type="number"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="ingredientName"
            width={72}
            tick={{ fontSize: 12, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: string) => (v.length > 6 ? v.slice(0, 6) + '…' : v)}
          />
          <Tooltip
            cursor={{ fill: '#fff7ed' }}
            formatter={(value) => [`${Number(value).toFixed(1)}점`, '평균 평점']}
            contentStyle={{
              borderRadius: '10px',
              border: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              fontSize: '13px',
            }}
          />
          <Bar dataKey="averageRating" radius={[0, 6, 6, 0]}>
            {sorted.map((item, index) => (
              <Cell key={`cell-${index}`} fill={barColor(item.averageRating)} />
            ))}
            <LabelList content={<RightLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
