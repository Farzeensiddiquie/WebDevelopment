"use client";
import { useState, useEffect } from "react";
import ProgressLink from "./ProgressLink";
import Image from "next/image";
import { Menu, X, ShoppingCart, Search, Heart, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import ProfileMenu from "./ProfileMenu";
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { usePathname } from 'next/navigation';

function NavBar() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const { cartItems, getCartItemCount } = useCart();
  const { getCurrentScheme } = useTheme();
  const { user, isAdmin } = useUser();
  const scheme = getCurrentScheme();
  const pathname = usePathname();
  // Only open dropdown on hover/focus
  // const isShopActive = pathname.startsWith('/shop') || pathname.startsWith('/onsale') || pathname.startsWith('/newarrivals');
  const isShopActive = pathname.startsWith('/shop') || pathname.startsWith('/onsale') || pathname.startsWith('/newarrivals');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cartItemCount = getCartItemCount();

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
    // Start animation after a brief delay to ensure the element is rendered
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleMobileMenuClose = () => {
    setIsAnimating(false);
    setTimeout(() => setMobileMenuOpen(false), 300);
  };

  return (
    <>
      <div className={`w-full shadow-[0_3px_3px_-1px_rgba(0,0,0,0.6),0_6px_4px_-2px_rgba(0,0,0,0.06)] ${scheme.card} ${scheme.text}`}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Hamburger */}
          <div className="block" style={{ display: isMobile ? "block" : "none" }}>
            <button
              onClick={handleMobileMenuOpen}
              className={`${scheme.textSecondary}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <Image src="/logo.png" alt="Logo" width={50} height={50} className="dark:invert" />

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-6 ml-4 relative"
            style={{ display: isMobile ? "none" : "flex" }}
          >
            <ProgressLink
              href="/"
              className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition ${pathname === '/' ? 'font-bold' : ''}`}
            >
              Home
            </ProgressLink>
            {/* Shop Main Link with Dropdown */}
            <div className="relative transition-all duration-300 ease-in-out" onMouseEnter={() => setShopDropdownOpen(true)} onMouseLeave={() => setShopDropdownOpen(false)}>
              <ProgressLink
                href="/shop"
                className={`flex items-center gap-1 ${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition focus:outline-none ${isShopActive ? 'font-bold' : ''}`}
                aria-haspopup="true"
                aria-expanded={shopDropdownOpen}
                onFocus={() => setShopDropdownOpen(true)}
                onBlur={() => setShopDropdownOpen(false)}
              >
                Shop <ChevronDown className="w-4 h-4" />
              </ProgressLink>
              <div className={`absolute left-0 min-w-[180px] rounded-lg shadow-lg border ${scheme.border} ${scheme.card} z-50 transition-all duration-300 ease-in-out ${shopDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <ProgressLink href="/shop/men" className={`block px-4 py-2 text-sm ${scheme.textSecondary} hover:${scheme.text} transition`}>Men</ProgressLink>
                <ProgressLink href="/shop/women" className={`block px-4 py-2 text-sm ${scheme.textSecondary} hover:${scheme.text} transition`}>Women</ProgressLink>
                <ProgressLink href="/shop/accessories" className={`block px-4 py-2 text-sm ${scheme.textSecondary} hover:${scheme.text} transition`}>Accessories</ProgressLink>
              </div>
            </div>

            <ProgressLink href="/brands" className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition`}>
              Brands
            </ProgressLink>
            <ProgressLink href="/newarrivals" className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition`}>
              New Arrivals
            </ProgressLink>
            <ProgressLink href="/onsale" className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition`}>
              On Sale
            </ProgressLink>
            
            {/* Admin Link - Only show for admin users */}
            {isAdmin() && (
              <ProgressLink href="/admin" className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition`}>
                Admin
              </ProgressLink>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-4" style={{ display: isMobile ? "none" : "flex" }}>
            <ProgressLink href="/search" className={`${scheme.textSecondary} hover:${scheme.text} transition`}>
              <Search className="w-5 h-5" />
            </ProgressLink>

            <ProgressLink href="/cartpage" className={`${scheme.textSecondary} hover:${scheme.text} transition relative`}>
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </ProgressLink>

            <ProfileMenu user={user} />
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-4" style={{ display: isMobile ? "flex" : "none" }}>
            <ProgressLink href="/search" className={`${scheme.textSecondary} hover:${scheme.text} transition`}>
              <Search className="w-5 h-5" />
            </ProgressLink>

            <ProgressLink href="/cartpage" className={`${scheme.textSecondary} hover:${scheme.text} transition relative`}>
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </ProgressLink>

            <ProfileMenu user={user} />
          </div>
        </div>

        {/* Mobile Menu Drawer & Overlay */}
        <div className="pointer-events-none">
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'} pointer-events-auto`}
              onClick={handleMobileMenuClose}
              aria-label="Close menu overlay"
            />
            {/* Drawer */}
            <div
              className={`fixed top-0 left-0 h-screen w-[80%] sm:w-[300px] z-50 backdrop-blur-md ${scheme.card} border-r ${scheme.border} transform transition-all duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : '-translate-x-full'} pointer-events-auto`}
              role="dialog"
              aria-modal="true"
            >
              <div className={`relative flex flex-col p-6 pt-16 ${scheme.text} font-semibold text-base gap-4`}>
                <button
                  onClick={handleMobileMenuClose}
                  className="absolute top-4 right-4 transition-all duration-200 ease-in-out hover:scale-110"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Navigation items */}
                <nav className="flex flex-col gap-4 space-y-3">
                  <ProgressLink 
                    href="/" 
                    className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105 ${pathname === '/' ? 'font-bold' : ''}`}
                    onClick={handleMobileMenuClose}
                  >
                    Home
                  </ProgressLink>
                  
                  {/* Shop with sub-links */}
                  <div className="space-y-2">
                    <ProgressLink 
                      href="/shop" 
                      className={`text-sm font-semibold ${scheme.textSecondary} hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105 ${isShopActive ? 'font-bold' : ''}`}
                      onClick={handleMobileMenuClose}
                    >
                      Shop
                    </ProgressLink>
                    <div className="flex flex-col gap-1 ml-2 space-y-1">
                      <ProgressLink 
                        href="/shop/men" 
                        className={`${scheme.textSecondary} text-sm hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                        onClick={handleMobileMenuClose}
                      >
                        Men
                      </ProgressLink>
                      <ProgressLink 
                        href="/shop/women" 
                        className={`${scheme.textSecondary} text-sm hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                        onClick={handleMobileMenuClose}
                      >
                        Women
                      </ProgressLink>
                      <ProgressLink 
                        href="/shop/accessories" 
                        className={`${scheme.textSecondary} text-sm hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                        onClick={handleMobileMenuClose}
                      >
                        Accessories
                      </ProgressLink>
                    </div>
                  </div>
                  
                  <ProgressLink 
                    href="/brands" 
                    className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                    onClick={handleMobileMenuClose}
                  >
                    Brands
                  </ProgressLink>
                  
                  <ProgressLink 
                    href="/newarrivals" 
                    className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                    onClick={handleMobileMenuClose}
                  >
                    New Arrivals
                  </ProgressLink>
                  
                  <ProgressLink 
                    href="/onsale" 
                    className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                    onClick={handleMobileMenuClose}
                  >
                    On Sale
                  </ProgressLink>
                  
                  {/* Admin Link - Only show for admin users */}
                  {isAdmin() && (
                    <ProgressLink 
                      href="/admin" 
                      className={`${scheme.textSecondary} text-sm font-semibold hover:${scheme.text} transition-all duration-200 ease-in-out hover:scale-105`}
                      onClick={handleMobileMenuClose}
                    >
                      Admin
                    </ProgressLink>
                  )}
                </nav>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
