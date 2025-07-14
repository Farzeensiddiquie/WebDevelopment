'use client';
import { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import ProgressLink from '../../components/ProgressLink';
import { ArrowLeft, Bell, Package, Truck, CheckCircle, XCircle, DollarSign, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();
  const { user } = useUser();
  const { getCurrentScheme } = useTheme();
  const { showToast } = useToast();
  const scheme = getCurrentScheme();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <DollarSign className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`min-h-screen ${scheme.background}`}>
      {/* Header */}
      <div className={`${scheme.card} shadow-sm border-b ${scheme.border}`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
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
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`px-4 py-2 ${scheme.accent} text-white rounded-lg hover:opacity-90 transition`}
                >
                  Mark All as Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
                      clearAllNotifications();
                      showToast('All notifications cleared', 'success');
                    }
                  }}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2`}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className={`text-xl font-semibold ${scheme.text} mb-2`}>No notifications</h2>
            <p className={`${scheme.textSecondary}`}>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${scheme.card} p-6 rounded-lg border ${scheme.border} transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${scheme.text} mb-1`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${scheme.textSecondary}`}>
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    <p className={`${scheme.textSecondary} mb-3`}>
                      {notification.message}
                    </p>
                    {notification.orderId && (
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono ${scheme.textSecondary} bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>
                          Order #{notification.orderId.slice(-8)}
                        </span>
                        <ProgressLink
                          href={`/profile?tab=orders&order=${notification.orderId}`}
                          className={`text-sm ${scheme.accent} hover:opacity-80 transition`}
                        >
                          View Order
                        </ProgressLink>
                      </div>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition"
                      >
                        Mark as read
                      </button>
                    )}
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