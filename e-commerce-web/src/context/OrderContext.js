"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useUser } from './UserContext';
import { orderAPI } from '../utils/api';
import { useToast } from './ToastContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addNotification, notifyAdmins } = useNotifications();
  const { user, isAuthenticated } = useUser();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

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

  // Optimistic add order
  const addOrder = async (orderData) => {
    setLoading(true);
    // Map items to have productId as required by backend
    const orderItems = (orderData.items || []).map(item => ({
      productId: item.productId || item.id || item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      size: item.size,
      color: item.color
    }));
    // Validate required fields
    if (!orderItems.length) {
      showToast && showToast('Order must contain at least one item', 'error');
      setLoading(false);
      throw new Error('Order must contain at least one item');
    }
    if (!orderData.shipping || !orderData.totals) {
      showToast && showToast('Shipping and totals information is required', 'error');
      setLoading(false);
      throw new Error('Shipping and totals information is required');
    }
    if (!orderData.payment || !['prepayment', 'cod'].includes(orderData.payment.method)) {
      showToast && showToast('Invalid payment method. Must be "prepayment" or "cod"', 'error');
      setLoading(false);
      throw new Error('Invalid payment method. Must be "prepayment" or "cod"');
    }
    // Construct payload to match backend
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items: orderItems,
      shipping: orderData.shipping,
      payment: orderData.payment,
      totals: orderData.totals,
      shippingMethod: orderData.shippingMethod || 'standard',
      estimatedDelivery: orderData.estimatedDelivery || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Log payload for debugging
    console.log('Creating order with payload:', newOrder);
    // Optimistically update UI
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    try {
      if (isAuthenticated) {
        const response = await orderAPI.createOrder(newOrder);
        console.log('Order API response:', response);
        if (response && response.error) {
          showToast && showToast('Failed to create order via API', 'error');
          setOrders(prevOrders => prevOrders.filter(o => o.id !== newOrder.id));
          throw new Error(response.error);
        } else {
          const createdOrder = response || newOrder;
          setOrders(prevOrders => [createdOrder, ...prevOrders.filter(o => o.id !== newOrder.id)]);
        }
      }
      // Add notification for new order to user
      addNotification({
        type: 'order',
        title: 'Order Placed Successfully',
        message: `Your order #${newOrder.id.slice(-8)} has been placed and is being processed.`,
        orderId: newOrder.id
      });
      // Notify all admins and superadmins about the new order if the current user is NOT an admin
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
      showToast && showToast('Failed to create order', 'error');
      setOrders(prevOrders => prevOrders.filter(o => o.id !== newOrder.id));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Use admin endpoint if user is admin or superadmin
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
          try {
            const response = await orderAPI.updateOrderStatusAdmin(orderId, status);
            if (response && response.error) {
              console.error('Failed to update order status via API:', response.error);
              if (response.error.includes('Authentication required')) {
                console.log('Authentication required, updating order status locally only');
              }
            }
          } catch (error) {
            console.error('Failed to update order status via API:', error);
            if (error.message?.includes('Authentication required')) {
              console.log('Authentication required, updating order status locally only');
            }
          }
        } else {
          // Normal user: use user endpoint
          try {
            const response = await orderAPI.updateOrderStatus(orderId, status);
            if (response && response.error) {
              console.error('Failed to update order status via API:', response.error);
              if (response.error.includes('Authentication required')) {
                console.log('Authentication required, updating order status locally only');
              }
            }
          } catch (error) {
            console.error('Failed to update order status via API:', error);
            if (error.message?.includes('Authentication required')) {
              console.log('Authentication required, updating order status locally only');
            }
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
      // Optimistically update local state
      setOrders(prevOrders => prevOrders.filter(order => 
        order.status !== 'cancelled' && order.status !== 'delivered'
      ));
      if (isAuthenticated) {
        // Call backend to clear orders
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
          try {
            await orderAPI.clearCompletedOrders();
            setTimeout(() => { refreshOrders(); }, 500);
          } catch (error) {
            console.error('Failed to clear orders from backend:', error);
          }
        } else {
          try {
            await orderAPI.clearCompletedOrdersSelf();
            setTimeout(() => { refreshOrders(); }, 500);
          } catch (error) {
            console.error('Failed to clear user orders from backend:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to clear completed orders:', error);
      setOrders(prevOrders => prevOrders.filter(order => 
        order.status !== 'cancelled' && order.status !== 'delivered'
      ));
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
    loading,
    setOrders // Expose setOrders for optimistic UI updates
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