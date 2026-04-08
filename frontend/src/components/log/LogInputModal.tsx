'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StarRating from '@/components/ui/StarRating';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TagInput from '@/components/ui/TagInput';
import { useRecipes, useRecipeStats } from '@/hooks/useRecipes';
import { useCreateCookingLog } from '@/hooks/useCookingLogs';
import { uploadImages } from '@/services/cookingLog';
import { Category, TimeSlot } from '@/types';

// ── 타입 ──
interface FormState {
  // Step 1
  recipeId: number | 'new' | '';
  newRecipeName: string;
  newRecipeCategory: Category;
  dateMode: 'today' | 'yesterday' | 'custom';
  customDate: string;
  timeSlot: TimeSlot | '';
  // Step 2
  ingredients: { name: string; quantity: string }[];
  cookTimeMinutes: string;
  recipeMemo: string;
  processMemo: string;
  // Step 3
  rating: number;
  diary: string;
}

const INITIAL_FORM: FormState = {
  recipeId: '',
  newRecipeName: '',
  newRecipeCategory: 'KOREAN',
  dateMode: 'today',
  customDate: '',
  timeSlot: '',
  ingredients: [],
  cookTimeMinutes: '',
  recipeMemo: '',
  processMemo: '',
  rating: 0,
  diary: '',
};

const STEP_TITLES = ['무엇을 만들었나요?', '어떻게 만들었나요?', '어땠나요?'];

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'KOREAN', label: '한식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'OTHER', label: '기타' },
];

const TIME_SLOT_OPTIONS: { value: TimeSlot | ''; label: string }[] = [
  { value: 'MORNING', label: '아침' },
  { value: 'LUNCH', label: '점심' },
  { value: 'DINNER', label: '저녁' },
  { value: '', label: '생략' },
];

// ── 날짜 헬퍼 ──
function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ── 공통 섹션 레이블 ──
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-sm font-medium text-gray-700 mb-2">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </p>
  );
}

// ── 토글 버튼 그룹 ──
function OptionGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 border',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
            value === opt.value
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Props ──
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogInputModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: recipes = [] } = useRecipes();
  const createLog = useCreateCookingLog();

  // 선택된 기존 레시피의 재료 이름을 자동완성 후보로 사용
  const selectedRecipeId =
    form.recipeId !== 'new' && form.recipeId !== '' ? Number(form.recipeId) : 0;
  const { data: selectedRecipeStats } = useRecipeStats(selectedRecipeId);
  const ingredientSuggestions = (selectedRecipeStats?.ingredientStats ?? []).map(
    (s) => s.ingredientName
  );

  // ESC 닫기 + body 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  }

  function handleClose() {
    previews.forEach(URL.revokeObjectURL);
    setForm(INITIAL_FORM);
    setStep(1);
    setImages([]);
    setPreviews([]);
    setErrors({});
    setSaveError('');
    onClose();
  }

  // ── 이미지 추가 ──
  function addImages(files: File[]) {
    const remaining = 3 - images.length;
    const toAdd = files.filter((f) => f.type.startsWith('image/')).slice(0, remaining);
    if (!toAdd.length) return;
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ── 유효성 검사 ──
  function validate(targetStep: number): boolean {
    const newErrors: Record<string, string> = {};
    if (targetStep === 1) {
      if (!form.recipeId && form.recipeId !== 0) newErrors.recipeId = '레시피를 선택해주세요';
      if (form.recipeId === 'new' && !form.newRecipeName.trim()) {
        newErrors.newRecipeName = '레시피 이름을 입력해주세요';
      }
    }
    if (targetStep === 3) {
      if (!form.rating) newErrors.rating = '맛 평가를 선택해주세요';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate(step)) return;
    setStep((s) => s + 1);
  }

  // ── 날짜 계산 ──
  function getCookedAt(): string | undefined {
    if (form.dateMode === 'today') return todayStr();
    if (form.dateMode === 'yesterday') return yesterdayStr();
    return form.customDate || undefined;
  }

  // ── 저장 ──
  async function handleSave() {
    if (!validate(3)) return;
    setSaveError('');

    const payload = {
      recipeId: form.recipeId !== 'new' && form.recipeId !== '' ? Number(form.recipeId) : undefined,
      newRecipeName: form.recipeId === 'new' ? form.newRecipeName : undefined,
      newRecipeCategory: form.recipeId === 'new' ? form.newRecipeCategory : undefined,
      cookedAt: getCookedAt(),
      timeSlot: (form.timeSlot || 'NONE') as TimeSlot,
      cookTimeMinutes: form.cookTimeMinutes ? Number(form.cookTimeMinutes) : undefined,
      recipeMemo: form.recipeMemo || undefined,
      processMemo: form.processMemo || undefined,
      rating: form.rating,
      diary: form.diary || undefined,
      ingredients: form.ingredients,
    };

    createLog.mutate(payload, {
      onSuccess: async (log) => {
        if (images.length > 0) {
          try {
            await uploadImages(log.id, images);
          } catch {
            setSaveError('로그는 저장됐지만 이미지 업로드에 실패했습니다');
            return;
          }
        }
        handleClose();
      },
      onError: () => {
        setSaveError('저장에 실패했습니다. 다시 시도해주세요');
      },
    });
  }

  if (!isOpen) return null;

  // ── 단계별 콘텐츠 ──

  // ────────── STEP 1 ──────────
  const step1 = (
    <div className="space-y-5">
      {/* Recipe 선택 */}
      <div>
        <FieldLabel required>레시피</FieldLabel>
        <select
          value={form.recipeId}
          onChange={(e) => {
            const v = e.target.value;
            set('recipeId', v === 'new' ? 'new' : v === '' ? '' : Number(v));
          }}
          className={[
            'w-full px-3 py-2 text-sm rounded-lg border bg-white',
            'focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400',
            errors.recipeId ? 'border-red-400' : 'border-gray-300',
          ].join(' ')}
        >
          <option value="">레시피를 선택하세요</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
          <option value="new">+ 새 레시피로 등록</option>
        </select>
        {errors.recipeId && <p className="text-xs text-red-500 mt-1">{errors.recipeId}</p>}
      </div>

      {/* 새 레시피 인라인 입력 */}
      {form.recipeId === 'new' && (
        <div className="bg-orange-50 rounded-xl p-4 space-y-3 border border-orange-100">
          <Input
            label="새 레시피 이름"
            placeholder="예: 된장찌개"
            value={form.newRecipeName}
            onChange={(e) => set('newRecipeName', e.target.value)}
            errorMessage={errors.newRecipeName}
          />
          <div>
            <FieldLabel>카테고리</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('newRecipeCategory', opt.value)}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-full"
                >
                  <CategoryBadge
                    category={opt.value}
                    className={[
                      'cursor-pointer px-3 py-1 text-sm transition-opacity',
                      form.newRecipeCategory === opt.value ? 'opacity-100 ring-2 ring-offset-1 ring-orange-400' : 'opacity-60',
                    ].join(' ')}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 날짜 선택 */}
      <div>
        <FieldLabel>날짜</FieldLabel>
        <OptionGroup
          options={[
            { value: 'today', label: '오늘' },
            { value: 'yesterday', label: '어제' },
            { value: 'custom', label: '직접 선택' },
          ]}
          value={form.dateMode}
          onChange={(v) => set('dateMode', v)}
        />
        {form.dateMode === 'custom' && (
          <input
            type="date"
            value={form.customDate}
            max={todayStr()}
            onChange={(e) => set('customDate', e.target.value)}
            className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          />
        )}
      </div>

      {/* 시간대 선택 */}
      <div>
        <FieldLabel>시간대</FieldLabel>
        <OptionGroup
          options={TIME_SLOT_OPTIONS as { value: string; label: string }[]}
          value={form.timeSlot}
          onChange={(v) => set('timeSlot', v as TimeSlot | '')}
        />
      </div>
    </div>
  );

  // ────────── STEP 2 ──────────
  const step2 = (
    <div className="space-y-5">
      {/* 재료 */}
      <div>
        <FieldLabel>재료</FieldLabel>
        <TagInput
          value={form.ingredients}
          onChange={(v) => set('ingredients', v)}
          suggestions={ingredientSuggestions}
          placeholder="재료 입력 후 Enter (예: 돼지고기 200g)"
        />
      </div>

      {/* 조리 시간 */}
      <div>
        <FieldLabel>조리 시간</FieldLabel>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={999}
            value={form.cookTimeMinutes}
            onChange={(e) => set('cookTimeMinutes', e.target.value)}
            placeholder="30"
            className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder:text-gray-400"
          />
          <span className="text-sm text-gray-500">분</span>
        </div>
      </div>

      {/* 레시피 메모 */}
      <div>
        <FieldLabel>레시피 메모</FieldLabel>
        <textarea
          value={form.recipeMemo}
          onChange={(e) => set('recipeMemo', e.target.value)}
          placeholder="재료 비율, 조리법 등 레시피에 대한 메모를 남겨보세요"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder:text-gray-400"
        />
      </div>

      {/* 조리 과정 메모 */}
      <div>
        <FieldLabel>조리 과정 메모</FieldLabel>
        <textarea
          value={form.processMemo}
          onChange={(e) => set('processMemo', e.target.value)}
          placeholder="이번에 어떻게 만들었는지 과정을 기록해보세요"
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder:text-gray-400"
        />
      </div>
    </div>
  );

  // ────────── STEP 3 ──────────
  const step3 = (
    <div className="space-y-5">
      {/* 맛 평가 */}
      <div>
        <FieldLabel required>맛 평가</FieldLabel>
        <div className="flex flex-col items-center gap-3 py-4 bg-orange-50 rounded-xl border border-orange-100">
          <StarRating
            value={form.rating}
            onChange={(v) => set('rating', v)}
            mode="input"
            size="lg"
          />
          <p className="text-sm text-orange-600 font-medium">
            {form.rating === 0
              ? '별점을 선택해주세요'
              : ['', '아쉬워요', '보통이에요', '괜찮아요', '맛있어요', '최고예요!'][form.rating]}
          </p>
        </div>
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
      </div>

      {/* 요리 일기 */}
      <div>
        <FieldLabel>요리 일기</FieldLabel>
        <textarea
          value={form.diary}
          onChange={(e) => set('diary', e.target.value)}
          placeholder="오늘 요리하면서 있었던 일을 기록해보세요"
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder:text-gray-400"
        />
      </div>

      {/* 사진 업로드 */}
      <div>
        <FieldLabel>사진 ({images.length}/3)</FieldLabel>

        {/* 미리보기 썸네일 */}
        {previews.length > 0 && (
          <div className="flex gap-2 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`첨부 사진 ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 focus-visible:outline-none"
                  aria-label="사진 삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 업로드 영역 */}
        {images.length < 3 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              addImages(Array.from(e.dataTransfer.files));
            }}
            onClick={() => fileInputRef.current?.click()}
            className={[
              'flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
              isDragging ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50',
            ].join(' ')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-500">클릭하거나 사진을 여기로 드래그하세요</p>
            <p className="text-xs text-gray-400">최대 3장</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addImages(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
      </div>

      {/* 에러 메시지 */}
      {saveError && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {saveError}
        </div>
      )}
    </div>
  );

  const stepContent = [step1, step2, step3][step - 1];
  const isSaving = createLog.isPending;

  // ── 포털 렌더링 ──
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={STEP_TITLES[step - 1]}
    >
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 패널 */}
      <div
        ref={panelRef}
        className={[
          'relative z-10 bg-white w-full flex flex-col',
          'rounded-t-2xl max-h-[92dvh]',
          'sm:rounded-2xl sm:max-w-lg sm:mx-4 sm:max-h-[88dvh]',
        ].join(' ')}
      >
        {/* 모바일 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
        </div>

        {/* ── 헤더 ── */}
        <div className="px-4 pt-2 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">{STEP_TITLES[step - 1]}</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium">{step}/3</span>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                aria-label="닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {/* 진행 바 */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ── 콘텐츠 (스크롤 가능) ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          {stepContent}
        </div>

        {/* ── 하단 네비게이션 ── */}
        <div className="px-4 py-4 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
          {step > 1 ? (
            <Button
              variant="secondary"
              onClick={() => setStep((s) => s - 1)}
              disabled={isSaving}
              className="flex-none"
            >
              이전
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isSaving}
              className="flex-none"
            >
              취소
            </Button>
          )}
          {step < 3 ? (
            <Button fullWidth onClick={handleNext}>
              다음
            </Button>
          ) : (
            <Button fullWidth loading={isSaving} onClick={handleSave}>
              저장
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
