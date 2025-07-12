"use client";
import { useEffect, useState } from "react";
import ProgressLink from "./ProgressLink";
import { X, Palette, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Moon, Sun } from 'lucide-react';

export default function ProfileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showColorSchemes, setShowColorSchemes] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => { setHydrated(true); }, []);
  const { theme, toggleTheme, colorScheme, setColorSchemeByName, getAllSchemes, getCurrentScheme } = useTheme();
  const { user, logout } = useUser();
  const schemes = getAllSchemes();
  const scheme = getCurrentScheme();
  const schemeNames = {
    primary: "Primary",
    secondary: "Secondary", 
    neon: "Neon",
    sunset: "Sunset",
    warm: "Warm",
    elegant: "Elegant"
  };

  const getInitial = (name) => name?.[0]?.toUpperCase() || "?";

  const handleMenuOpen = () => {
    setMenuOpen(true);
    // Start animation after a brief delay to ensure the element is rendered
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleMenuClose = () => {
    setIsAnimating(false);
    setTimeout(() => setMenuOpen(false), 300);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!hydrated) return (
    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center shadow-md" />
  );

  return (
    <>
      {/* Profile button */}
      <button
        onClick={handleMenuOpen}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white font-bold flex items-center justify-center shadow-md transition-all duration-300 ease-in-out hover:scale-110 focus:scale-110 hover:shadow-lg focus:shadow-lg"
        tabIndex={0}
      >
        {user ? (
          getInitial(user.name)
        ) : (
          <Image
            src="/profile.png"
            alt="Profile"
            className="w-full h-full object-fit"
            width={32}
            height={32}
            priority
          />
        )}
      </button>

      {/* Slide-in drawer and overlay */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleMenuClose}
            aria-label="Close profile menu overlay"
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-screen w-[80%] sm:w-[350px] z-50 backdrop-blur-md ${scheme.card} border-l ${scheme.border} transform transition-all duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
          >
            <div className={`relative flex flex-col p-6 pt-16 ${scheme.text} font-semibold text-base gap-4`}>
              <button
                onClick={handleMenuClose}
                className="absolute top-4 right-4 transition-all duration-200 ease-in-out hover:scale-110"
                aria-label="Close profile menu"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Menu items */}
              <div className="space-y-3">
                {/* Theme Switcher */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border ${scheme.border} ${scheme.card} hover:${scheme.hover} transition-all duration-200 ease-in-out ${scheme.text} font-semibold w-full hover:scale-105`}
                  aria-label="Toggle dark/light theme"
                >
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                </button>

                {/* Color Scheme Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowColorSchemes(!showColorSchemes)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border ${scheme.border} ${scheme.card} hover:${scheme.hover} transition-all duration-200 ease-in-out ${scheme.text} font-semibold w-full hover:scale-105`}
                    aria-label="Select color scheme"
                  >
                    <Palette className="w-5 h-5" />
                    <span>{schemeNames[colorScheme] || colorScheme}</span>
                  </button>
                  {showColorSchemes && (
                    <div className={`absolute top-full left-0 right-0 mt-2 ${scheme.card} rounded-md shadow-lg border ${scheme.border} z-10 transition-all duration-200 ease-in-out`}>
                      {Object.entries(schemes).map(([key, schemeObj], index) => (
                        <button
                          key={key}
                          onClick={() => {
                            setColorSchemeByName(key);
                            setShowColorSchemes(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:${scheme.hover} transition-all duration-200 ease-in-out hover:scale-105 ${colorScheme === key ? `${scheme.accent} text-white font-semibold` : ''}`}
                        >
                          <div className={`w-4 h-4 rounded-full ${schemeObj.accent}`}></div>
                          <span className="text-sm">{schemeNames[key] || key}</span>
                          {colorScheme === key && <Sparkles className="w-4 h-4 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User info and links */}
                {!user ? (
                  <ProgressLink
                    href="/login"
                    onClick={handleMenuClose}
                    className={`w-full text-center ${scheme.accent} text-white py-2 px-4 rounded-md font-semibold hover:opacity-90 transition-all duration-200 ease-in-out hover:scale-105`}
                  >
                    Login
                  </ProgressLink>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {getInitial(user.name)}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                        {user.role === 'admin' && (
                          <p className="text-blue-600 text-xs font-semibold">Admin</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <ProgressLink href="/profile" onClick={handleMenuClose} className="block hover:scale-105 transition-all duration-200 ease-in-out">
                        View Profile
                      </ProgressLink>
                      <ProgressLink href="/profile?tab=settings" onClick={handleMenuClose} className="block hover:scale-105 transition-all duration-200 ease-in-out">
                        Settings
                      </ProgressLink>
                      <button
                        onClick={handleLogout}
                        className="text-left text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200 ease-in-out"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
