"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import TopBar from "./TopBar";
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }) {
  const { getCurrentScheme } = useTheme();
  const { user, initialized } = useUser();
  const scheme = getCurrentScheme();
  const pathname = usePathname();

  // Pages with a back arrow or auth (hide all nav and footer except brands)
  const hideAllNavRoutes = [
    '/cartpage',
    '/profile',
    '/checkout',
    '/login',
    '/signup'
  ];
  // Brands page: no longer a special case
  // const brandsRoute = '/brands';

  // const isBrands = pathname.startsWith(brandsRoute);
  const hideAllNav = hideAllNavRoutes.some(route => pathname.startsWith(route));

  // Show loading state if not initialized
  if (!initialized) {
    return (
      <div className={`min-h-screen ${scheme.background}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-16 bg-gray-300 dark:bg-gray-700"></div>
          <main className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Hide everything on back-arrow/auth pages
  if (hideAllNav) {
    return (
      <div className={`min-h-screen ${scheme.background}`}>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${scheme.background}`}>
      <TopBar />
      <NavBar user={user} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
