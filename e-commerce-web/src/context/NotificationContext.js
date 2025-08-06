"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { notificationAPI } from '../utils/api';
import { useToast } from './ToastContext';
import { useRef, useCallback } from 'react';
import { io as socketIOClient } from 'socket.io-client';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  // SSR/CSR safety: Only run logic if window is defined
  const isClient = typeof window !== 'undefined';

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user, initialized } = useUser();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Setup socket.io-client for real-time notifications (client only)
  useEffect(() => {
    if (!isClient) return;
    if (!initialized) return;
    if (!socketRef.current) {
      socketRef.current = socketIOClient('http://localhost:5000');
      console.log('[Socket] Connecting to http://localhost:5000');
    }
    const socket = socketRef.current;
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected:', socket.id);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [initialized, isClient]);

  // Track socket connection state (client only)
  useEffect(() => {
    if (!isClient) return;
    const socket = socketRef.current;
    if (!socket) return;
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [initialized, isClient]);

  // Robust registration effect with retry (client only)
  useEffect(() => {
    if (!isClient) return;
    const socket = socketRef.current;
    let retryTimeout;
    const userId = user?._id || user?.id;
    console.log('[Socket] Registration effect running. user:', user, 'userId:', userId, 'socketConnected:', socketConnected, 'socket:', socket && socket.id);
    const tryRegister = () => {
      if (userId && socket && socketConnected) {
        console.log('[Socket] Registering socket (retry):', userId, user?.role, 'socket:', socket.id);
        socket.emit('register', userId);
      } else {
        retryTimeout = setTimeout(tryRegister, 300);
      }
    };
    tryRegister();
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [user, socketConnected, isClient]);

  // Listen for admin/user notifications (client only)
  useEffect(() => {
    if (!isClient) return;
    const socket = socketRef.current;
    if (!socket) return;
    const handleAdminNotification = (data) => {
      console.log('[Socket] Received admin_notification:', data);
      if (user && (user.role === 'admin' || user.role === 'superadmin')) {
        setNotifications(prev => {
          if (prev.some(n =>
            n.type === (data.type || 'system') &&
            n.title === data.title &&
            n.orderId === (data.orderId || null)
          )) {
            return prev;
          }
          return [
            {
              id: data.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: data.type || 'system',
              title: data.title,
              message: data.message,
              read: false,
              orderId: data.orderId || null,
              productId: data.productId || null,
              createdAt: data.createdAt || new Date().toISOString()
            },
            ...prev
          ];
        });
        if (showToast) showToast(data.message || 'New admin notification');
      }
    };
    const handleUserNotification = (data) => {
      console.log('[Socket] Received user_notification:', data);
      addNotification(data);
      if (showToast) showToast(data.message || 'New notification');
    };
    socket.on('admin_notification', handleAdminNotification);
    socket.on('user_notification', handleUserNotification);
    return () => {
      socket.off('admin_notification', handleAdminNotification);
      socket.off('user_notification', handleUserNotification);
    };
  }, [user, showToast, isClient]);

  // Load notifications from backend when user is authenticated and initialized (client only)
  useEffect(() => {
    if (!isClient) return;
    if (initialized && isAuthenticated && user) {
      loadNotifications();
    } else if (initialized && !isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [initialized, isAuthenticated, user, isClient]);

  // SSR/CSR-safe localStorage access
  const loadFromLocalStorage = () => {
    if (!isClient) return;
    let userEmail = user?.email || 'guest';
    const notificationsKey = `notifications_${userEmail}`;
    const savedNotifications = window.localStorage.getItem(notificationsKey);
    if (savedNotifications) {
      try {
        const userNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(userNotifications)) {
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => !n.read).length);
        } else {
          setNotifications([]);
          setUnreadCount(0);
          window.localStorage.removeItem(notificationsKey);
        }
      } catch (parseError) {
        setNotifications([]);
        setUnreadCount(0);
        window.localStorage.removeItem(notificationsKey);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const saveNotifications = (newNotifications) => {
    if (!isClient) return;
    let userEmail = user?.email;
    if (userEmail) {
      const notificationsKey = `notifications_${userEmail}`;
      window.localStorage.setItem(notificationsKey, JSON.stringify(newNotifications));
    }
  };

  const addNotification = async (notificationData) => {
    try {
      // Deduplicate in local state
      setNotifications(prev => {
        if (prev.some(n =>
          n.type === (notificationData.type || 'system') &&
          n.title === notificationData.title &&
          n.orderId === (notificationData.orderId || null)
        )) {
          return prev;
        }
        return [
          {
            id: notificationData.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: notificationData.type || 'system',
            title: notificationData.title,
            message: notificationData.message,
            read: false,
            orderId: notificationData.orderId || null,
            productId: notificationData.productId || null,
            createdAt: notificationData.createdAt || new Date().toISOString()
          },
          ...prev
        ];
      });
      setUnreadCount(prev => prev + 1);

      // Save to backend if authenticated
      if (isAuthenticated) {
        try {
          await notificationAPI.addNotification(notificationData);
        } catch (error) {
          console.error('Failed to save notification to backend:', error);
        }
      }

      // Save to localStorage
      saveNotifications([notificationData, ...notifications]);

      return notificationData;
    } catch (error) {
      console.error('Failed to add notification:', error);
      throw error;
    }
  };

  // --- Optimistic UI and socket-driven updates refactor ---

  // Helper: Optimistically update notification state
  const optimisticUpdate = (updateFn) => {
    setNotifications((prev) => {
      const updated = updateFn(prev);
      setUnreadCount(updated.filter(n => !n.read).length);
      saveNotifications(updated);
      return updated;
    });
  };

  // Mark notification as read (optimistic)
  const markAsRead = async (notificationId) => {
    optimisticUpdate((prev) => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    try {
      await notificationAPI.markAsRead(notificationId);
      // Optionally, wait for socket event to re-sync
    } catch (error) {
      showToast && showToast('Failed to mark as read', 'error');
      // Revert
      optimisticUpdate((prev) => prev.map(n => n.id === notificationId ? { ...n, read: false } : n));
    }
  };

  // Mark all as read (optimistic)
  const markAllAsRead = async () => {
    optimisticUpdate((prev) => prev.map(n => ({ ...n, read: true })));
    try {
      await notificationAPI.markAllAsRead();
    } catch (error) {
      showToast && showToast('Failed to mark all as read', 'error');
      // Revert
      optimisticUpdate((prev) => prev.map(n => ({ ...n, read: false })));
    }
  };

  // Delete notification (optimistic)
  const deleteNotification = async (notificationId) => {
    const prevNotifications = notifications;
    optimisticUpdate((prev) => prev.filter(n => n.id !== notificationId));
    try {
      await notificationAPI.deleteNotification(notificationId);
    } catch (error) {
      showToast && showToast('Failed to delete notification', 'error');
      // Revert
      setNotifications(prevNotifications);
      setUnreadCount(prevNotifications.filter(n => !n.read).length);
      saveNotifications(prevNotifications);
    }
  };

  // Clear all notifications (optimistic)
  const clearAllNotifications = async () => {
    const prevNotifications = notifications;
    optimisticUpdate(() => []);
    try {
      await notificationAPI.clearAllNotifications();
    } catch (error) {
      showToast && showToast('Failed to clear notifications', 'error');
      // Revert
      setNotifications(prevNotifications);
      setUnreadCount(prevNotifications.filter(n => !n.read).length);
      saveNotifications(prevNotifications);
    }
  };

  // Listen for backend socket events for notification changes
  useEffect(() => {
    if (!isClient) return;
    const socket = socketRef.current;
    if (!socket) return;
    const handleNotificationUpdate = (data) => {
      // Replace notifications with backend state or merge as needed
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.read).length);
        saveNotifications(data.notifications);
      }
    };
    socket.on('notifications_update', handleNotificationUpdate);
    return () => {
      socket.off('notifications_update', handleNotificationUpdate);
    };
  }, [isClient]);

  const notifyAdmins = (notificationData) => {
    // This function sends notifications to all admin users
    // In a real app, this would be handled by a messaging service
    // For now, we'll store admin notifications in localStorage
    try {
      const adminUsersKey = 'admin_users';
      let adminUsers = [];
      
      try {
        const savedAdminUsers = window.localStorage.getItem(adminUsersKey);
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
          const savedAdminNotifications = window.localStorage.getItem(adminNotificationsKey);
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

        window.localStorage.setItem(adminNotificationsKey, JSON.stringify(adminNotifications));
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
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getNotifications,
        getUnreadNotifications,
        loadNotifications,
        notifyAdmins,
      }}
    >
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