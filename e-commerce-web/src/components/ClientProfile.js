"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from '../context/UserContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, Heart, Trash2, XCircle, MapPin, Phone } from "lucide-react";
import Image from 'next/image';
import ProgressLink from './ProgressLink';
import NProgress from 'nprogress';
import { useTheme } from '../context/ThemeContext';

export default function ClientProfile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useUser();
  const { orders, updateOrderStatus, clearCompletedOrders, refreshOrders, loading: ordersLoading, setOrders } = useOrders();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  const initialTab = searchParams.get("tab") || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [address, setAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Update active tab when URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  // Load saved address on mount
  useEffect(() => {
    const saved = localStorage.getItem('saved_address');
    if (saved) {
      try {
        setAddress(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Simulate user sign up state (replace with real logic if available)
  const isGuest = user && user.isGuest;

  const getInitial = (name) => name?.[0]?.toUpperCase() || "?";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    NProgress.start();
    router.push(`/profile?tab=${tab}`);
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

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${scheme.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const renderTab = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Orders</h3>
              {(orders.some(order => order.status === 'cancelled') || orders.some(order => order.status === 'delivered')) && (
                <button
                  onClick={async () => {
                    try {
                      // Optimistically clear from local state
                      setOrders(prevOrders => prevOrders.filter(order =>
                        order.status !== 'cancelled' && order.status !== 'delivered'
                      ));
                      await clearCompletedOrders();
                      if (isAuthenticated) {
                        await refreshOrders();
                      }
                      showToast('Cancelled and delivered orders cleared');
                    } catch (error) {
                      console.error('Failed to clear orders:', error);
                      if (error.message?.includes('Authentication required')) {
                        showToast('Orders cleared locally. Please log in to sync with server.', 'warning');
                      } else {
                        showToast('Failed to clear orders', 'error');
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                >
                  Clear Cancelled & Delivered Orders
                </button>
              )}
            </div>
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className={`${scheme.textSecondary}`}>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className={`${scheme.textSecondary}`}>No orders yet.</p>
                <p className={`text-sm ${scheme.textSecondary} mt-2`}>Start shopping to see your orders here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className={`${scheme.card} rounded-lg p-4 border ${scheme.border} shadow-lg hover:shadow-xl transition-all duration-200`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <span className={`text-sm ${scheme.textSecondary}`}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-2 mb-3">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className={`${scheme.text}`}>{item.name} x{item.quantity}</span>
                          <span className={`${scheme.text}`}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Payment and Delivery Info */}
                    <div className={`space-y-2 mb-3 p-3 ${scheme.card} rounded-lg border ${scheme.border}`}>
                      {/* Payment Status */}
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${scheme.textSecondary}`}>Payment Method:</span>
                        <span className={`font-medium ${
                          order.payment?.method === 'cod' 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Pre-paid'}
                        </span>
                      </div>

                      {/* Shipping Time Information */}
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${scheme.textSecondary}`}>Shipping Time:</span>
                        <span className={`${scheme.text} font-medium`}>
                          {order.status === 'pending' ? '2-3 business days' :
                           order.status === 'processing' ? '1-2 business days' :
                           order.status === 'shipped' ? 'In transit' :
                           order.status === 'delivered' ? 'Delivered' :
                           order.status === 'cancelled' ? 'Cancelled' : 'Standard delivery'}
                        </span>
                      </div>

                      {/* Refund Information for Cancelled Prepaid Orders */}
                      {order.status === 'cancelled' && order.payment?.method === 'prepayment' && order.refund && (
                        <div className="flex items-center justify-between text-sm">
                          <span className={`${scheme.textSecondary}`}>Refund Status:</span>
                          <span className={`font-medium ${
                            order.refund.status === 'processed' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-purple-600 dark:text-purple-400'
                          }`}>
                            {order.refund.status === 'processed' 
                              ? `Processed ($${order.refund.amount?.toFixed(2)})` 
                              : `Pending ($${order.refund.amount?.toFixed(2)})`
                            }
                          </span>
                        </div>
                      )}

                      {/* Delivery Information */}
                      {order.estimatedDelivery && (
                        <div className="flex items-center justify-between text-sm">
                          <span className={`${scheme.textSecondary}`}>Estimated Delivery:</span>
                          <span className={`${scheme.text}`}>
                            {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      {/* Shipping Address */}
                      {order.shipping && (
                        <div className="text-sm">
                          <div className={`${scheme.textSecondary} mb-1`}>Shipping Address:</div>
                          <div className={`${scheme.text} text-xs`}>
                            {order.shipping.firstName} {order.shipping.lastName}
                            {order.shipping.phone && ` • 📞 ${order.shipping.phone}`}
                          </div>
                          <div className={`${scheme.text} text-xs`}>
                            {order.shipping.address}
                            {order.shipping.city && `, ${order.shipping.city}`}
                            {order.shipping.zipCode && ` • ${order.shipping.zipCode}`}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className={`border-t ${scheme.border} pt-3 flex justify-between items-center`}>
                      <span className={`font-bold ${scheme.text}`}>
                        Total: ${order.totals?.total?.toFixed(2) || '0.00'}
                      </span>
                      {(order.status === 'pending' || order.status === 'processing' || order.status === 'shipped') && (
                        <button
                          onClick={async () => {
                            try {
                              await updateOrderStatus(order.id, 'cancelled');
                              showToast('Order cancelled successfully');
                            } catch (error) {
                              showToast('Failed to cancel order', 'error');
                            }
                          }}
                          className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                      {/* Show payment status for all orders */}
                      <div className="mt-2">
                        {order.payment?.method === 'cod' ? (
                          <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Cash on Delivery
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Pre-paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "wishlist":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Your Wishlist</h3>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Your wishlist is empty.</p>
                <p className="text-sm text-gray-500 mt-2">Start adding items to your wishlist!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className={`${scheme.card} rounded-lg p-4 border ${scheme.border}`}>
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-32 object-contain mb-3"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <h4 className={`font-semibold text-sm mb-2 ${scheme.text}`}>{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${scheme.text}`}>${item.price}</span>
                      <ProgressLink
                        href={`/product/${item.id}`}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                      >
                        View Product
                      </ProgressLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            {/* Sign Up Section */}
            {isGuest ? (
              <div className="mb-4 p-4 bg-yellow-900/40 border border-yellow-700 rounded">
                <p className="mb-2 text-yellow-200">You are currently browsing as a guest. Sign up to save your profile and orders!</p>
                <ProgressLink href="/signup" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm font-semibold">Sign Up</ProgressLink>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-green-900/40 border border-green-700 rounded text-green-200">You are signed up and your profile is saved.</div>
            )}
            <div className="mt-8">
              <h4 className="text-md font-semibold mb-2">Saved Address</h4>
              {address && !editingAddress ? (
                <div className={`${scheme.card} p-4 rounded border ${scheme.border}`}>
                  <div className="mb-2">Phone: {address.phone}</div>
                  <div className="mb-2">Address: {address.address}</div>
                  <div className="mb-2">Zip Code: {address.zipCode}</div>
                  <button
                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    onClick={() => {
                      setEditingAddress(true);
                      setAddressForm(address);
                    }}
                  >Edit</button>
                </div>
              ) : editingAddress ? (
                <form
                  className={`space-y-2 ${scheme.card} p-4 rounded border ${scheme.border}`}
                  onSubmit={e => {
                    e.preventDefault();
                    setAddress(addressForm);
                    localStorage.setItem('saved_address', JSON.stringify(addressForm));
                    setEditingAddress(false);
                    showToast('Address updated');
                  }}
                >
                  <input type="tel" placeholder="Phone Number" value={addressForm.phone} onChange={e => setAddressForm(f => ({...f, phone: e.target.value}))} required className={`w-full p-2 rounded ${scheme.card} border ${scheme.border} ${scheme.text}`} />
                  <input type="text" placeholder="Address" value={addressForm.address} onChange={e => setAddressForm(f => ({...f, address: e.target.value}))} required className={`w-full p-2 rounded ${scheme.card} border ${scheme.border} ${scheme.text}`} />
                  <input type="text" placeholder="Zip Code" value={addressForm.zipCode} onChange={e => setAddressForm(f => ({...f, zipCode: e.target.value}))} required className={`w-full p-2 rounded ${scheme.card} border ${scheme.border} ${scheme.text}`} />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">Save</button>
                    <button type="button" className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm" onClick={() => setEditingAddress(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className={`flex items-center gap-4 ${scheme.textSecondary}`}>
                  <span>No address saved yet.</span>
                  <button
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    onClick={() => {
                      setEditingAddress(true);
                      setAddressForm({ phone: '', address: '', zipCode: '' });
                    }}
                  >Add Address</button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${scheme.background} ${scheme.text} px-4 py-10 relative`}>
      {/* Back Arrow Button */}
      <button
        onClick={() => router.back()}
        className={`absolute top-4 left-4 z-30 ${scheme.text} p-2 ${scheme.card} rounded-full hover:${scheme.hover} transition border ${scheme.border}`}
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className={`${scheme.card} p-6 rounded-2xl shadow-md border ${scheme.border}`}>
          <div className="flex flex-col items-center gap-4">
            <div className={`w-24 h-24 rounded-full ${scheme.accent} flex items-center justify-center text-3xl font-bold text-white shadow-md`}>
              {getInitial(user.name)}
            </div>
            <h2 className={`text-xl font-semibold ${scheme.text}`}>{user.name}</h2>
            <p className={`text-sm ${scheme.textSecondary}`}>{user.email}</p>
            {address && (
              <div className={`space-y-2 ${scheme.textSecondary} text-sm mt-2`}>
                {address.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span>{address.phone}</span>
                  </div>
                )}
                {address.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{address.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`md:col-span-2 ${scheme.card} p-6 rounded-2xl shadow-md border ${scheme.border}`}>
          <div className={`flex gap-4 mb-6 border-b ${scheme.border} pb-2`}>
            {['orders', 'wishlist', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeTab === tab
                    ? `${scheme.accent} text-white`
                    : `${scheme.card} ${scheme.textSecondary}`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className={scheme.textSecondary}>{renderTab()}</div>
        </div>
      </div>
    </div>
  );
}
