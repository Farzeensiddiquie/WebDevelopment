'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useUser } from './UserContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({}); // Track individual operations
  const { user, isAuthenticated } = useUser();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromBackend();
    }
  }, [isAuthenticated]);

  const loadCartFromBackend = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      
      if (response && response.items) {
        setCartItems(response.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Don't clear cart items on error - keep existing items
      // This prevents losing items when there's a network error
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      const newItem = {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size || 'M',
        color: product.color || 'Default',
        quantity: 1
      };

      setCartItems(prev => {
        const existing = prev.find(item => 
          item.id === newItem.id && 
          item.size === newItem.size && 
          item.color === newItem.color
        );

        if (existing) {
          return prev.map(item => 
            item.id === newItem.id && 
            item.size === newItem.size && 
            item.color === newItem.color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, newItem];
        }
      });

      // Sync with backend if authenticated
      if (isAuthenticated) {
        try {
          await cartAPI.addToCart(newItem);
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
        }
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId, size, color) => {
    try {
      console.log('Attempting to remove cart item with ID:', cartItemId);
      console.log('Size:', size, 'Color:', color);
      
      // Set loading state for this specific operation
      setOperationLoading(prev => ({ ...prev, [cartItemId]: true }));
      
      // Optimistically remove from local state
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !((item.id === cartItemId || item._id === cartItemId) && item.size === size && item.color === color)
        )
      );
      
      if (isAuthenticated) {
        // Remove from backend in background
        console.log('Calling backend API to remove cart item');
        try {
          await cartAPI.removeFromCart(cartItemId);
          console.log('Backend API call successful');
        } catch (error) {
          console.error('Failed to remove from backend:', error);
          // Reload cart to sync state
          await loadCartFromBackend();
        }
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Reload cart to sync state on error
      await loadCartFromBackend();
      throw error;
    } finally {
      setOperationLoading(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const updateQuantity = async (cartItemId, size, color, newQuantity) => {
    try {
      // Set loading state for this specific operation
      setOperationLoading(prev => ({ ...prev, [cartItemId]: true }));
      
      // Optimistically update local state
      setCartItems((prev) =>
        prev.map((item) =>
          (item.id === cartItemId || item._id === cartItemId) && item.size === size && item.color === color
            ? { ...item, quantity: Math.max(1, newQuantity) }
            : item
        )
      );
      
      if (isAuthenticated) {
        // Update in backend in background
        try {
          await cartAPI.updateCartItem(cartItemId, newQuantity);
        } catch (error) {
          console.error('Failed to update in backend:', error);
          // Reload cart to sync state
          await loadCartFromBackend();
        }
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      // Reload cart to sync state on error
      await loadCartFromBackend();
      throw error;
    } finally {
      setOperationLoading(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const clearCart = async () => {
    try {
      // Optimistically clear local state
      setCartItems([]);
      
      if (isAuthenticated) {
        // Clear from backend in background
        try {
          await cartAPI.clearCart();
        } catch (error) {
          console.error('Failed to clear from backend:', error);
          // Reload cart to sync state
          await loadCartFromBackend();
        }
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Reload cart to sync state on error
      await loadCartFromBackend();
      throw error;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartTotal,
        getCartItemCount,
        loading,
        operationLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
