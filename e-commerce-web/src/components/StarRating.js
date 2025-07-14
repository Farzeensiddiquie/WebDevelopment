'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  size = 'md', 
  readonly = false, 
  onRatingChange = null,
  showValue = false,
  className = ''
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const handleMouseEnter = (starIndex) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex) => {
    if (!readonly && onRatingChange) {
      setCurrentRating(starIndex);
      onRatingChange(starIndex);
    }
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starIndex = index + 1;
        const isFilled = starIndex <= displayRating;
        
        return (
          <button
            key={index}
            type="button"
            className={`transition-colors duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            disabled={readonly}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
} 