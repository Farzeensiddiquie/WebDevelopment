"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useTheme } from '../context/ThemeContext';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
});

export default function NProgressProvider({ children }) {
  const pathname = usePathname();
  const timeoutRef = useRef();
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  useEffect(() => {
    // Dynamically inject theme-based NProgress styles
    if (typeof document !== 'undefined') {
      let style = document.getElementById('nprogress-theme-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'nprogress-theme-style';
        document.head.appendChild(style);
      }
      style.textContent = `
        #nprogress { pointer-events: none; z-index: 9999; }
        #nprogress .bar {
          background: var(--nprogress-bar-gradient, ${scheme.accent});
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          height: 6px;
          box-shadow: 0 0 15px rgba(34,34,59,0.6);
          position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;
        }
        #nprogress .peg { display: none; }
      `;
      // Set CSS variable for accent gradient
      document.documentElement.style.setProperty('--nprogress-bar-gradient', getComputedStyle(document.body).getPropertyValue(`--nprogress-bar-gradient`) || scheme.accent);
    }
  }, [scheme.accent]);

  useEffect(() => {
    // Only finish NProgress on route change
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      NProgress.done();
    }, 800); // Adjust as needed

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      NProgress.done();
    };
  }, [pathname]);

  return <>{children}</>;
}
