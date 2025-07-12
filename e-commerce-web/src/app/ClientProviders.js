'use client';

import NProgressProvider from "../components/NProgressProvider";
import { UserProvider } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import { OrderProvider } from "../context/OrderContext";
import { WishlistProvider } from "../context/WishlistContext";
import { ThemeProvider } from "../context/ThemeContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ProductProvider } from "../context/ProductContext";

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <NProgressProvider>
        <UserProvider>
          <CartProvider>
            <OrderProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <ToastProvider>
                    <ProductProvider>
                      {children}
                    </ProductProvider>
                  </ToastProvider>
                </NotificationProvider>
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </UserProvider>
      </NProgressProvider>
    </ThemeProvider>
  );
} 