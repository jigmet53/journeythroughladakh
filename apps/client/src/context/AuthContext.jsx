import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, setAccessToken, clearAccessToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on mount (try to refresh token)
  useEffect(() => {
    loadUser();
  }, []);

  // Load user data (will automatically try to refresh if needed)
  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // If refresh fails, user stays logged out
      setUser(null);
      setIsAuthenticated(false);
      clearAccessToken();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);

      if (response.data.success) {
        // Access token is already stored in memory by authAPI.login
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register(username, email, password);

      if (response.data.success) {
        // Access token is already stored in memory by authAPI.register
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      clearAccessToken(); // Clear from memory
    }
  };

  // Logout from all devices
  const logoutAll = async () => {
    try {
      await authAPI.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      clearAccessToken();
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.updatePassword(currentPassword, newPassword);
      
      if (response.data.success) {
        // New access token is automatically set by the response
        setAccessToken(response.data.accessToken);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update password.',
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    logoutAll,
    isAdmin,
    updatePassword,
    loadUser, // Expose for manual refresh if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
