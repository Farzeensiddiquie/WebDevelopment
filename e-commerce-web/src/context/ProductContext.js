'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const hasInitialized = useRef(false);

  // Cache duration: 10 minutes (increased from 5 minutes)
  const CACHE_DURATION = 10 * 60 * 1000;

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
      
      // Check if response contains an error
      if (response && response.error) {
        console.error('Failed to fetch products:', response.error);
        
        // Only show toast for non-authentication errors
        if (!response.error.includes('Authentication required')) {
          showToast('Failed to load products', 'error');
        }
        
        // Return empty array for authentication errors to prevent crashes
        if (response.error.includes('Authentication required')) {
          setProducts([]);
          setLastFetched(now);
          return [];
        }
        
        // Check if it's a network/server error
        if (response.error.includes('Failed to fetch') || 
            response.error.includes('NetworkError') ||
            response.error.includes('fetch')) {
          // Try to load from localStorage as fallback
          try {
            const savedProducts = localStorage.getItem('products');
            if (savedProducts) {
              const parsedProducts = JSON.parse(savedProducts);
              setProducts(parsedProducts);
              setLastFetched(now);
              return parsedProducts;
            }
          } catch (parseError) {
            console.error('Failed to parse saved products:', parseError);
          }
        }
        
        // For other errors, set error state and return empty array
        setError(response.error);
        setProducts([]);
        setLastFetched(now);
        return [];
      }
      
      // Check if response is undefined or null
      if (!response) {
        // Try to load from localStorage as fallback
        try {
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts);
            setProducts(parsedProducts);
            setLastFetched(now);
            return parsedProducts;
          }
        } catch (parseError) {
          console.error('Failed to parse saved products:', parseError);
        }
        
        // If no localStorage data, set empty array and continue
        setProducts([]);
        setLastFetched(now);
        return [];
      }
      
      // Handle the response data
      const fetchedProducts = response.data || response || [];
      
      setProducts(fetchedProducts);
      setLastFetched(now);
      
      return fetchedProducts;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      
      // Check if it's a network/server error
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('NetworkError') ||
          error.message?.includes('fetch') ||
          error.message?.includes('No response received')) {
        // Try to load from localStorage as fallback
        try {
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts);
            setProducts(parsedProducts);
            setLastFetched(now);
            return parsedProducts;
          }
        } catch (parseError) {
          console.error('Failed to parse saved products:', parseError);
        }
        
        // Set empty array and continue
        setProducts([]);
        setLastFetched(now);
        return [];
      }
      
      // For other errors, set error state but don't throw
      setError(error.message);
      
      // Only show toast for non-rate-limit errors
      if (!error.message.includes('Too many requests')) {
        showToast('Failed to load products', 'error');
      }
      
      // Set empty array and continue
      setProducts([]);
      setLastFetched(now);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial fetch - only run once on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchProducts();
    }
  }, [fetchProducts]);

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

  const updateProductRating = useCallback((productId, newRating, newNumReviews) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product._id === productId || product.id === productId
          ? { ...product, rating: newRating, numReviews: newNumReviews }
          : product
      )
    );
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    refreshProducts,
    getProductsByCategory,
    searchProducts,
    updateProductRating,
    lastFetched
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 