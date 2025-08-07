"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Super cool color schemes with gradients
const colorSchemes = {
  dark: {
    
    neon: {
      background: 'bg-gradient-to-br from-black via-gray-900 to-black',
      card: 'bg-gradient-to-br from-gray-800/90 via-gray-700/70 to-gray-800/90',
      accent: 'bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-green-500/50',
      hover: 'hover:bg-gradient-to-br hover:from-gray-700 hover:via-gray-600 hover:to-gray-700'
    },
    
  },
  light: {
   
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
 
  const getDefaultColorScheme = (theme) => theme === 'dark' ? 'neon' : 'elegant';
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
    const fallbackScheme = theme === 'dark' ? 'neon' : 'elegant';
    const accent = colorSchemes[theme][colorScheme]?.accent || colorSchemes[theme][fallbackScheme].accent;
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
    const fallbackScheme = theme === 'dark' ? 'neon' : 'elegant';
    return schemes[colorScheme] || schemes[fallbackScheme];
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