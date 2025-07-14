"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useUser } from './UserContext';
import { orderAPI } from '../utils/api';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification, notifyAdmins } = useNotifications();
  const { user, isAuthenticated } = useUser();

  // Get user email from localStorage
  function getUserEmail() {
    try {
      const profile = JSON.parse(localStorage.getItem('user_profile'));
      return profile?.email || 'guest';
    } catch {
      return 'guest';
    }
  }

  // Helper to get the storage key
  function getOrderKey() {
    return `orders_${getUserEmail()}`;
  }

  // Load orders from API or localStorage
  useEffect(() => {
    if (isAuthenticated) {
      loadOrdersFromAPI();
    } else {
      loadOrdersFromLocalStorage();
    }
  }, [isAuthenticated]);

  const loadOrdersFromAPI = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      // Check if response contains an error
      if (response && response.error) {
        console.error('Failed to load orders from API:', response.error);
        if (response.error.includes('Authentication required')) {
          console.log('Authentication required, loading orders from localStorage');
        }
        loadOrdersFromLocalStorage();
        return;
      }
      setOrders(response || []);
    } catch (error) {
      console.error('Failed to load orders from API:', error);
      // If API fails (including auth errors), fallback to localStorage
      if (error.message?.includes('Authentication required')) {
        console.log('Authentication required, loading orders from localStorage');
      }
      loadOrdersFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersFromLocalStorage = () => {
    const savedOrders = localStorage.getItem(getOrderKey());
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error parsing saved orders:', error);
        setOrders([]);
      }
    }
  };

  // Save orders to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && orders.length > 0) {
      localStorage.setItem(getOrderKey(), JSON.stringify(orders));
    }
  }, [orders, isAuthenticated]);

  const addOrder = async (orderData) => {
    try {
      setLoading(true);
      
      const newOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isAuthenticated) {
        try {
          // Create order via API
          const response = await orderAPI.createOrder(newOrder);
          // Check if response contains an error
          if (response && response.error) {
            console.error('Failed to create order via API:', response.error);
            if (response.error.includes('Authentication required')) {
              // Create order locally only
            }
            setOrders(prevOrders => [newOrder, ...prevOrders]);
          } else {
            const createdOrder = response || newOrder;
            setOrders(prevOrders => [createdOrder, ...prevOrders]);
          }
        } catch (error) {
          console.error('Failed to create order via API:', error);
          // If API fails (including auth errors), still add to local state to maintain UI consistency
          if (error.message?.includes('Authentication required')) {
            // Create order locally only
          }
          setOrders(prevOrders => [newOrder, ...prevOrders]);
        }
      } else {
        // Add to local state for non-authenticated users
        setOrders(prevOrders => [newOrder, ...prevOrders]);
      }

      // Add notification for new order to user
      addNotification({
        type: 'order',
        title: 'Order Placed Successfully',
        message: `Your order #${newOrder.id.slice(-8)} has been placed and is being processed.`,
        orderId: newOrder.id
      });

      // Notify all admins and superadmins about the new order
      // Only notify other admins if the current user is not an admin
      const currentUser = user;
      const isCurrentUserAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');
      
      if (!isCurrentUserAdmin) {
        const userEmail = getUserEmail();
        const orderTotal = orderData.totals?.total?.toFixed(2) || '0.00';
        
        notifyAdmins({
          type: 'order',
          title: 'New Order Received',
          message: `Order #${newOrder.id.slice(-8)} has been placed by ${userEmail}. Total: $${orderTotal}`,
          orderId: newOrder.id,
          userEmail: userEmail,
          orderTotal: orderTotal,
          orderItems: orderData.items?.length || 0
        });
      }

      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Update order via API
        try {
          const response = await orderAPI.updateOrderStatus(orderId, status);
          // Check if response contains an error
          if (response && response.error) {
            console.error('Failed to update order status via API:', response.error);
            if (response.error.includes('Authentication required')) {
              console.log('Authentication required, updating order status locally only');
            }
          }
        } catch (error) {
          console.error('Failed to update order status via API:', error);
          // If API fails (including auth errors), still update locally to maintain UI consistency
          if (error.message?.includes('Authentication required')) {
            console.log('Authentication required, updating order status locally only');
          }
        }
      }
      
      // Update local state regardless of API success
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );

      // Add notification for status update
      const statusMessages = {
        'pending': 'Your order has been placed and is pending processing.',
        'shipped': 'Your order has been shipped and is on its way!',
        'delivered': 'Your order has been delivered successfully!',
        'cancelled': 'Your order has been cancelled.',
        'processing': 'Your order is being processed.'
      };

      addNotification({
        type: status,
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status] || `Your order status has been updated to ${status}.`,
        orderId: orderId
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = () => {
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const clearCompletedOrders = async () => {
    try {
      if (isAuthenticated) {
        // For authenticated users, try to clear from backend
        try {
          const response = await orderAPI.clearCompletedOrders();
          // Check if response contains an error
          if (response && response.error) {
            console.error('Failed to clear orders from backend:', response.error);
            if (response.error.includes('Authentication required')) {
              console.log('Authentication required, clearing orders locally only');
            } else if (response.error.includes('Order not found')) {
              console.log('Orders already cleared from backend or not found');
            }
          }
        } catch (error) {
          console.error('Failed to clear orders from backend:', error);
          // If backend fails (including auth errors), still clear locally to maintain UI consistency
          if (error.message?.includes('Authentication required')) {
            console.log('Authentication required, clearing orders locally only');
          } else if (error.message?.includes('Order not found')) {
            console.log('Orders already cleared from backend or not found');
          }
        }
      }
      
      // Always clear from local state regardless of API success
      setOrders(prevOrders => prevOrders.filter(order => 
        order.status !== 'cancelled' && order.status !== 'delivered'
      ));
    } catch (error) {
      console.error('Failed to clear completed orders:', error);
      // Even if there's an error, still clear locally to maintain UI consistency
      setOrders(prevOrders => prevOrders.filter(order => 
        order.status !== 'cancelled' && order.status !== 'delivered'
      ));
      // Don't throw the error, just log it and continue
      console.log('Cleared orders locally despite error');
    }
  };

  const refreshOrders = async () => {
    if (isAuthenticated) {
      try {
        await loadOrdersFromAPI();
      } catch (error) {
        console.error('Failed to refresh orders from API:', error);
        // If API fails (including auth errors), fallback to localStorage
        if (error.message?.includes('Authentication required')) {
          console.log('Authentication required, refreshing orders from localStorage');
        }
        loadOrdersFromLocalStorage();
      }
    } else {
      loadOrdersFromLocalStorage();
    }
  };

  const value = {
    orders: getOrders(),
    addOrder,
    updateOrderStatus,
    getOrderById,
    clearCompletedOrders,
    refreshOrders,
    loading
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
} 