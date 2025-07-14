"use client";

import { useState, useEffect, useContext } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useOrders } from '../../context/OrderContext';
import ProgressLink from '../../components/ProgressLink';
import { ArrowLeft, CreditCard, Truck, Shield, Package, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserContext from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';

export default function CheckoutClient() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { showToast } = useToast();
  const { addOrder } = useOrders();
  const router = useRouter();
  const user = useContext(UserContext);
  const isSignedIn = user && !user.isGuest;
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('prepayment'); // 'prepayment' or 'cod'
  const [isProcessing, setIsProcessing] = useState(false);

  // Load user profile and saved address on mount
  useEffect(() => {
    let profile = null;
    try {
      profile = JSON.parse(localStorage.getItem('user_profile'));
    } catch {}
    const saved = localStorage.getItem('saved_address');
    let addressData = {};
    if (saved) {
      try {
        addressData = JSON.parse(saved);
      } catch {}
    }
    if (isSignedIn && profile) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: profile.name?.split(' ')[0] || '',
        lastName: profile.name?.split(' ').slice(1).join(' ') || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: addressData.address || '',
        zipCode: addressData.zipCode || '',
      }));
    } else if (saved) {
      setShippingInfo(addressData);
    }
  }, [isSignedIn]);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.2; // 20% discount
  const shippingCost = selectedShipping === 'express' ? 25 : 15;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shippingCost + tax;

  const handleInputChange = (setter, field, value) => {
    setter(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validate payment fields for prepayment
    if (paymentMethod === 'prepayment') {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiry || !paymentInfo.cvv) {
        setPaymentError('All payment fields are required for pre-payment.');
        return;
      } else {
        setPaymentError('');
      }
    }
    
    // Save address if checked
    if (saveAddress) {
      localStorage.setItem('saved_address', JSON.stringify(shippingInfo));
    }

    setIsProcessing(true);

    // Create order object
    const orderData = {
      items: cartItems,
      shipping: shippingInfo,
      payment: {
        method: paymentMethod,
        cardNumber: paymentMethod === 'prepayment' && paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : '', // Only store last 4 digits
        status: paymentMethod === 'prepayment' ? 'paid' : 'pending'
      },
      totals: {
        subtotal,
        discount,
        shipping: shippingCost,
        tax,
        total
      },
      shippingMethod: selectedShipping,
      status: 'pending',
      estimatedDelivery: getEstimatedDeliveryDate(selectedShipping)
    };

    // Save order
    const newOrder = addOrder(orderData);
    
    // Clear cart
    clearCart();
    
    // Show success message based on payment method
    const orderNumber = newOrder?.id ? newOrder.id.slice(-8) : 'placed';
    if (paymentMethod === 'cod') {
      showToast(`Order #${orderNumber} placed successfully! You will pay ${total.toFixed(2)} on delivery. Estimated delivery: 3-5 business days.`);
    } else {
      showToast(`Order #${orderNumber} placed successfully! Payment received. Estimated delivery: 3-5 business days.`);
    }
    
    // Redirect to profile orders tab (client-side navigation)
    router.push('/profile?tab=orders');
    setIsProcessing(false);
  };

  // Helper function to calculate estimated delivery date
  const getEstimatedDeliveryDate = (shippingMethod) => {
    const today = new Date();
    const businessDays = shippingMethod === 'express' ? 3 : 5;
    const deliveryDate = new Date(today);
    
    let addedDays = 0;
    while (addedDays < businessDays) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return deliveryDate.toISOString();
  };

  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <ProgressLink 
            href="/shop" 
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Continue Shopping
          </ProgressLink>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${scheme.background}`}>
      {/* Header */}
      <div className={`${scheme.card} shadow-sm border-b ${scheme.border}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <ProgressLink 
              href="/cartpage"
              className={`${scheme.textSecondary} hover:${scheme.text} transition`}
            >
              <ArrowLeft className="w-5 h-5" />
            </ProgressLink>
            <h1 className={`text-2xl font-bold ${scheme.text}`}>Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className={`${scheme.card} rounded-xl shadow-md p-6 border ${scheme.border}`}>
              <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${scheme.text}`}>
                <Truck className="w-5 h-5" />
                Shipping Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {isSignedIn ? null : (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>First Name</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange(setShippingInfo, 'firstName', e.target.value)}
                        className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Last Name</label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange(setShippingInfo, 'lastName', e.target.value)}
                        className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Email</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange(setShippingInfo, 'email', e.target.value)}
                        className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Phone</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange(setShippingInfo, 'phone', e.target.value)}
                        className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange(setShippingInfo, 'address', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Zip Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) => handleInputChange(setShippingInfo, 'zipCode', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                    required
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center mt-2">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={e => setSaveAddress(e.target.checked)}
                  className="mr-2 accent-accent"
                />
                <label htmlFor="saveAddress" className={`text-sm ${scheme.textSecondary}`}>Save this address for future checkouts</label>
              </div>
            </div>

            {/* Shipping Options */}
            <div className={`${scheme.card} rounded-xl shadow-md p-6 border ${scheme.border}`}>
              <h3 className={`text-lg font-bold mb-4 ${scheme.text}`}>Shipping Options</h3>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${scheme.border} ${scheme.card} hover:${scheme.hover}`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={selectedShipping === 'standard'}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="accent-accent"
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${scheme.text}`}>Standard Shipping</div>
                    <div className={`text-sm ${scheme.textSecondary}`}>5-7 business days</div>
                  </div>
                  <div className="font-bold">$15.00</div>
                </label>
                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${scheme.border} ${scheme.card} hover:${scheme.hover}`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={selectedShipping === 'express'}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="accent-accent"
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${scheme.text}`}>Express Shipping</div>
                    <div className={`text-sm ${scheme.textSecondary}`}>2-3 business days</div>
                  </div>
                  <div className="font-bold">$25.00</div>
                </label>
              </div>
            </div>

            {/* Payment Information */}
            <div className={`${scheme.card} rounded-xl shadow-md p-6 border ${scheme.border}`}>
              <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${scheme.text}`}>
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${scheme.border} ${scheme.card} hover:${scheme.hover} ${paymentMethod === 'prepayment' ? 'ring-2 ring-blue-500' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="prepayment"
                      checked={paymentMethod === 'prepayment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-blue-500"
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${scheme.text}`}>Pre-payment (Credit/Debit Card)</div>
                      <div className={`text-sm ${scheme.textSecondary}`}>Pay now with your card</div>
                    </div>
                    <div className="text-green-600 font-semibold">Secure</div>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${scheme.border} ${scheme.card} hover:${scheme.hover} ${paymentMethod === 'cod' ? 'ring-2 ring-blue-500' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-blue-500"
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${scheme.text}`}>Cash on Delivery (COD)</div>
                      <div className={`text-sm ${scheme.textSecondary}`}>Pay when you receive your order</div>
                    </div>
                    <div className="text-orange-600 font-semibold">COD</div>
                  </label>
                </div>
              </div>

              {/* Card Details (only show for prepayment) */}
              {paymentMethod === 'prepayment' && (
                <>
                  {paymentError && (
                    <div className="mb-4 text-red-600 font-semibold text-sm">{paymentError}</div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Card Number <span className='text-red-500'>*</span></label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange(setPaymentInfo, 'cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Cardholder Name <span className='text-red-500'>*</span></label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => handleInputChange(setPaymentInfo, 'cardName', e.target.value)}
                        className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>Expiry Date <span className='text-red-500'>*</span></label>
                        <input
                          type="text"
                          value={paymentInfo.expiry}
                          onChange={(e) => handleInputChange(setPaymentInfo, 'expiry', e.target.value)}
                          placeholder="MM/YY"
                          className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${scheme.textSecondary}`}>CVV <span className='text-red-500'>*</span></label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => handleInputChange(setPaymentInfo, 'cvv', e.target.value)}
                          placeholder="123"
                          className={`w-full p-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} focus:outline-none focus:ring-2 focus:ring-accent transition`}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* COD Notice */}
              {paymentMethod === 'cod' && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-orange-600 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800">Cash on Delivery</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        You will pay ${total.toFixed(2)} when your order is delivered. 
                        Please have the exact amount ready for the delivery person.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className={`${scheme.card} rounded-xl shadow-md p-6 border ${scheme.border} sticky top-8`}>
            <h2 className={`text-xl font-bold mb-6 ${scheme.text}`}>Order Summary</h2>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${scheme.text}`}>{item.name}</div>
                    <div className={`text-sm ${scheme.textSecondary}`}>Size: {item.size} | Color: {item.color}</div>
                    <div className={`text-sm ${scheme.textSecondary}`}>Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount (20%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {/* Security Notice */}
            <div className={`mt-6 p-4 rounded-lg ${scheme.card} border ${scheme.border}`}>
              <div className={`flex items-center gap-2 text-sm ${scheme.textSecondary}`}>
                <Shield className="w-4 h-4" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
            {/* Place Order Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 rounded-lg font-bold text-lg mt-6 transition ${scheme.accent} text-white hover:opacity-90`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                `Place Order - $${total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 