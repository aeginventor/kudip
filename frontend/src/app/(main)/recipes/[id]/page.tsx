'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import IngredientStatChart, {
  IngredientStatChartSkeleton,
} from '@/components/recipe/IngredientStatChart';
import CookingLogTimeline, {
  CookingLogTimelineSkeleton,
} from '@/components/recipe/CookingLogTimeline';
import { useRecipe, useRecipeStats, useUpdateRecipe, useDeleteRecipe } from '@/hooks/useRecipes';
import { Category, CookingLog, TimeSlot } from '@/types';

// ── 시간대 설정 ──
const TIME_SLOT_CONFIG: Record<
  Exclude<TimeSlot, 'NONE'>,
  { label: string; icon: string; bgColor: string; textColor: string }
> = {
  MORNING: {
    label: '아침',
    icon: '🌅',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  LUNCH: {
    label: '점심',
    icon: '☀️',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  DINNER: {
    label: '저녁',
    icon: '🌙',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
};

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'KOREAN', label: '한식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'OTHER', label: '기타' },
];

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

interface EditForm {
  name: string;
  category: Category;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: recipe } = useRecipe(id);
  const { data: stats, isLoading, isError } = useRecipeStats(id);
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<CookingLog | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>();

  function openEdit() {
    if (!stats) return;
    reset({ name: stats.recipeName, category: recipe?.category });
    setIsEditOpen(true);
  }

  function onEditSubmit(data: EditForm) {
    updateRecipe.mutate(
      { id, data },
      { onSuccess: () => setIsEditOpen(false) }
    );
  }

  function onDeleteConfirm() {
    deleteRecipe.mutate(id, {
      onSuccess: () => router.push('/recipes'),
    });
  }

  // ── 로딩 스켈레톤 ──
  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto space-y-5 animate-pulse">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="h-7 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-14 bg-gray-200 rounded-lg" />
            <div className="h-8 w-14 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-20" />
          ))}
        </div>
        <IngredientStatChartSkeleton />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-24" />
          ))}
        </div>
        <CookingLogTimelineSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-red-400 font-medium">데이터를 불러오지 못했습니다</p>
        <p className="text-xs text-gray-400 mt-1 mb-3">잠시 후 다시 시도해주세요</p>
        <Button variant="ghost" size="sm" onClick={() => router.push('/recipes')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-sm">레시피를 찾을 수 없습니다</p>
        <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push('/recipes')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const bestLogDate = stats.bestLog ? formatDate(stats.bestLog.cookedAt) : '-';

  // 시간대별 통계 Map
  const timeSlotMap = new Map(stats.timeSlotStats.map((t) => [t.timeSlot, t]));

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto space-y-5">
      {/* ── 1. 헤더 ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 mb-1.5 leading-snug">
            {stats.recipeName}
          </h1>
          {recipe && <CategoryBadge category={recipe.category} />}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={openEdit}>
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
            삭제
          </Button>
        </div>
      </div>

      {/* ── 2. 요약 카드 ── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 mb-1">총 조리 횟수</p>
          <p className="text-xl font-bold text-orange-500">{stats.totalCount}</p>
          <p className="text-[10px] text-gray-400">회</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 mb-1">평균 평점</p>
          <p className="text-xl font-bold text-orange-500">
            {stats.averageRating.toFixed(1)}
          </p>
          <div className="flex justify-center mt-0.5">
            <StarRating value={stats.averageRating} mode="display" size="sm" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
          <p className="text-[10px] text-gray-500 mb-1">최고 평점</p>
          <p className="text-xs font-semibold text-gray-700 leading-tight">{bestLogDate}</p>
          {stats.bestLog && (
            <p className="text-xs text-yellow-500 mt-0.5">★ {stats.bestLog.rating}점</p>
          )}
        </div>
      </div>

      {/* ── 3. IngredientStatChart ── */}
      <IngredientStatChart ingredientStats={stats.ingredientStats} />

      {/* ── 4. 시간대별 통계 ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">시간대별 통계</h2>
        <div className="grid grid-cols-3 gap-2">
          {(['MORNING', 'LUNCH', 'DINNER'] as const).map((slot) => {
            const cfg = TIME_SLOT_CONFIG[slot];
            const stat = timeSlotMap.get(slot);
            return (
              <div
                key={slot}
                className={[
                  'rounded-2xl p-3 shadow-sm border border-gray-100',
                  stat ? cfg.bgColor : 'bg-white',
                ].join(' ')}
              >
                <div className="text-base mb-1">{cfg.icon}</div>
                <p className={['text-xs font-medium mb-1.5', stat ? cfg.textColor : 'text-gray-400'].join(' ')}>
                  {cfg.label}
                </p>
                {stat ? (
                  <>
                    <p className="text-lg font-bold text-gray-800">{stat.count}회</p>
                    <div className="flex items-center gap-0.5 mt-1 flex-wrap">
                      <StarRating value={stat.averageRating} mode="display" size="sm" />
                      <span className="text-xs text-gray-500">{stat.averageRating.toFixed(1)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">기록 없음</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. CookingLogTimeline ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">조리 기록</h2>
        <CookingLogTimeline
          logs={stats.recentLogs}
          onCardClick={(log) => setSelectedLog(log)}
        />
      </div>

      {/* ── 수정 모달 ── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="레시피 수정">
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <Input
            label="요리 이름"
            errorMessage={errors.name?.message}
            {...register('name', { required: '요리 이름을 입력해주세요' })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <input
                    type="radio"
                    value={opt.value}
                    className="sr-only"
                    {...register('category')}
                  />
                  <CategoryBadge category={opt.value} className="cursor-pointer px-3 py-1 text-sm" />
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" fullWidth onClick={() => setIsEditOpen(false)}>
              취소
            </Button>
            <Button type="submit" fullWidth loading={updateRecipe.isPending}>
              저장
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── 삭제 확인 모달 ── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="레시피 삭제">
        <p className="text-sm text-gray-600 mb-5">
          <span className="font-semibold text-gray-900">{stats.recipeName}</span>을(를) 삭제하시겠습니까?
          <br />
          <span className="text-red-500">조리 기록 {stats.totalCount}개도 함께 삭제됩니다.</span>
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => setIsDeleteOpen(false)}>
            취소
          </Button>
          <Button variant="danger" fullWidth loading={deleteRecipe.isPending} onClick={onDeleteConfirm}>
            삭제
          </Button>
        </div>
      </Modal>

      {/* ── 조리 기록 상세 모달 (STEP 8 대체 임시 표시) ── */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={selectedLog ? formatDate(selectedLog.cookedAt) + ' 조리 기록' : ''}
      >
        {selectedLog && (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <StarRating value={selectedLog.rating} mode="display" size="sm" />
              <span>{selectedLog.rating}점</span>
            </div>
            {selectedLog.diary && (
              <p className="text-gray-600 leading-relaxed">{selectedLog.diary}</p>
            )}
            {selectedLog.processMemo && (
              <div>
                <p className="font-medium text-gray-700 mb-1">과정 메모</p>
                <p className="text-gray-500">{selectedLog.processMemo}</p>
              </div>
            )}
            {selectedLog.ingredients.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">재료</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLog.ingredients.map((ing) => (
                    <span
                      key={ing.name}
                      className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {ing.name} {ing.quantity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
