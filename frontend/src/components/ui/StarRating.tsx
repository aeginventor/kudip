'use client';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  mode?: 'input' | 'display';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

function StarIcon({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export default function StarRating({
  value,
  onChange,
  mode = 'display',
  size = 'md',
}: StarRatingProps) {
  const displayValue = mode === 'display' ? Math.round(value) : value;

  if (mode === 'input') {
    return (
      <div className="flex gap-0.5" role="group" aria-label="별점 선택">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={[
              'transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded',
              star <= value ? 'text-yellow-400' : 'text-gray-300',
            ].join(' ')}
            aria-label={`${star}점`}
          >
            <StarIcon filled={star <= value} className={sizeClasses[size]} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-0.5" aria-label={`별점 ${displayValue}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= displayValue ? 'text-yellow-400' : 'text-gray-300'}
        >
          <StarIcon filled={star <= displayValue} className={sizeClasses[size]} />
        </span>
      ))}
    </div>
  );
}
