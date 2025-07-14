const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cache for API responses to reduce redundant calls
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Request deduplication
const pendingRequests = new Map();

// Helper function to get auth token from cookies
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Try to get token from cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
  }
  return null;
};

// Helper function to set auth token as cookie
const setAuthToken = (token) => {
  if (typeof window !== 'undefined' && token) {
    // Set token as httpOnly cookie (this should be done by the server)
    // For now, we'll use a regular cookie that the server can convert to httpOnly
    document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
  }
};

// Helper function to remove auth token
const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Helper function to create cache key
const createCacheKey = (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${method}:${endpoint}:${body}`;
};

// Helper function to check if cache is valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Generic API request function with caching and deduplication
const apiRequest = async (endpoint, options = {}) => {
  const cacheKey = createCacheKey(endpoint, options);
  
  // Check cache for GET requests
  if (options.method === 'GET' || !options.method) {
    const cached = apiCache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }
  
  // Check if there's already a pending request for this endpoint
  const pendingRequest = pendingRequests.get(cacheKey);
  if (pendingRequest) {
    return pendingRequest;
  }
  
  // Create the request promise
  const requestPromise = (async () => {
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    let retryCount = 0;
    const maxRetries = 3;
    
    // Check if this is an authentication endpoint
    const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    
    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Handle authentication errors specifically - don't throw, return error response
        // But for auth endpoints, allow errors to be thrown
        if (response.status === 401 || response.status === 403) {
          if (isAuthEndpoint) {
            // For auth endpoints, read the error message and throw it
            const responseText = await response.text();
            let responseData;
            try {
              responseData = JSON.parse(responseText);
            } catch (parseError) {
              responseData = { error: responseText || 'Authentication failed' };
            }
            const errorMessage = responseData.error || responseData.message || 'Authentication failed';
            throw new Error(errorMessage);
          } else {
            return { error: 'Authentication required' };
          }
        }
        
        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          retryCount++;
          if (retryCount <= maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.warn(`Rate limited, waiting ${delay}ms before retry ${retryCount}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            throw new Error('Too many requests from this IP, please try again later.');
          }
        }
        
        // Read response body only once and store it
        let responseData;
        const responseText = await response.text();
        
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          // If JSON parsing fails, use the text as error message
          responseData = { error: responseText || 'Invalid response' };
        }
        
        // Check if response is ok
        if (!response.ok) {
          const errorMessage = responseData.error || responseData.message || 'API request failed';
          throw new Error(errorMessage);
        }
        
        // Cache successful GET requests
        if (options.method === 'GET' || !options.method) {
          apiCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now()
          });
        }
        
        return responseData;
      } catch (error) {
        // Don't retry authentication errors
        if (error.message.includes('Authentication required')) {
          return { error: 'Authentication required' };
        }
        
        // Don't retry other errors on last attempt
        if (retryCount === maxRetries) {
          // Don't log authentication errors as they're expected
          if (!error.message.includes('Authentication required')) {
            console.error('API Error:', error);
          }
          throw error;
        }
        
        retryCount++;
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Request failed, retrying in ${delay}ms (${retryCount}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  })();
  
  // Store the pending request
  pendingRequests.set(cacheKey, requestPromise);
  
  try {
    const result = await requestPromise;
    return result;
  } catch (error) {
    // If the request promise throws an error, return an error object
    console.error('API request failed:', error);
    return { error: error.message || 'API request failed' };
  } finally {
    // Remove from pending requests when done
    pendingRequests.delete(cacheKey);
  }
};

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/profile');
  },

  refreshToken: async () => {
    const response = await apiRequest('/auth/refresh', { method: 'POST' });
    return response;
  },
};

// Product APIs
export const productAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/products?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  create: async (productData, imageFile = null) => {
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return await apiRequest('/products', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (id, productData, imageFile = null) => {
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart APIs
export const cartAPI = {
  getCart: async () => {
    return await apiRequest('/cart');
  },

  addToCart: async (item) => {
    return await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return await apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId) => {
    return await apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return await apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: async () => {
    return await apiRequest('/wishlist');
  },

  addToWishlist: async (productId) => {
    return await apiRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  removeFromWishlist: async (productId) => {
    return await apiRequest(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },

  clearWishlist: async () => {
    return await apiRequest('/wishlist', {
      method: 'DELETE',
    });
  },
};

// Order APIs
export const orderAPI = {
  getOrders: async () => {
    return await apiRequest('/orders');
  },

  getAllOrders: async () => {
    return await apiRequest('/orders/admin/all');
  },

  getOrderById: async (orderId) => {
    return await apiRequest(`/orders/${orderId}`);
  },

  createOrder: async (orderData) => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  updateOrderStatus: async (orderId, status) => {
    return await apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  updateOrderStatusAdmin: async (orderId, status) => {
    return await apiRequest(`/orders/admin/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  cancelOrder: async (orderId) => {
    return await apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },

  deleteOrder: async (orderId) => {
    return await apiRequest(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },

  clearCompletedOrders: async () => {
    return await apiRequest('/orders/clear-completed', {
      method: 'DELETE',
    });
  },
};

// Address APIs
export const addressAPI = {
  getAddresses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/addresses?${queryString}`);
  },

  addAddress: async (addressData) => {
    return await apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (addressId, addressData) => {
    return await apiRequest(`/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (addressId) => {
    return await apiRequest(`/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },

  setDefaultAddress: async (addressId) => {
    return await apiRequest(`/addresses/${addressId}/default`, {
      method: 'PUT',
    });
  },

  getDefaultAddresses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/addresses/default?${queryString}`);
  },
};

// Review APIs
export const reviewAPI = {
  getProductReviews: async (productId, options = {}) => {
    const params = new URLSearchParams(options).toString();
    return await apiRequest(`/reviews/product/${productId}?${params}`);
  },

  addReview: async (productId, reviewData) => {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, ...reviewData }),
    });
  },

  updateReview: async (reviewId, reviewData) => {
    return await apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: async (reviewId) => {
    return await apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  deleteReviewAdmin: async (reviewId) => {
    return await apiRequest(`/reviews/${reviewId}/admin`, {
      method: 'DELETE',
    });
  },

  getUserReviews: async (options = {}) => {
    const params = new URLSearchParams(options).toString();
    return await apiRequest(`/reviews/user?${params}`);
  },
};

// User Management APIs
export const userAPI = {
  getAllUsers: async () => {
    return await apiRequest('/users');
  },

  updateUserRole: async (userId, role) => {
    return await apiRequest(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId) => {
    return await apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Search API
export const searchAPI = {
  search: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/search?${queryString}`);
  },
};

// Notifications API
export const notificationAPI = {
  getNotifications: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/notifications?${queryString}`);
  },

  addNotification: async (notificationData) => {
    return await apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  markNotificationAsRead: async (notificationId) => {
    return await apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return await apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },

  deleteNotification: async (notificationId) => {
    return await apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  clearAllNotifications: async () => {
    return await apiRequest('/notifications', {
      method: 'DELETE',
    });
  },

  getUnreadCount: async () => {
    return await apiRequest('/notifications/unread-count');
  },
};

export { getAuthToken, setAuthToken, removeAuthToken }; 