"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import TopBar from "./TopBar";
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }) {
  const { getCurrentScheme } = useTheme();
  const { user } = useUser();
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

  // Hide everything on back-arrow/auth pages
  if (hideAllNav) {
    return <div className={`min-h-screen ${scheme.background}`}><main>{children}</main></div>;
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
