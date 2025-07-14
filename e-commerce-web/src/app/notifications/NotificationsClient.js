'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import ProgressLink from '../../components/ProgressLink';
import { ArrowLeft, Bell, Package, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';

export default function NotificationsClient() {
  const { user, isAuthenticated } = useUser();
  const { notifications, markAsRead, clearAllNotifications } = useNotifications();
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'refund':
        return <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${scheme.background} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view notifications</h2>
          <ProgressLink 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </ProgressLink>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${scheme.background}`}>
      {/* Header */}
      <div className={`${scheme.card} shadow-sm border-b ${scheme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ProgressLink 
                href="/"
                className={`${scheme.textSecondary} hover:${scheme.text} transition`}
              >
                <ArrowLeft className="w-5 h-5" />
              </ProgressLink>
              <h1 className={`text-2xl font-bold ${scheme.text}`}>Notifications</h1>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className={`px-4 py-2 text-sm ${scheme.card} ${scheme.text} border ${scheme.border} rounded-lg hover:${scheme.hover} transition`}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className={`${scheme.textSecondary}`}>
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${scheme.card} p-6 rounded-lg border ${scheme.border} transition ${
                  !notification.read ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${scheme.text} mb-1`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm ${scheme.textSecondary} mb-2`}>
                          {notification.message}
                        </p>
                        {notification.orderId && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            Order #{notification.orderId.slice(-8)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${scheme.textSecondary}`}>
                          {formatDate(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 