"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { notificationAPI } from '../utils/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user, initialized } = useUser();

  // Load notifications from backend when user is authenticated and initialized
  useEffect(() => {
    if (initialized && isAuthenticated && user) {
      loadNotifications();
    } else if (initialized && !isAuthenticated) {
      // Clear notifications when user is not authenticated
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [initialized, isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      // Load notifications from API if authenticated
      if (isAuthenticated) {
        try {
          const response = await notificationAPI.getNotifications();
          // Check if response contains an error
          if (response && response.error) {
            console.error('Failed to load notifications from API:', response.error);
            if (response.error.includes('Authentication required')) {
              // Fallback to localStorage for this session
              loadFromLocalStorage();
            }
          } else if (response && response.data) {
            setNotifications(response.data);
            setUnreadCount(response.unreadCount || 0);
            return;
          }
        } catch (error) {
          console.error('Failed to load notifications from API:', error);
          // If API fails, fallback to localStorage
          if (error.message?.includes('Authentication required')) {
            loadFromLocalStorage();
          }
        }
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const loadFromLocalStorage = () => {
    // Load notifications from localStorage for the current user
    let userEmail = user?.email || 'guest';
    
    const notificationsKey = `notifications_${userEmail}`;
    const savedNotifications = localStorage.getItem(notificationsKey);
    
    if (savedNotifications) {
      try {
        const userNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(userNotifications)) {
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => !n.read).length);
        } else {
          // If stored data is not an array, reset it
          setNotifications([]);
          setUnreadCount(0);
          localStorage.removeItem(notificationsKey);
        }
      } catch (parseError) {
        console.error('Failed to parse notifications from localStorage:', parseError);
        // Clear corrupted data
        setNotifications([]);
        setUnreadCount(0);
        localStorage.removeItem(notificationsKey);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const saveNotifications = (newNotifications) => {
    let userEmail = user?.email;
    
    // Save to user-specific localStorage
    if (userEmail) {
      const notificationsKey = `notifications_${userEmail}`;
      localStorage.setItem(notificationsKey, JSON.stringify(newNotifications));
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const newNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: notificationData.type || 'system',
        title: notificationData.title,
        message: notificationData.message,
        read: false,
        orderId: notificationData.orderId || null,
        productId: notificationData.productId || null,
        createdAt: new Date().toISOString()
      };

      // Add to local state
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Save to backend if authenticated
      if (isAuthenticated) {
        try {
          await notificationAPI.addNotification(newNotification);
        } catch (error) {
          console.error('Failed to save notification to backend:', error);
          // Still save locally even if backend fails
        }
      }

      // Save to localStorage
      saveNotifications([newNotification, ...notifications]);

      return newNotification;
    } catch (error) {
      console.error('Failed to add notification:', error);
      throw error;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Update via API if authenticated
      if (isAuthenticated) {
        try {
          await notificationAPI.markNotificationAsRead(notificationId);
        } catch (error) {
          console.error('Failed to mark notification as read via API:', error);
        }
      }

      // Save to localStorage
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      // Update via API if authenticated
      if (isAuthenticated) {
        try {
          await notificationAPI.markAllAsRead();
        } catch (error) {
          console.error('Failed to mark all notifications as read via API:', error);
        }
      }

      // Save to localStorage
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Update local state
      const notification = notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.read;
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Delete via API if authenticated
      if (isAuthenticated) {
        try {
          await notificationAPI.deleteNotification(notificationId);
        } catch (error) {
          console.error('Failed to delete notification via API:', error);
        }
      }

      // Save to localStorage
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Clear local state
      setNotifications([]);
      setUnreadCount(0);

      // Clear via API if authenticated
      if (isAuthenticated) {
        try {
          await notificationAPI.clearAllNotifications();
        } catch (error) {
          console.error('Failed to clear notifications via API:', error);
        }
      }

      // Clear localStorage
      let userEmail = user?.email;
      if (userEmail) {
        const notificationsKey = `notifications_${userEmail}`;
        localStorage.removeItem(notificationsKey);
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      throw error;
    }
  };

  const notifyAdmins = (notificationData) => {
    // This function sends notifications to all admin users
    // In a real app, this would be handled by a messaging service
    // For now, we'll store admin notifications in localStorage
    try {
      const adminUsersKey = 'admin_users';
      let adminUsers = [];
      
      try {
        const savedAdminUsers = localStorage.getItem(adminUsersKey);
        if (savedAdminUsers) {
          const parsed = JSON.parse(savedAdminUsers);
          if (Array.isArray(parsed)) {
            adminUsers = parsed;
          }
        }
      } catch (parseError) {
        console.error('Failed to parse admin users:', parseError);
      }

      // Add notification for each admin user
      adminUsers.forEach(adminEmail => {
        const adminNotificationsKey = `notifications_${adminEmail}`;
        let adminNotifications = [];
        
        try {
          const savedAdminNotifications = localStorage.getItem(adminNotificationsKey);
          if (savedAdminNotifications) {
            const parsed = JSON.parse(savedAdminNotifications);
            if (Array.isArray(parsed)) {
              adminNotifications = parsed;
            }
          }
        } catch (parseError) {
          console.error('Failed to parse admin notifications:', parseError);
        }

        const adminNotification = {
          id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'admin',
          title: notificationData.title,
          message: notificationData.message,
          read: false,
          orderId: notificationData.orderId || null,
          productId: notificationData.productId || null,
          createdAt: new Date().toISOString()
        };

        adminNotifications.unshift(adminNotification);
        if (adminNotifications.length > 50) {
          adminNotifications = adminNotifications.slice(0, 50);
        }

        localStorage.setItem(adminNotificationsKey, JSON.stringify(adminNotifications));
      });
    } catch (error) {
      console.error('Failed to notify admins:', error);
    }
  };

  const getNotifications = () => {
    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.read);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    notifyAdmins,
    getNotifications,
    getUnreadNotifications,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 