'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  topRecipes: { recipeName: string; count: number; averageRating: number }[];
}

const ORANGE_SHADES = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

export function TopRecipesChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div
              className="h-7 bg-gray-200 rounded"
              style={{ width: `${70 - i * 10}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const RatingLabel = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props;
  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      fill="#f97316"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      ★ {Number(value).toFixed(1)}
    </text>
  );
};

export default function TopRecipesChart({ topRecipes }: Props) {
  const top5 = topRecipes.slice(0, 5);

  const isEmpty = top5.length === 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">자주 만드는 요리 Top 5</h2>

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">아직 기록된 요리가 없습니다</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={top5.length * 52 + 20}>
          <BarChart
            data={top5}
            layout="vertical"
            margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="recipeName"
              width={80}
              tick={{ fontSize: 12, fill: '#374151' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) =>
                v.length > 7 ? v.slice(0, 7) + '…' : v
              }
            />
            <Tooltip
              cursor={{ fill: '#fff7ed' }}
              formatter={(value, name) => {
                if (name === 'count') return [`${value}회`, '조리 횟수'];
                return [`${value}`, String(name)];
              }}
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {top5.map((_, index) => (
                <Cell key={`cell-${index}`} fill={ORANGE_SHADES[index]} />
              ))}
              <LabelList
                dataKey="count"
                position="insideRight"
                style={{ fill: '#7c2d12', fontSize: 11, fontWeight: 700 }}
                formatter={(v) => `${v}회`}
              />
              <LabelList
                dataKey="averageRating"
                content={<RatingLabel />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
