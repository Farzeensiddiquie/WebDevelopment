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
      <ToastProvider>
        <NProgressProvider>
          <UserProvider>
            <CartProvider>
              <NotificationProvider>
                <OrderProvider>
                  <WishlistProvider>
                    <ProductProvider>
                      {children}
                    </ProductProvider>
                  </WishlistProvider>
                </OrderProvider>
              </NotificationProvider>
            </CartProvider>
          </UserProvider>
        </NProgressProvider>
      </ToastProvider>
    </ThemeProvider>
  );
} 