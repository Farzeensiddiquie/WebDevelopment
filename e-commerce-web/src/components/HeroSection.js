'use client'
import React from "react";
import Image from "next/image";
import ProgressLink from "./ProgressLink";
import { useTheme } from '../context/ThemeContext';

function HeroSection() {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  return (
    <div className={`${scheme.background}`}>
      {/* Desktop View */}
      <div className="hidden lg:flex flex-col lg:flex-row items-center justify-between h-auto lg:h-[80vh] px-4 lg:px-10 relative overflow-hidden">
        {/* Left Content */}
        <div className="w-full md:w-1/2 z-10 flex flex-col items-center md:items-start text-center md:text-left py-10 md:py-0">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight ${scheme.text}`}>
            FIND CLOTHES
            <br />
            THAT MATCHES
            <br />
            YOUR STYLE
          </h1>
          <p className={`mt-4 ${scheme.textSecondary} max-w-md`}>
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <ProgressLink 
            href="/shop" 
            className={`mt-6 w-full max-w-[280px] md:max-w-none md:w-auto px-6 py-3 ${scheme.accent} text-white rounded-full hover:opacity-90 text-center transition`}
          >
            Shop Now
          </ProgressLink>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className={`text-2xl font-bold ${scheme.text}`}>200+</div>
              <div className={`text-sm ${scheme.textSecondary}`}>International Brands</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${scheme.text}`}>2,000+</div>
              <div className={`text-sm ${scheme.textSecondary}`}>High-Quality Products</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${scheme.text}`}>30,000+</div>
              <div className={`text-sm ${scheme.textSecondary}`}>Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Right Content - Video */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-md">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-2xl shadow-2xl"
            >
              <source src="/Herovideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col items-center text-center py-10 px-4">
        <h1 className={`text-3xl font-extrabold leading-tight ${scheme.text} mb-4`}>
          FIND CLOTHES
          <br />
          THAT MATCHES
          <br />
          YOUR STYLE
        </h1>
        <p className={`${scheme.textSecondary} mb-6 max-w-md`}>
          Browse through our diverse range of meticulously crafted garments,
          designed to bring out your individuality and cater to your sense of
          style.
        </p>
        <ProgressLink 
          href="/shop" 
          className={`w-full max-w-[280px] px-6 py-3 ${scheme.accent} text-white rounded-full hover:opacity-90 text-center transition`}
        >
          Shop Now
        </ProgressLink>

        {/* Mobile Stats */}
        <div className="flex gap-6 mt-8">
          <div className="text-center">
            <div className={`text-xl font-bold ${scheme.text}`}>200+</div>
            <div className={`text-xs ${scheme.textSecondary}`}>Brands</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${scheme.text}`}>2,000+</div>
            <div className={`text-xs ${scheme.textSecondary}`}>Products</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${scheme.text}`}>30,000+</div>
            <div className={`text-xs ${scheme.textSecondary}`}>Customers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
