"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
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
  function getWishlistKey() {
    return `wishlist_${getUserEmail()}`;
  }

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(getWishlistKey());
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing saved wishlist:', error);
        setWishlistItems([]);
      }
    }
  }, [user]);

  // Save wishlist to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem(getWishlistKey(), JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (product) => {
    try {
      setLoading(true);
      
      // Check if product is already in wishlist
      const existing = wishlistItems.find(item => 
        item.id === product.id || 
        item._id === product._id || 
        item.productId === product.id || 
        item.productId === product._id
      );
      
      if (existing) {
        return; // Already in wishlist
      }

      const wishlistItem = {
        id: product.id || product._id,
        productId: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        addedAt: new Date().toISOString()
      };

      setWishlistItems(prevItems => [wishlistItem, ...prevItems]);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      
      // Remove from local state
      setWishlistItems(prevItems => 
        prevItems.filter(item => 
          item.id !== productId && 
          item.productId !== productId && 
          item._id !== productId
        )
      );
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.id === productId || 
      item.productId === productId || 
      item._id === productId
    );
  };

  const getWishlistItems = () => {
    return wishlistItems.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      setWishlistItems([]);
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
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