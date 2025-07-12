"use client";

import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', isVisible: false, type: 'success', linkType: null });

  const showToast = (message, type = 'success', linkType = null) => {
    setToast({ message, isVisible: true, type, linkType });
  };

  const hideToast = () => {
    setToast({ message: '', isVisible: false, type: 'success', linkType: null });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
        linkType={toast.linkType}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 