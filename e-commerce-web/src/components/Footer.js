// src/components/Footer.jsx
"use client";
import { Mail } from "lucide-react";
import Image from "next/image";
import ProgressLink from "./ProgressLink";
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  return (
    <footer className={`${scheme.card} mt-30 ${scheme.text} px-0 pt-0 pb-0 text-sm w-full`}>
      {/* Newsletter Banner */}
      <div className="w-full flex justify-center items-center" style={{position: 'relative', zIndex: 20, marginBottom: '-64px', overflow: 'visible'}}>
        <div className={`${scheme.card} ${scheme.text} rounded-2xl px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between w-[95vw] max-w-6xl mx-auto gap-6 md:gap-0 shadow-xl border ${scheme.border}`} style={{boxShadow: '0 12px 32px 0 rgba(0,0,0,0.13)', position: 'relative', top: '-32px', overflow: 'visible', minHeight: '220px'}}>
          <h2 className="text-3xl font-extrabold leading-tight md:text-left text-center md:max-w-lg tracking-tight">
            STAY UPTO DATE ABOUT <br className="hidden md:block" /> OUR LATEST OFFERS
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full sm:w-80 pl-10 pr-4 py-3 rounded-lg border ${scheme.border} ${scheme.card} ${scheme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <button className={`px-6 py-3 ${scheme.accent} text-white rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap`}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="dark:invert" />
              <span className="text-xl font-bold">Fashion Store</span>
            </div>
            <p className={`${scheme.textSecondary} text-sm leading-relaxed`}>
              We sell the latest trends in fashion at affordable prices to make every customer happy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${scheme.textSecondary} hover:${scheme.text} transition`}>
                <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
              </a>
              <a href="#" className={`${scheme.textSecondary} hover:${scheme.text} transition`}>
                <Image src="/icons/twitter.png" alt="Twitter" width={24} height={24} />
              </a>
              <a href="#" className={`${scheme.textSecondary} hover:${scheme.text} transition`}>
                <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} />
              </a>
              <a href="#" className={`${scheme.textSecondary} hover:${scheme.text} transition`}>
                <Image src="/icons/github.png" alt="GitHub" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li><ProgressLink href="/shop" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>Shop</ProgressLink></li>
              <li><ProgressLink href="/brands" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>Brands</ProgressLink></li>
              <li><ProgressLink href="/newarrivals" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>New Arrivals</ProgressLink></li>
              <li><ProgressLink href="/onsale" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>On Sale</ProgressLink></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>Help</h3>
            <ul className="space-y-2">
              <li><ProgressLink href="/profile" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>My Account</ProgressLink></li>
              <li><ProgressLink href="/cartpage" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>Shopping Cart</ProgressLink></li>
              <li><ProgressLink href="/checkout" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>Checkout</ProgressLink></li>
              <li><a href="#" className={`${scheme.textSecondary} hover:${scheme.text} transition text-sm`}>Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>Newsletter</h3>
            <p className={`${scheme.textSecondary} text-sm mb-4`}>
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className={`flex-1 px-3 py-2 rounded border ${scheme.border} ${scheme.card} ${scheme.text} text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              <button className={`px-4 py-2 ${scheme.accent} text-white rounded text-sm font-medium hover:opacity-90 transition`}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className={`${scheme.textSecondary} text-sm`}>
            © 2024 Fashion Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className={`${scheme.textSecondary} text-sm`}>Payment Methods:</span>
            <div className="flex gap-2">
              <Image src="/payments/visa.png" alt="Visa" width={32} height={20} />
              <Image src="/payments/card.png" alt="Card" width={32} height={20} />
              <Image src="/payments/paypal.png" alt="PayPal" width={32} height={20} />
              <Image src="/payments/applepay.png" alt="Apple Pay" width={32} height={20} />
              <Image src="/payments/googlepay.png" alt="Google Pay" width={32} height={20} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
