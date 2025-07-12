"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Super cool color schemes with gradients
const colorSchemes = {
  dark: {
    primary: {
      background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      card: 'bg-gradient-to-br from-slate-800/80 via-purple-800/60 to-slate-800/80',
      accent: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-purple-700/50',
      hover: 'hover:bg-gradient-to-br hover:from-slate-700 hover:via-purple-700 hover:to-slate-700'
    },
    secondary: {
      background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
      card: 'bg-gradient-to-br from-gray-800/80 via-blue-800/60 to-gray-800/80',
      accent: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-blue-700/50',
      hover: 'hover:bg-gradient-to-br hover:from-gray-700 hover:via-blue-700 hover:to-gray-700'
    },
    neon: {
      background: 'bg-gradient-to-br from-black via-gray-900 to-black',
      card: 'bg-gradient-to-br from-gray-800/90 via-gray-700/70 to-gray-800/90',
      accent: 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-green-500/50',
      hover: 'hover:bg-gradient-to-br hover:from-gray-700 hover:via-gray-600 hover:to-gray-700'
    },
    sunset: {
      background: 'bg-gradient-to-br from-orange-900 via-red-800 to-purple-900',
      card: 'bg-gradient-to-br from-orange-800/80 via-red-700/60 to-purple-800/80',
      accent: 'bg-gradient-to-r from-orange-500 via-red-500 to-purple-500',
      text: 'text-white',
      textSecondary: 'text-gray-200',
      border: 'border-orange-600/50',
      hover: 'hover:bg-gradient-to-br hover:from-orange-700 hover:via-red-600 hover:to-purple-700'
    }
  },
  light: {
    primary: {
      background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      card: 'bg-gradient-to-br from-white/90 via-blue-50/70 to-white/90',
      accent: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-blue-200',
      hover: 'hover:bg-gradient-to-br hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100'
    },
    secondary: {
      background: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      card: 'bg-gradient-to-br from-white/90 via-green-50/70 to-white/90',
      accent: 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-green-200',
      hover: 'hover:bg-gradient-to-br hover:from-green-100 hover:via-emerald-100 hover:to-teal-100'
    },
    warm: {
      background: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
      card: 'bg-gradient-to-br from-white/90 via-orange-50/70 to-white/90',
      accent: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-orange-200',
      hover: 'hover:bg-gradient-to-br hover:from-orange-100 hover:via-red-100 hover:to-pink-100'
    },
    elegant: {
      background: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
      card: 'bg-gradient-to-br from-white/90 via-gray-50/70 to-white/90',
      accent: 'bg-gradient-to-r from-gray-600 via-slate-600 to-zinc-600',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      hover: 'hover:bg-gradient-to-br hover:from-gray-100 hover:via-slate-100 hover:to-zinc-100'
    }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  // Default color scheme: neon for dark, primary for light
  const getDefaultColorScheme = (theme) => theme === 'dark' ? 'neon' : 'primary';
  const [colorScheme, setColorScheme] = useState(getDefaultColorScheme('dark'));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    // Only run on client
    const savedTheme = localStorage.getItem('theme');
    const savedColorScheme = localStorage.getItem('colorScheme');
    let initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.classList.toggle('light', initialTheme === 'light');
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    } else {
      setColorScheme(getDefaultColorScheme(initialTheme));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    // Set CSS variable for accent gradient (for progress bar/scrollbar)
    const accent = colorSchemes[theme][colorScheme]?.accent || colorSchemes[theme]['primary'].accent;
    document.documentElement.style.setProperty('--nprogress-bar-gradient', accent);
    document.documentElement.style.setProperty('--scrollbar-thumb-gradient', accent);
  }, [theme, colorScheme, hydrated]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setColorSchemeByName = (schemeName) => {
    setColorScheme(schemeName);
  };

  const getCurrentScheme = () => {
    const schemes = colorSchemes[theme];
    return schemes[colorScheme] || schemes['primary'];
  };

  const getAllSchemes = () => {
    return colorSchemes[theme];
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      colorScheme, 
      setColorSchemeByName, 
      getCurrentScheme, 
      getAllSchemes,
      hydrated
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 