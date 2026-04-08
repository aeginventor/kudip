'use client';

import { useRouter } from 'next/navigation';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StarRating from '@/components/ui/StarRating';
import { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '기록 없음';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 w-28 bg-gray-200 rounded" />
        <div className="h-5 w-12 bg-gray-200 rounded-full" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
  );
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/recipes/${recipe.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/recipes/${recipe.id}`)}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      aria-label={`${recipe.name} 레시피 상세 보기`}
    >
      {/* ── 이름 + 카테고리 ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-1">
          {recipe.name}
        </h3>
        <CategoryBadge category={recipe.category} />
      </div>

      {/* ── 조리 횟수 + 평균 평점 ── */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{recipe.totalCookCount}</span>회 조리
        </span>
        <div className="flex items-center gap-1">
          <StarRating value={recipe.averageRating} mode="display" size="sm" />
          <span className="text-xs text-gray-500">{recipe.averageRating.toFixed(1)}</span>
        </div>
      </div>

      {/* ── 마지막 조리 날짜 ── */}
      <p className="text-xs text-gray-400">
        마지막 조리: {formatDate(recipe.lastCookedAt)}
      </p>
    </div>
  );
}
