'use client';

import { InputHTMLAttributes, useState, forwardRef } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  errorMessage?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  label,
  errorMessage,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasError = Boolean(errorMessage);
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={inputType}
          className={[
            'w-full px-3 py-2 text-sm rounded-lg border bg-white transition-colors duration-150',
            'placeholder:text-gray-400 focus:outline-none focus:ring-2',
            hasError
              ? 'border-red-400 focus:ring-red-300'
              : 'border-gray-300 focus:ring-orange-300 focus:border-orange-400',
            isPassword ? 'pr-10' : '',
            props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.39 0 2.71.3 3.875.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p className="text-xs text-red-500 mt-0.5">{errorMessage}</p>
      )}
    </div>
  );
});

export default Input;
