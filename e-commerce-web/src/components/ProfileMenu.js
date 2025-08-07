"use client";
import { useState } from "react";
import ProgressLink from "./ProgressLink";
import {
  X,
 
  Bell,
  Package,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { useNotifications } from "../context/NotificationContext";
import { Moon, Sun } from "lucide-react";

export default function ProfileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showColorSchemes, setShowColorSchemes] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    theme,
    toggleTheme,
    colorScheme,
    setColorSchemeByName,
    getAllSchemes,
    getCurrentScheme,
    hydrated, // use hydrated from ThemeContext
  } = useTheme();
  const { user, logout, loading, initialized } = useUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const schemes = getAllSchemes();
  const scheme = getCurrentScheme();
  const schemeNames = {
    neon: "Neon",

    elegant: "Elegant",
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
      console.error("Logout error:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!hydrated || !initialized)
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center shadow-md" />
    );

  // Don't render anything if not initialized to prevent flash
  if (!initialized) {
    return null;
  }

  return (
    <>
      {/* Profile button */}
      <button
        onClick={handleMenuOpen}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white font-bold flex items-center justify-center shadow-md transition-all duration-300 ease-in-out hover:scale-110 focus:scale-110 hover:shadow-lg focus:shadow-lg relative"
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
        {/* Notification badge */}
        {user && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-in drawer and overlay */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleMenuClose}
            aria-label="Close profile menu overlay"
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-screen w-[80%] sm:w-[400px] z-50 backdrop-blur-md ${
              scheme.card
            } border-l ${
              scheme.border
            } transform transition-all duration-300 ease-in-out ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`relative flex flex-col p-6 pt-16 ${scheme.text} font-semibold text-base gap-4 h-full`}
            >
              <button
                onClick={handleMenuClose}
                className="absolute top-4 right-4 transition-all duration-200 ease-in-out hover:scale-110"
                aria-label="Close profile menu"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Menu items */}
              <div className="space-y-3 flex-1">
                {/* Theme Switcher */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border ${scheme.border} ${scheme.card} hover:${scheme.hover} transition-all duration-200 ease-in-out ${scheme.text} font-semibold w-full hover:scale-105`}
                  aria-label="Toggle dark/light theme"
                >
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                  <span>{theme === "dark" ? "Dark" : "Light"} Mode</span>
                </button>

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
                        {user.role === "admin" && (
                          <p className="text-blue-600 text-xs font-semibold">
                            Admin
                          </p>
                        )}
                        {user.role === "superadmin" && (
                          <p className="text-purple-600 text-xs font-semibold">
                            Superadmin
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <ProgressLink
                        href="/profile"
                        onClick={handleMenuClose}
                        className="block hover:scale-105 transition-all duration-200 ease-in-out"
                      >
                        View Profile
                      </ProgressLink>
                      <ProgressLink
                        href="/notifications"
                        onClick={handleMenuClose}
                        className="block hover:scale-105 transition-all duration-200 ease-in-out relative"
                      >
                        Notifications
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </ProgressLink>
                      <ProgressLink
                        href="/profile?tab=settings"
                        onClick={handleMenuClose}
                        className="block hover:scale-105 transition-all duration-200 ease-in-out"
                      >
                        Settings
                      </ProgressLink>
                      {user.role === "admin" && (
                        <ProgressLink
                          href="/admin"
                          onClick={handleMenuClose}
                          className="block hover:scale-105 transition-all duration-200 ease-in-out text-blue-600"
                        >
                          Admin Dashboard
                        </ProgressLink>
                      )}
                      {user.role === "superadmin" && (
                        <ProgressLink
                          href="/admin"
                          onClick={handleMenuClose}
                          className="block hover:scale-105 transition-all duration-200 ease-in-out text-purple-600"
                        >
                          Admin Dashboard
                        </ProgressLink>
                      )}
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
