"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useUser } from './UserContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useUser();

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistFromBackend();
    }
  }, [isAuthenticated]);

  const loadWishlistFromBackend = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlistItems(response.items || []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (isAuthenticated) {
        // Add to backend
        await wishlistAPI.addToWishlist(product._id || product.id);
        await loadWishlistFromBackend();
      } else {
        // Add to local state for non-authenticated users
        setWishlistItems(prevItems => {
          const existing = prevItems.find(item => item.id === product.id);
          if (existing) {
            return prevItems; // Already in wishlist
          }
          return [...prevItems, { ...product, addedAt: new Date().toISOString() }];
        });
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated) {
        // Remove from backend
        await wishlistAPI.removeFromWishlist(productId);
        await loadWishlistFromBackend();
      } else {
        // Remove from local state
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId || item.productId === productId);
  };

  const getWishlistItems = () => {
    return wishlistItems.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  };

  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        // Clear from backend
        await wishlistAPI.clearWishlist();
        setWishlistItems([]);
      } else {
        // Clear local state
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      throw error;
    }
  };

  const value = {
    wishlistItems: getWishlistItems(),
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    loading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext); 