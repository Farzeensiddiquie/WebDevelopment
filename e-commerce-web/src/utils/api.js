const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper function to remove auth token
const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/profile');
  },

  refreshToken: async () => {
    const response = await apiRequest('/auth/refresh', { method: 'POST' });
    if (response.token) {
      setAuthToken(response.token);
    }
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

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
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

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
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

  getOrderById: async (orderId) => {
    return await apiRequest(`/orders/${orderId}`);
  },

  createOrder: async (orderData) => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};

// Address APIs
export const addressAPI = {
  getAddresses: async () => {
    return await apiRequest('/addresses');
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
};

// Review APIs
export const reviewAPI = {
  getProductReviews: async (productId) => {
    return await apiRequest(`/reviews/product/${productId}`);
  },

  addReview: async (productId, reviewData) => {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, ...reviewData }),
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

export { getAuthToken, setAuthToken, removeAuthToken }; 