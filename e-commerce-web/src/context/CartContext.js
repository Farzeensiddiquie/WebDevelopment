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
      setCartItems(response.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      if (isAuthenticated) {
        // Optimistically update local state
        const newItem = {
          id: `temp-${Date.now()}`, // Temporary ID
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1,
          size: product.size,
          color: product.color
        };

        setCartItems((prev) => {
          const existing = prev.find(
            (item) =>
              (item.productId === newItem.productId) &&
              item.size === product.size &&
              item.color === product.color
          );

          if (existing) {
            return prev.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            );
          }

          return [...prev, newItem];
        });

        // Sync with backend in background
        try {
          await cartAPI.addToCart({
            productId: product._id || product.id,
            quantity: product.quantity || 1,
            size: product.size,
            color: product.color
          });
          // Reload to get proper IDs from backend
          await loadCartFromBackend();
        } catch (error) {
          console.error('Failed to sync with backend:', error);
          // Optionally revert on error
        }
      } else {
        // Add to local state for non-authenticated users
        setCartItems((prev) => {
          const existing = prev.find(
            (item) =>
              (item.id === product.id || item._id === product.id) &&
              item.size === product.size &&
              item.color === product.color
          );

          if (existing) {
            return prev.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            );
          }

          return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
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
