'use client';

import { useState } from 'react';

interface StarRatingDisplayProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function StarRatingDisplay({
  rating,
  maxStars = 5,
  size = 'md',
}: StarRatingDisplayProps) {
  const sizeClass = SIZE_MAP[size];

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <svg
            key={i}
            className={`${sizeClass} ${filled ? 'text-monarch-gold' : 'text-gray-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
}

export function StarPicker({ value, onChange, maxStars = 5 }: StarPickerProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Star rating"
    >
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hovered || value);

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            className={`w-8 h-8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-monarch-gold rounded ${
              isActive ? 'text-monarch-gold' : 'text-gray-600 hover:text-monarch-gold-dark'
            }`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
