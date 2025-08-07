'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import { productAPI, orderAPI, userAPI, notificationAPI } from '../../utils/api';
import ProgressLink from '../../components/ProgressLink';
import { Package, Users, Settings, Clock, CheckCircle, Truck, XCircle, Bell, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, isSuperadmin, loading, initialized } = useUser();
  const { getCurrentScheme } = useTheme();
  const { showToast } = useToast();
  const { addNotification, unreadCount,loadNotifications } = useNotifications();
  const router = useRouter();
  const scheme = getCurrentScheme();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    brand: '',
    category: 'men',
    stock: '',
    sizes: [],
    colors: [],
    sku: ''
  });
  // Replace single image state with multiple images
  const [selectedImages, setSelectedImages] = useState([]); // Array of File or string (for existing images)
  const [imagePreviews, setImagePreviews] = useState([]); // Array of preview URLs

  // Global notification state
  const [globalNotifTitle, setGlobalNotifTitle] = useState('');
  const [globalNotifMessage, setGlobalNotifMessage] = useState('');
  const [sendingGlobalNotif, setSendingGlobalNotif] = useState(false);

  // Add state for color and size inputs (move to top of component)
  const [sizeInput, setSizeInput] = useState('');
  const [colorNameInput, setColorNameInput] = useState('');
  const [colorHexInput, setColorHexInput] = useState('#000000');

  // Show loading state if not initialized
  if (!initialized) {
    return (
      <div className={`min-h-screen ${scheme.background} ${scheme.text}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  useEffect(() => {
    if (initialized && !loading && (!user || !isAdmin())) {
      router.push('/login');
    }
  }, [user, loading, initialized, router]);

  // Load all data when component mounts
  useEffect(() => {
    if (user && isAdmin()) {
      loadProducts();
      loadOrders();
      loadUsers();
    }
  }, [user]);

  // Load admin notifications when component mounts
  useEffect(() => {
    if (user && isAdmin()) {
      loadNotifications();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productAPI.getAll({ limit: 100 });
      
      // Check if response contains an error
      if (response && response.error) {
        console.error('Failed to load products:', response.error);
        if (response.error.includes('Authentication required')) {
          // Load products from localStorage as fallback
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            try {
              const parsedProducts = JSON.parse(savedProducts);
              setProducts(parsedProducts);
            } catch (parseError) {
              console.error('Failed to parse saved products:', parseError);
              setProducts([]);
            }
          } else {
            setProducts([]);
          }
        } else {
          showToast('Failed to load products', 'error');
          setProducts([]);
        }
      } else {
        // Handle the response data
        const productsData = response.data || response || [];
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast('Failed to load products', 'error');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      // Get all orders from API for admin
      const response = await orderAPI.getAllOrders();
      setOrders(response || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userAPI.getAllUsers();
      console.log('Users API response:', response);
      setUsers(response || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, userEmail) => {
    // Find the order first
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      showToast('Order not found', 'error');
      return;
    }

    // Save previous status for possible revert
    const previousStatus = order.status;
    const previousUpdatedAt = order.updatedAt;

    // Optimistically update local state
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );

    try {
      await orderAPI.updateOrderStatusAdmin(orderId, newStatus);
      // Optionally, re-fetch orders for consistency
      // await loadOrders();

      // Add notification for the user
      const notification = {
        type: newStatus === 'cancelled' ? 'cancelled' : 'order',
        title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        message: `Your order #${orderId.slice(-8)} has been ${newStatus}`,
        orderId: orderId,
        userEmail: userEmail
      };
      // Store notification in localStorage for the user
      try {
        const userNotificationsKey = `notifications_${userEmail}`;
        let userNotifications = [];
        try {
          const savedNotifications = localStorage.getItem(userNotificationsKey);
          if (savedNotifications) {
            const parsed = JSON.parse(savedNotifications);
            if (Array.isArray(parsed)) {
              userNotifications = parsed;
            } else {
              localStorage.removeItem(userNotificationsKey);
            }
          }
        } catch (parseError) {
          console.error('Failed to parse user notifications:', parseError);
          localStorage.removeItem(userNotificationsKey);
        }
        userNotifications.unshift({
          id: Date.now(),
          ...notification,
          timestamp: new Date().toISOString(),
          read: false
        });
        localStorage.setItem(userNotificationsKey, JSON.stringify(userNotifications));
      } catch (error) {
        console.error('Failed to save user notification:', error);
      }

     

      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      // Revert optimistic update on error
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: previousStatus, updatedAt: previousUpdatedAt }
            : order
        )
      );
      console.error('Failed to update order status:', error);
      if (error.message?.includes('Order not found')) {
        showToast('Order not found in database. This order may have been created locally.', 'error');
      } else if (error.message?.includes('Access denied')) {
        showToast('Access denied. You may not have permission to update this order.', 'error');
      } else {
        showToast('Failed to update order status', 'error');
      }
    }
  };

  const processRefund = async (orderId, userEmail) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order || order.status !== 'cancelled' || order.payment?.method !== 'prepayment') {
        showToast('Cannot process refund for this order', 'error');
        return;
      }

      // Update refund status
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                refund: { 
                  ...order.refund, 
                  status: 'processed',
                  processedAt: new Date().toISOString()
                }
              }
            : order
        )
      );

      // Add notification for refund
      const notification = {
        type: 'refund',
        title: 'Refund Processed',
        message: `Your refund of $${order.refund?.amount?.toFixed(2) || '0.00'} has been processed for order #${orderId.slice(-8)}`,
        orderId: orderId,
        userEmail: userEmail
      };
      
      try {
        const userNotificationsKey = `notifications_${userEmail}`;
        let userNotifications = [];
        
        try {
          const savedNotifications = localStorage.getItem(userNotificationsKey);
          if (savedNotifications) {
            const parsed = JSON.parse(savedNotifications);
            if (Array.isArray(parsed)) {
              userNotifications = parsed;
            } else {
              localStorage.removeItem(userNotificationsKey);
            }
          }
        } catch (parseError) {
          console.error('Failed to parse user notifications for refund:', parseError);
          localStorage.removeItem(userNotificationsKey);
        }
        
        userNotifications.unshift({
          id: Date.now(),
          ...notification,
          timestamp: new Date().toISOString(),
          read: false
        });
        localStorage.setItem(userNotificationsKey, JSON.stringify(userNotifications));
      } catch (error) {
        console.error('Failed to save refund notification:', error);
      }

      // Also notify admins about the refund
      addNotification({
        type: 'refund',
        title: 'Refund Processed',
        message: `Refund processed for order #${orderId.slice(-8)}`,
        orderId: orderId
      });

      showToast('Refund processed successfully', 'success');
    } catch (error) {
      console.error('Failed to process refund:', error);
      showToast('Failed to process refund', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-orange-500';
      case 'processing':
        return 'text-yellow-500';
      case 'shipped':
        return 'text-blue-500';
      case 'delivered':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  // Helper functions for user management
  const getAllUsers = () => {
    const users = [];
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key === 'user_profile') {
        try {
          const userProfile = JSON.parse(localStorage.getItem(key));
          if (userProfile && userProfile.email) {
            users.push({
              name: userProfile.name || 'Unknown User',
              email: userProfile.email,
              role: userProfile.role || 'user'
            });
          }
        } catch (error) {
          console.error('Error parsing user profile:', error);
        }
      }
    }
    
    // Add admin user
    users.push({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      role: 'admin'
    });
    
    return users;
  };

  const promoteToAdmin = async (userId) => {
    try {
      await userAPI.updateUserRole(userId, 'admin');
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: 'admin' }
            : user
        )
      );
      
      showToast('User promoted to admin', 'success');
    } catch (error) {
      console.error('Failed to promote user:', error);
      // Handle specific error messages
      if (error.message?.includes('Only superadmin can change user roles')) {
        showToast('Only superadmin can change user roles', 'error');
      } else {
        showToast('Failed to promote user', 'error');
      }
    }
  };

  const demoteFromAdmin = async (userId) => {
    try {
      await userAPI.updateUserRole(userId, 'user');
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: 'user' }
            : user
        )
      );
      
      showToast('User demoted from admin', 'success');
    } catch (error) {
      console.error('Failed to demote user:', error);
      // Handle specific error messages
      if (error.message?.includes('Only superadmin can change user roles')) {
        showToast('Only superadmin can change user roles', 'error');
      } else {
        showToast('Failed to demote user', 'error');
      }
    }
  };

  const clearCompletedOrders = async () => {
    if (!window.confirm('Are you sure you want to clear all delivered and cancelled orders? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await orderAPI.clearCompletedOrders();
      showToast(`Cleared ${response.deletedCount} completed orders`, 'success');
      // Add notification for the action
      addNotification({
        type: 'admin',
        title: 'Orders Cleared',
        message: `Admin cleared ${response.deletedCount} completed orders`,
        timestamp: new Date().toISOString()
      });
      // Always reload orders after clearing
      await loadOrders();
    } catch (error) {
      console.error('Failed to clear completed orders:', error);
      showToast('Failed to clear completed orders', 'error');
      // Still try to reload orders to sync UI
      await loadOrders();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setSelectedImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
        stock: parseInt(formData.stock),
        sizes: formData.sizes,
        colors: formData.colors,
        sku: formData.sku || undefined
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData, selectedImages);
        showToast('Product updated successfully', 'success');
      } else {
        await productAPI.create(productData, selectedImages);
        showToast('Product created successfully', 'success');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        brand: '',
        category: 'men',
        stock: '',
        sizes: [],
        colors: [],
        sku: ''
      });
      setSelectedImages([]);
      setImagePreviews([]);
      setEditingProduct(null);
      setShowAddForm(false);
      loadProducts();
    } catch (error) {
      showToast(error.message || 'Failed to save product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
      brand: product.brand,
      category: product.category,
      stock: product.stock.toString(),
      sizes: product.sizes || [],
      colors: product.colors || [],
      sku: product.sku || ''
    });
    // product.images is assumed to be an array; fallback to [product.image] for backward compatibility
    const images = product.images && product.images.length ? product.images : (product.image ? [product.image] : []);
    setSelectedImages(images);
    setImagePreviews(images);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        showToast('Product deleted successfully', 'success');
        loadProducts();
      } catch (error) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      brand: '',
      category: 'men',
      stock: '',
      sizes: [],
      colors: [],
      sku: ''
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSendGlobalNotification = async (e) => {
    e.preventDefault();
    if (!globalNotifTitle.trim() || !globalNotifMessage.trim()) {
      showToast('Title and message are required', 'error');
      return;
    }
    setSendingGlobalNotif(true);
    try {
      const response = await notificationAPI.sendGlobalNotification({
        title: globalNotifTitle,
        message: globalNotifMessage,
      });
      if (response && response.success) {
        showToast('Global notification sent to all users', 'success');
        setGlobalNotifTitle('');
        setGlobalNotifMessage('');
      } else {
        showToast(response?.error || 'Failed to send global notification', 'error');
      }
    } catch (error) {
      showToast('Failed to send global notification', 'error');
    } finally {
      setSendingGlobalNotif(false);
    }
  };

  if (loading || !initialized) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || !isAdmin()) {
    return null; // Will redirect
  }

  return (
    <div className={`min-h-screen ${scheme.background} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${scheme.text} mb-2`}>Admin Dashboard</h1>
            <p className={`${scheme.textSecondary} text-lg`}>Manage your store operations</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <ProgressLink
              href="/notifications"
              className={`${scheme.card} ${scheme.text} px-4 py-2 rounded-lg border ${scheme.border} hover:${scheme.hover} transition-all duration-200 shadow-lg hover:shadow-xl relative`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </ProgressLink>
            


            <ProgressLink
              href="/"
              className={`${scheme.card} ${scheme.text} px-6 py-3 rounded-xl border ${scheme.border} hover:${scheme.hover} transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              Back to Store
            </ProgressLink>
          </div>
        </div>

        {/* Global Notification Form (Admins only) */}
        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <div className="mb-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">Send Global Notification to All Users</h3>
            <form onSubmit={handleSendGlobalNotification} className="flex flex-col gap-2 md:flex-row md:items-end">
              <input
                type="text"
                placeholder="Notification Title"
                value={globalNotifTitle}
                onChange={e => setGlobalNotifTitle(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="text"
                placeholder="Notification Message"
                value={globalNotifMessage}
                onChange={e => setGlobalNotifMessage(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button
                type="submit"
                disabled={sendingGlobalNotif}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold"
              >
                {sendingGlobalNotif ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${scheme.card} p-6 rounded-2xl border ${scheme.border} shadow-lg hover:shadow-xl transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${scheme.textSecondary} mb-1`}>Total Products</p>
                <p className={`text-3xl font-bold ${scheme.text}`}>{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${scheme.card} p-6 rounded-2xl border ${scheme.border} shadow-lg hover:shadow-xl transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${scheme.textSecondary} mb-1`}>Total Orders</p>
                <p className={`text-3xl font-bold ${scheme.text}`}>{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${scheme.card} p-6 rounded-2xl border ${scheme.border} shadow-lg hover:shadow-xl transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${scheme.textSecondary} mb-1`}>Total Users</p>
                <p className={`text-3xl font-bold ${scheme.text}`}>{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className={`${scheme.card} p-6 rounded-2xl border ${scheme.border} shadow-lg hover:shadow-xl transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${scheme.textSecondary} mb-1`}>Pending Orders</p>
                <p className={`text-3xl font-bold ${scheme.text}`}>
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? `${scheme.accent} text-white shadow-lg`
                    : `${scheme.textSecondary} hover:${scheme.text} hover:bg-white dark:hover:bg-gray-700`
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Add Product Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className={`${scheme.accent} ${scheme.text} px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition`}
              >
                {editingProduct ? 'Cancel Edit' : 'Add New Product'}
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
              <div className={`${scheme.card} p-6 rounded-lg border ${scheme.border} mb-8`}>
                <h2 className={`text-xl font-semibold ${scheme.text} mb-4`}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        required
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        step="0.01"
                        min="0"
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Old Price (for sales, optional)
                      </label>
                      <input
                        type="number"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
                        step="0.01"
                        min="0"
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        required
                        min="0"
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        SKU (optional, unique)
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Sizes (comma separated, e.g. S,M,L)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sizeInput}
                          onChange={e => setSizeInput(e.target.value)}
                          placeholder="Add size"
                          className={`flex-1 rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border}`}
                        />
                        <button type="button" onClick={() => {
                          if (sizeInput && !formData.sizes.includes(sizeInput)) {
                            setFormData({ ...formData, sizes: [...formData.sizes, sizeInput] });
                            setSizeInput('');
                          }
                        }} className={`${scheme.accent} ${scheme.text} px-3 py-1 rounded`}>Add</button>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {formData.sizes.map((size, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                            {size}
                            <button type="button" onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) })} className="ml-1 text-red-500">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Colors (name + hex, e.g. Red #ff0000)
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={colorNameInput}
                          onChange={e => setColorNameInput(e.target.value)}
                          placeholder="Color name"
                          className={`flex-1 rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border}`}
                        />
                        <input
                          type="color"
                          value={colorHexInput}
                          onChange={e => setColorHexInput(e.target.value)}
                          className="w-10 h-10 p-0 border-0"
                        />
                        <button type="button" onClick={() => {
                          if (colorNameInput && colorHexInput) {
                            setFormData({ ...formData, colors: [...formData.colors, { name: colorNameInput, hex: colorHexInput }] });
                            setColorNameInput('');
                            setColorHexInput('#000000');
                          }
                        }} className={`${scheme.accent} ${scheme.text} px-3 py-1 rounded`}>Add</button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {formData.colors.map((color, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                            {color.name} <span style={{ background: color.hex, width: 16, height: 16, display: 'inline-block', borderRadius: 4, marginLeft: 4 }}></span>
                            <button type="button" onClick={() => setFormData({ ...formData, colors: formData.colors.filter((c, i) => i !== idx) })} className="ml-1 text-red-500">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                        Product Images (up to 4)
                      </label>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required={!editingProduct && selectedImages.length === 0}
                        className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                        max={4}
                      />
                      {imagePreviews.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition"
                                title="Remove image"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows="3"
                      className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className={`${scheme.accent} ${scheme.text} px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition`}
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`${scheme.card} ${scheme.text} px-6 py-2 rounded-lg border ${scheme.border} font-semibold hover:${scheme.hover} transition`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className={`${scheme.card} rounded-lg border ${scheme.border} overflow-hidden`}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className={`text-lg font-semibold ${scheme.text}`}>Products ({products.length})</h3>
              </div>
              {loadingProducts ? (
                <div className="p-6 text-center">
                  <p className={scheme.textSecondary}>Loading products...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${scheme.card} border-b ${scheme.border}`}>
                      <tr>
                        <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Product</th>
                        <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Brand</th>
                        <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Category</th>
                        <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Price</th>
                        <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Stock</th>
                        <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className={`border-b ${scheme.border} hover:${scheme.hover}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                              />
                              <div>
                                <p className={`${scheme.text} font-medium`}>{product.name}</p>
                                <p className={`${scheme.textSecondary} text-sm`}>{product.description.substring(0, 50)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className={`py-4 px-6 ${scheme.text}`}>{product.brand}</td>
                          <td className={`py-4 px-6 ${scheme.text}`}>{product.category}</td>
                          <td className={`py-4 px-6 ${scheme.text}`}>${product.price}</td>
                          <td className={`py-4 px-6 ${scheme.text}`}>{product.stock}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className={`${scheme.accent} ${scheme.text} px-3 py-1 rounded text-sm hover:opacity-90 transition`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className={`${scheme.card} rounded-2xl shadow-lg border ${scheme.border} overflow-hidden`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-2xl font-bold ${scheme.text} mb-2`}>Order Management</h3>
                  <p className={`${scheme.textSecondary}`}>Manage all customer orders and track their status</p>
                </div>
                <button
                  onClick={clearCompletedOrders}
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2`}
                  title="Clear delivered and cancelled orders"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Completed Orders
                </button>
              </div>
            </div>
            
            {loadingOrders ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className={`${scheme.textSecondary}`}>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className={`text-lg font-semibold ${scheme.text} mb-2`}>No orders yet</h4>
                <p className={`${scheme.textSecondary}`}>Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`bg-gray-50 dark:bg-gray-800 ${scheme.border}`}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                      <tr key={order.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150`}>
                        <td className="px-6 py-4">
                          <span className={`font-mono text-sm ${scheme.text} bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg`}>
                            #{order.id.slice(-8)}
                          </span>
                        </td>
                        <td className={`py-4 px-6 ${scheme.textSecondary} text-sm`}>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{order.userName || 'Unknown User'}</p>
                            <p className="text-xs text-gray-500">{order.userEmail}</p>
                            {order.shipping?.phone && (
                              <p className="text-xs text-gray-500">📞 {order.shipping.phone}</p>
                            )}
                            {order.shipping?.address && (
                              <p className="text-xs text-gray-500">📍 {order.shipping.address}</p>
                            )}
                            {order.shipping?.zipCode && (
                              <p className="text-xs text-gray-500">📮 {order.shipping.zipCode}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          {/* Payment Status */}
                          <div className="mt-1">
                            {order.payment?.method === 'cod' ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                Cash on Delivery
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Pre-paid
                              </span>
                            )}
                            {/* Show refund info for cancelled prepaid orders */}
                            {order.status === 'cancelled' && order.payment?.method === 'prepayment' && order.refund && (
                              <div className="mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                  Refund: ${order.refund.amount?.toFixed(2)} (Pending)
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={`py-4 px-6 ${scheme.text} font-semibold`}>
                          ${order.totals?.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className={`py-4 px-6 ${scheme.textSecondary} text-sm`}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'processing', order.userEmail)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  Process
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled', order.userEmail)}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {order.status === 'processing' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'shipped', order.userEmail)}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  Ship
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled', order.userEmail)}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {order.status === 'shipped' && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered', order.userEmail)}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  Mark Delivered
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'cancelled', order.userEmail)}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {order.status === 'cancelled' && (
                              <>
                                <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm">
                                  Cancelled
                                </span>
                                {order.payment?.method === 'prepayment' && order.refund?.status === 'pending' && (
                                  <button
                                    onClick={() => processRefund(order.id, order.userEmail)}
                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                  >
                                    Process Refund
                                  </button>
                                )}
                                {order.payment?.method === 'prepayment' && order.refund?.status === 'processed' && (
                                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                                    Refund Processed
                                  </span>
                                )}
                              </>
                            )}
                            {order.status === 'delivered' && (
                              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                                Delivered
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={`${scheme.card} p-6 rounded-lg border ${scheme.border}`}>
            <h3 className={`text-lg font-semibold ${scheme.text} mb-4`}>Admin Settings</h3>
            
            {/* Current Admin Info */}
            <div className="mb-6">
              <h4 className={`text-md font-semibold ${scheme.text} mb-4`}>Current Admin</h4>
              <div className={`${scheme.card} p-4 rounded border ${scheme.border}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <p className={`font-medium ${scheme.text}`}>{user?.name || 'Admin User'}</p>
                    <p className={`text-sm ${scheme.textSecondary}`}>{user?.email || 'admin@ecommerce.com'}</p>
                    <div className="flex gap-2 mt-1">
                      {isSuperadmin() && (
                        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Superadmin
                        </span>
                      )}
                      {isAdmin() && !isSuperadmin() && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Management Section */}
            <div className="mb-8">
              <h4 className={`text-md font-semibold ${scheme.text} mb-4`}>User Management</h4>
              <div className={`${scheme.card} p-4 rounded border ${scheme.border}`}>
                <p className={`${scheme.textSecondary} mb-4`}>
                  {isSuperadmin() 
                    ? 'Manage user roles and permissions. You can promote users to admin status.'
                    : 'View user information. Only superadmin can change user roles.'
                  }
                </p>
                
                {/* User List */}
                {loadingUsers ? (
                  <div className="text-center py-4">
                    <p className={scheme.textSecondary}>Loading users...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((userItem) => (
                      <div key={userItem.id} className={`flex items-center justify-between p-3 rounded border ${scheme.border}`}>
                        <div>
                          <p className={`font-medium ${scheme.text}`}>{userItem.name}</p>
                          <p className={`text-sm ${scheme.textSecondary}`}>{userItem.email}</p>
                          <div className="flex gap-2 mt-1">
                            {userItem.role === 'superadmin' && (
                              <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Superadmin
                              </span>
                            )}
                            {userItem.role === 'admin' && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Admin
                              </span>
                            )}
                            {userItem.role === 'user' && (
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                User
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${
                              userItem.isActive 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {userItem.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {userItem.ordersCount > 0 && (
                              <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                {userItem.ordersCount} orders
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {/* Only show role change buttons to superadmin */}
                          {isSuperadmin() && userItem.role !== 'superadmin' && userItem.id !== user?.id && (
                            <>
                              {userItem.role !== 'admin' ? (
                                <button
                                  onClick={() => promoteToAdmin(userItem.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                                >
                                  Make Admin
                                </button>
                              ) : (
                                <button
                                  onClick={() => demoteFromAdmin(userItem.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                                >
                                  Remove Admin
                                </button>
                              )}
                            </>
                          )}
                          {/* Show current user indicator */}
                          {userItem.id === user?.id && (
                            <span className="px-3 py-1 bg-green-400 text-white rounded text-sm">
                              Current User
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* System Information */}
            <div className="mb-8">
              <h4 className={`text-md font-semibold ${scheme.text} mb-4`}>System Information</h4>
              <div className={`${scheme.card} p-4 rounded border ${scheme.border}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${scheme.textSecondary}`}>Total Products</p>
                    <p className={`text-lg font-semibold ${scheme.text}`}>{products.length}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${scheme.textSecondary}`}>Total Orders</p>
                    <p className={`text-lg font-semibold ${scheme.text}`}>{orders.length}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${scheme.textSecondary}`}>Total Users</p>
                    <p className={`text-lg font-semibold ${scheme.text}`}>{users.length}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${scheme.textSecondary}`}>Admin Users</p>
                    <p className={`text-lg font-semibold ${scheme.text}`}>
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className={`text-md font-semibold ${scheme.text} mb-4`}>Quick Actions</h4>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 ${scheme.accent} text-white rounded-lg hover:opacity-90 transition`}
                >
                  Manage Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 ${scheme.card} ${scheme.text} border ${scheme.border} rounded-lg hover:${scheme.hover} transition`}
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 