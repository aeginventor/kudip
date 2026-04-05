'use client';

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Category } from '@/types';

const CATEGORY_LABELS: Record<Category, string> = {
  KOREAN: '한식',
  WESTERN: '양식',
  JAPANESE: '일식',
  CHINESE: '중식',
  OTHER: '기타',
};

const CATEGORY_COLORS: Record<Category, string> = {
  KOREAN: '#f97316',
  WESTERN: '#3b82f6',
  JAPANESE: '#ef4444',
  CHINESE: '#eab308',
  OTHER: '#8b5cf6',
};

interface Props {
  categoryStats: { category: Category; count: number }[];
}

export function CategoryChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
      <div className="flex items-center justify-center h-52">
        <div className="w-40 h-40 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export default function CategoryChart({ categoryStats }: Props) {
  const data = categoryStats.map((s) => ({
    name: CATEGORY_LABELS[s.category] ?? s.category,
    value: s.count,
    color: CATEGORY_COLORS[s.category] ?? '#94a3b8',
  }));

  const isEmpty = data.length === 0 || data.every((d) => d.value === 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">카테고리별 조리 비율</h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-52 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-2 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className="text-sm">아직 데이터가 없습니다</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="70%"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}회`, name]}
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                fontSize: '13px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: '#374151', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
