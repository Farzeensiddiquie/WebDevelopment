'use client';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../utils/api';

const UserContext = createContext(null);

// Cache for auth check to prevent excessive API calls
let authCheckCache = null;
let authCheckTimestamp = 0;
const AUTH_CACHE_DURATION = 30 * 1000; // 30 seconds

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const authCheckInProgress = useRef(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple simultaneous auth checks
      if (authCheckInProgress.current) {
        return;
      }
      
      // Check cache first
      const now = Date.now();
      if (authCheckCache && (now - authCheckTimestamp) < AUTH_CACHE_DURATION) {
        setUser(authCheckCache.user);
        setIsAuthenticated(authCheckCache.isAuthenticated);
        setLoading(false);
        setInitialized(true);
        authCheckInProgress.current = false;
        return;
      }
      
      authCheckInProgress.current = true;
      
      try {
        setLoading(true);
        
        const userData = await authAPI.getCurrentUser();
        
        if (userData && userData.user) {
          const authData = {
            user: userData.user,
            isAuthenticated: true
          };
          
          // Cache the result
          authCheckCache = authData;
          authCheckTimestamp = now;
          
          setUser(userData.user);
          setIsAuthenticated(true);
        } else {
          const authData = {
            user: null,
            isAuthenticated: false
          };
          
          // Cache the result
          authCheckCache = authData;
          authCheckTimestamp = now;
          
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        
        // Check if it's a network error or server not running
        if (error.message && (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('fetch'))) {
          const authData = {
            user: null,
            isAuthenticated: false
          };
          
          // Cache the result
          authCheckCache = authData;
          authCheckTimestamp = now;
          
          setUser(null);
          setIsAuthenticated(false);
        } else if (error.message && error.message.includes('Authentication required')) {
          const authData = {
            user: null,
            isAuthenticated: false
          };
          
          // Cache the result
          authCheckCache = authData;
          authCheckTimestamp = now;
          
          setUser(null);
          setIsAuthenticated(false);
        } else {
          const authData = {
            user: null,
            isAuthenticated: false
          };
          
          // Cache the result
          authCheckCache = authData;
          authCheckTimestamp = now;
          
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
        authCheckInProgress.current = false;
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);

      // Check for error in response
      if (!response || response.error) {
        const errorMessage = response?.error || 'Login failed';
        return { success: false, error: errorMessage };
      }

      // Clear auth cache on successful login
      authCheckCache = null;
      authCheckTimestamp = 0;

      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Return the specific error message from the backend
      const errorMessage = error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      // Clear auth cache on successful registration
      authCheckCache = null;
      authCheckTimestamp = 0;
      
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth cache on logout
      authCheckCache = null;
      authCheckTimestamp = 0;
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperadmin = () => {
    return user?.role === 'superadmin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    initialized,
    login,
    register,
    logout,
    updateUser,
    checkServerStatus,
    isAdmin,
    isSuperadmin,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
