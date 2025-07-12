"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import ProgressLink from './ProgressLink';
import { useTheme } from '../context/ThemeContext';

export default function Toast({ message, isVisible, onClose, type = 'success', linkType = null }) {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Choose icon and color based on type
  let icon = <CheckCircle className="w-5 h-5 flex-shrink-0" />;
  let bg = scheme.accent;
  let border = scheme.border;
  let text = 'text-white';
  if (type === 'info') {
    icon = <Info className="w-5 h-5 flex-shrink-0" />;
    bg = scheme.card;
    text = scheme.text;
  }
  if (type === 'error') {
    icon = <XCircle className="w-5 h-5 flex-shrink-0 text-red-400" />;
    bg = 'bg-red-600';
    text = 'text-white';
    border = 'border-red-700';
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className={`${bg} ${text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[280px] border ${border}`}>
        {icon}
        <div className="flex-1">
          <span className="text-sm font-medium">{message}</span>
          {linkType === 'cart' && (
            <div className="mt-1">
              <ProgressLink 
                href="/cartpage" 
                className="text-xs underline hover:opacity-80 transition-colors"
              >
                View Cart
              </ProgressLink>
            </div>
          )}
          {linkType === 'wishlist' && (
            <div className="mt-1">
              <ProgressLink 
                href="/profile?tab=wishlist" 
                className="text-xs underline hover:opacity-80 transition-colors"
              >
                View Wishlist
              </ProgressLink>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className={`ml-auto ${text} hover:opacity-80 transition-colors text-lg font-bold`}
        >
          ×
        </button>
      </div>
    </div>
  );
} 