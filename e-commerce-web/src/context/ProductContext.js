'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productAPI } from '../utils/api';
import { useToast } from './ToastContext';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const { showToast } = useToast();

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchProducts = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Check if we have cached data and it's still valid
    if (!force && products.length > 0 && lastFetched && (now - lastFetched) < CACHE_DURATION) {
      return products;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getAll({ limit: 100 });
      const fetchedProducts = response.data || [];
      
      setProducts(fetchedProducts);
      setLastFetched(now);
      
      return fetchedProducts;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error.message);
      showToast('Failed to load products', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [products.length, lastFetched, showToast]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []); // Only run once on mount

  const refreshProducts = useCallback(() => {
    return fetchProducts(true);
  }, [fetchProducts]);

  const getProductsByCategory = useCallback((category) => {
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
  }, [products]);

  const searchProducts = useCallback((query) => {
    if (!query) return products;
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  }, [products]);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    refreshProducts,
    getProductsByCategory,
    searchProducts,
    lastFetched
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 