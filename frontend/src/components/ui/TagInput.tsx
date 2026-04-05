'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface Ingredient {
  name: string;
  quantity: string;
}

interface TagInputProps {
  value: Ingredient[];
  onChange: (value: Ingredient[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = '재료 입력 후 Enter 또는 쉼표',
}: TagInputProps) {
  const [nameInput, setNameInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const nameRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = suggestions.filter(
    (s) =>
      nameInput.trim().length > 0 &&
      s.toLowerCase().includes(nameInput.toLowerCase()) &&
      !value.some((v) => v.name === s)
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function addTag(name: string, quantity: string) {
    const trimmedName = name.trim().replace(/,$/, '');
    const trimmedQty = quantity.trim();
    if (!trimmedName) return;
    if (value.some((v) => v.name === trimmedName)) return;
    onChange([...value, { name: trimmedName, quantity: trimmedQty }]);
    setNameInput('');
    setQuantityInput('');
    setShowDropdown(false);
    setActiveIndex(-1);
    nameRef.current?.focus();
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
      return;
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
      return;
    }
    if ((e.key === 'Enter' || e.key === ',') && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const selectedName = activeIndex >= 0 ? filtered[activeIndex] : nameInput;
      addTag(selectedName, quantityInput);
    }
  }

  function handleQuantityKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && !e.nativeEvent.isComposing) {
      e.preventDefault();
      addTag(nameInput, quantityInput);
    }
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-2">
      {/* 태그 목록 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 text-orange-800 text-xs rounded-full"
            >
              <span className="font-medium">{tag.name}</span>
              {tag.quantity && <span className="text-orange-500">{tag.quantity}</span>}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="ml-0.5 text-orange-400 hover:text-orange-700 focus-visible:outline-none"
                aria-label={`${tag.name} 삭제`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 입력 영역 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={nameRef}
            type="text"
            value={nameInput}
            placeholder={placeholder}
            onChange={(e) => {
              setNameInput(e.target.value);
              setShowDropdown(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleNameKeyDown}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder:text-gray-400"
          />

          {/* 자동완성 드롭다운 */}
          {showDropdown && filtered.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {filtered.map((s, i) => (
                <li
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setNameInput(s);
                    setActiveIndex(-1);
                    setShowDropdown(false);
                  }}
                  className={[
                    'px-3 py-2 text-sm cursor-pointer',
                    i === activeIndex ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700',
                  ].join(' ')}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="text"
          value={quantityInput}
          placeholder="수량 (예: 2개)"
          onChange={(e) => setQuantityInput(e.target.value)}
          onKeyDown={handleQuantityKeyDown}
          className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 placeholder:text-gray-400"
        />

        <button
          type="button"
          onClick={() => addTag(nameInput, quantityInput)}
          className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-colors shrink-0"
        >
          추가
        </button>
      </div>
    </div>
  );
}
