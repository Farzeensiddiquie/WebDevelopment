"use client";

import React, { useState } from "react";
import ProgressLink from "./ProgressLink";
import { useUser } from '../context/UserContext';

function TopBar() {
  const { isAuthenticated } = useUser();
  const [isVisible, setIsVisible] = useState(true);

  // Hide top bar if user is authenticated
  if (!isVisible || isAuthenticated) return null;

  return (
    <div className="relative bg-black text-white px-4 py-2 text-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Promotional message */}
        <div className="flex-1 text-center">
          <p className="inline">
            Sign up and get 20% Off to your first Order.
            <ProgressLink
              href="/signup"
              className="underline underline-offset-4 text-white hover:text-gray-300 ml-2"
            >
              Sign Up Now
            </ProgressLink>
          </p>
        </div>

        {/* Close button: hidden on small screens */}
        <button
          onClick={() => setIsVisible(false)}
          className="hidden md:block text-white hover:text-gray-300 text-lg font-semibold"
          aria-label="Close top bar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default TopBar;
