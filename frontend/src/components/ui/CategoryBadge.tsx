import { Category } from '@/types';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  KOREAN: {
    label: '한식',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
  WESTERN: {
    label: '양식',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  JAPANESE: {
    label: '일식',
    className: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  CHINESE: {
    label: '중식',
    className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  },
  OTHER: {
    label: '기타',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  },
};

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const { label, className: colorClass } = categoryConfig[category];

  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        colorClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  );
}
