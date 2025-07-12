"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

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

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem(getOrderKey());
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error parsing saved orders:', error);
        setOrders([]);
      }
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem(getOrderKey(), JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getOrders = () => {
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const clearCancelledOrders = () => {
    setOrders(prevOrders => prevOrders.filter(order => order.status !== 'cancelled'));
  };

  const value = {
    orders: getOrders(),
    addOrder,
    updateOrderStatus,
    getOrderById,
    clearCancelledOrders,
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