'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StarRating from '@/components/ui/StarRating';
import { useDeleteCookingLog } from '@/hooks/useCookingLogs';
import { CookingLog, TimeSlot } from '@/types';
import LogInputModal from './LogInputModal';

interface Props {
  log: CookingLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOT_LABEL: Record<TimeSlot, string> = {
  MORNING: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
  NONE: '-',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function LogDetailModal({ log, isOpen, onClose }: Props) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const deleteCookingLog = useDeleteCookingLog();

  if (!log) return null;

  function handleDeleteConfirm() {
    if (!log) return;
    deleteCookingLog.mutate(log.id, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        onClose();
      },
    });
  }

  const images = log.images ?? [];
  const mainImage = images[0]?.imageUrl ?? null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* ── 이미지 (있으면 전체 너비) ── */}
        {mainImage && (
          <div className="-mx-4 -mt-4 mb-4 overflow-hidden rounded-t-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImage}
              alt="조리 사진"
              className="w-full max-h-56 object-cover"
            />
            {/* 추가 이미지 행 */}
            {images.length > 1 && (
              <div className="flex gap-1 p-2 bg-black/5">
                {images.slice(1).map((img) => (
                  <div key={img.id} className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.imageUrl} alt="추가 사진" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 요리 이름 + 카테고리 ── */}
        <div className="flex items-start gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex-1 leading-snug">{log.recipeName}</h2>
          {log.category && <CategoryBadge category={log.category} />}
        </div>

        {/* ── 메타 정보 그리드 ── */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">날짜</p>
            <p className="text-xs font-medium text-gray-700">{formatDate(log.cookedAt)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">시간대</p>
            <p className="text-xs font-medium text-gray-700">{TIME_SLOT_LABEL[log.timeSlot]}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">조리 시간</p>
            <p className="text-xs font-medium text-gray-700">
              {log.cookTimeMinutes ? `${log.cookTimeMinutes}분` : '-'}
            </p>
          </div>
        </div>

        {/* ── 별점 ── */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <StarRating value={log.rating} mode="display" size="lg" />
          <span className="text-base font-semibold text-gray-700">{log.rating}점</span>
        </div>

        {/* ── 재료 ── */}
        {log.ingredients.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">재료</p>
            <div className="flex flex-wrap gap-1.5">
              {log.ingredients.map((ing) => (
                <span
                  key={ing.name}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-100 text-orange-800 rounded-full text-xs"
                >
                  <span className="font-medium">{ing.name}</span>
                  {ing.quantity && <span className="text-orange-500">{ing.quantity}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── 레시피 메모 ── */}
        {log.recipeMemo && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">레시피 메모</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-3">
              {log.recipeMemo}
            </p>
          </div>
        )}

        {/* ── 조리 과정 메모 ── */}
        {log.processMemo && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">조리 과정</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-3">
              {log.processMemo}
            </p>
          </div>
        )}

        {/* ── 요리 일기 ── */}
        {log.diary && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">요리 일기</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {log.diary}
            </p>
          </div>
        )}

        {/* ── 액션 버튼 ── */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setIsEditOpen(true)}
          >
            수정
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            삭제
          </Button>
        </div>
      </Modal>

      {/* ── 삭제 확인 모달 ── */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="조리 기록 삭제"
      >
        <p className="text-sm text-gray-600 mb-5">
          <span className="font-semibold text-gray-900">{formatDate(log.cookedAt)}</span>의{' '}
          <span className="font-semibold text-gray-900">{log.recipeName}</span> 기록을 삭제하시겠습니까?
          <br />
          <span className="text-red-500">이 작업은 되돌릴 수 없습니다.</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setIsDeleteConfirmOpen(false)}
          >
            취소
          </Button>
          <Button
            variant="danger"
            fullWidth
            loading={deleteCookingLog.isPending}
            onClick={handleDeleteConfirm}
          >
            삭제
          </Button>
        </div>
      </Modal>

      {/* ── 수정 모달 (LogInputModal 편집 모드) ── */}
      <LogInputModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          onClose();
        }}
        mode="edit"
        initialData={log}
      />
    </>
  );
}
