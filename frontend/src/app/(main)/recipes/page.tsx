'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import RecipeCard, { RecipeCardSkeleton } from '@/components/recipe/RecipeCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRecipes, useCreateRecipe } from '@/hooks/useRecipes';
import { Category } from '@/types';

// ── 카테고리 필터 탭 설정 ──
type FilterTab = 'ALL' | Category;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'KOREAN', label: '한식' },
  { key: 'WESTERN', label: '양식' },
  { key: 'JAPANESE', label: '일식' },
  { key: 'CHINESE', label: '중식' },
  { key: 'OTHER', label: '기타' },
];

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'KOREAN', label: '한식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'OTHER', label: '기타' },
];

interface CreateForm {
  name: string;
  category: Category;
}

export default function RecipesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: recipes, isLoading, isError } = useRecipes();
  const createRecipe = useCreateRecipe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({ defaultValues: { category: 'KOREAN' } });

  const filtered =
    activeTab === 'ALL' ? (recipes ?? []) : (recipes ?? []).filter((r) => r.category === activeTab);

  function handleCloseModal() {
    setIsModalOpen(false);
    reset();
  }

  function onSubmit(data: CreateForm) {
    createRecipe.mutate(data, {
      onSuccess: () => handleCloseModal(),
    });
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">레시피</h1>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          + 새 레시피 추가
        </Button>
      </div>

      {/* ── 카테고리 필터 탭 ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
              activeTab === tab.key
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 카드 그리드 ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-400 font-medium">레시피를 불러오지 못했습니다</p>
          <p className="text-xs text-gray-400 mt-1">잠시 후 다시 시도해주세요</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-3 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-center">
            {activeTab === 'ALL'
              ? '아직 레시피가 없어요.\n첫 레시피를 추가해보세요'
              : '이 카테고리에 레시피가 없습니다'}
          </p>
          {activeTab === 'ALL' && (
            <Button
              size="sm"
              variant="secondary"
              className="mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              레시피 추가하기
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* ── 새 레시피 추가 모달 ── */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="새 레시피 추가">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="요리 이름"
            placeholder="예: 된장찌개"
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
                    {...register('category', { required: true })}
                  />
                  <CategoryBadge
                    category={opt.value}
                    className="cursor-pointer px-3 py-1 text-sm"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleCloseModal}
            >
              취소
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={createRecipe.isPending}
            >
              추가
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
