"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ProgressLink from "../../components/ProgressLink";
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

export default function CartClient() {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  const { cartItems, addToCart, removeFromCart, updateQuantity, loading, operationLoading } = useCart();
  const { user, isAuthenticated, loading: userLoading } = useUser();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const delivery = cartItems.length ? 15 : 0;
  const total = subtotal - discount + delivery;

  const handleRemoveItem = async (item) => {
    try {
      await removeFromCart(item.id || item._id, item.size, item.color);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      await updateQuantity(item.id || item._id, item.size, item.color, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  return (
    <div className={`min-h-screen ${scheme.background} px-4 py-6 sm:px-6 lg:px-8`}>
      {/* Header with back link */}
      <div className="flex items-center gap-4 mb-6">
        <ProgressLink 
          href="/"
          className={`${scheme.textSecondary} transition p-2 hover:${scheme.hover} rounded-full`}
        >
          <ArrowLeft className="w-5 h-5" />
        </ProgressLink>
        <h1 className={`text-3xl font-extrabold ${scheme.text}`}>YOUR CART</h1>
      </div>

      {loading || userLoading ? (
        <div className={`text-center ${scheme.textSecondary} mt-20`}>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className={`text-center ${scheme.textSecondary} mt-20`}>
          <p className="text-lg font-semibold">No products added yet.</p>
          <p className="text-sm mt-2">Start shopping and fill your cart!</p>
          <ProgressLink 
            href="/shop" 
            className={`mt-6 inline-block px-6 py-3 ${scheme.accent} text-white rounded-full hover:opacity-90 transition`}
          >
            Explore Products
          </ProgressLink>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => {
              const itemId = item.id || item._id;
              const isItemLoading = operationLoading[itemId];
              
              return (
                <div
                  key={`${itemId}-${index}`}
                  className={`${scheme.card} flex items-center justify-between p-4 rounded-xl border ${scheme.border} shadow-sm relative ${isItemLoading ? 'opacity-75' : ''}`}
                >
                  {isItemLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-xl w-16 h-16 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <div>
                      <h2 className={`font-semibold text-sm sm:text-base ${scheme.text}`}>{item.name}</h2>
                      <p className={`text-xs ${scheme.textSecondary}`}>
                        Size: {item.size} <br /> Color: {item.color}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-1 border rounded-full text-sm ${scheme.border} ${isItemLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={() => !isItemLoading && handleUpdateQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isItemLoading}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={`text-sm ${scheme.text} min-w-[2rem] text-center`}>{item.quantity}</span>
                    <button
                      className={`p-1 border rounded-full text-sm ${scheme.border} ${isItemLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      onClick={() => !isItemLoading && handleUpdateQuantity(item, item.quantity + 1)}
                      disabled={isItemLoading}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-bold ${scheme.text}`}>${item.price * item.quantity}</p>
                    <button
                      onClick={() => !isItemLoading && handleRemoveItem(item)}
                      disabled={isItemLoading}
                      className={`text-red-500 cursor-pointer ${isItemLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-600'}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className={`${scheme.card} rounded-2xl border ${scheme.border} p-6 shadow-md h-fit`}>
            <h3 className={`text-lg font-bold mb-4 ${scheme.text}`}>Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount (-20%)</span>
                <span className="font-semibold">-${discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold">${delivery}</span>
              </div>
            </div>

            <div className="flex justify-between mt-4 text-base font-bold">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <div className={`mt-4 flex items-center border ${scheme.border} rounded-full overflow-hidden`}>
              <input
                placeholder="Add promo code"
                className={`flex-1 px-4 py-2 text-sm outline-none ${scheme.card} ${scheme.text}`}
              />
              <button className={`${scheme.accent} text-white px-4 py-2 text-sm font-medium`}>
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            {user ? (
              <ProgressLink 
                href="/checkout"
                className={`w-full mt-4 ${scheme.accent} text-white py-3 rounded-full font-semibold hover:opacity-90 transition block text-center`}
              >
                Go to Checkout →
              </ProgressLink>
            ) : (
              <ProgressLink
                href="/login?redirect=/checkout"
                className={`w-full mt-4 bg-gray-400 text-white py-3 rounded-full font-semibold block text-center cursor-pointer opacity-80`}
              >
                Login to Checkout
              </ProgressLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 