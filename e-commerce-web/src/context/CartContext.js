'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({}); // Track individual operations
  const { user, isAuthenticated } = useUser();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  // Load cart from localStorage for guests on mount
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('guest_cart');
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {
          setCartItems([]);
        }
      }
    }
  }, [isAuthenticated]);

  // On login, merge guest cart with backend cart, then clear guest cart
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      const mergeGuestCart = async () => {
        const guestCart = window.localStorage.getItem('guest_cart');
        if (guestCart) {
          let guestItems = [];
          try {
            guestItems = JSON.parse(guestCart);
          } catch (e) {}
          if (guestItems.length > 0) {
            // Merge guest items into backend cart
            for (const item of guestItems) {
              try {
                await cartAPI.addToCart({
                  productId: item.productId || item.id || item._id,
                  quantity: item.quantity || 1,
                  size: item.size || 'M',
                  color: item.color || 'Default'
                });
              } catch (e) {
                console.error('Failed to merge guest cart item:', item, e);
              }
            }
          }
          window.localStorage.removeItem('guest_cart');
        }
        // Always load backend cart after merging
        await loadCartFromBackend();
      };
      mergeGuestCart();
    }
  }, [isAuthenticated]);

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

  // Helper: Save cart to localStorage for guests
  const saveGuestCart = (items) => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.localStorage.setItem('guest_cart', JSON.stringify(items));
    }
  };

  // Optimistic add to cart
  const addToCart = async (product) => {
    const newItem = {
      productId: product._id || product.id,
      quantity: 1,
      size: product.size || 'M',
      color: product.color || 'Default',
      name: product.name,
      price: product.price,
      image: product.image
    };
    let updatedCart;
    setCartItems(prev => {
      const existing = prev.find(item =>
        (item.productId === newItem.productId) &&
        item.size === newItem.size &&
        item.color === newItem.color
      );
      if (existing) {
        updatedCart = prev.map(item =>
          (item.productId === newItem.productId) &&
          item.size === newItem.size &&
          item.color === newItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      } else {
        updatedCart = [...prev, newItem];
        return updatedCart;
      }
    });
    saveGuestCart(updatedCart);
    if (isAuthenticated) {
      try {
        await cartAPI.addToCart({
          productId: newItem.productId,
          quantity: 1,
          size: newItem.size,
          color: newItem.color
        });
      } catch (error) {
        showToast && showToast('Failed to sync cart with backend', 'error');
        await loadCartFromBackend();
      }
    }
  };

  // Optimistic remove from cart
  const removeFromCart = async (cartItemId, size, color) => {
    let prevCart = cartItems;
    setOperationLoading(prev => ({ ...prev, [cartItemId]: true }));
    setCartItems((prev) => {
      const updated = prev.filter(
        (item) =>
          !((item.id === cartItemId || item._id === cartItemId || item.productId === cartItemId) && item.size === size && item.color === color)
      );
      saveGuestCart(updated);
      return updated;
    });
    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(cartItemId);
      } catch (error) {
        showToast && showToast('Failed to remove from backend', 'error');
        await loadCartFromBackend();
      }
    }
    setOperationLoading(prev => ({ ...prev, [cartItemId]: false }));
  };

  // Optimistic update quantity
  const updateQuantity = async (cartItemId, size, color, newQuantity) => {
    setOperationLoading(prev => ({ ...prev, [cartItemId]: true }));
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        (item.id === cartItemId || item._id === cartItemId || item.productId === cartItemId) && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
      saveGuestCart(updated);
      return updated;
    });
    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem(cartItemId, newQuantity);
      } catch (error) {
        showToast && showToast('Failed to update in backend', 'error');
        await loadCartFromBackend();
      }
    }
    setOperationLoading(prev => ({ ...prev, [cartItemId]: false }));
  };

  // Optimistic clear cart
  const clearCart = async () => {
    let prevCart = cartItems;
    setCartItems([]);
    saveGuestCart([]);
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
      } catch (error) {
        showToast && showToast('Failed to clear cart in backend', 'error');
        await loadCartFromBackend();
      }
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

  // Save cart to localStorage for guests after every update
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

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
