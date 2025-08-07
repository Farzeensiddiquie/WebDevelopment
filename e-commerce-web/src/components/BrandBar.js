'use client'
import { playfair } from "../../src/app/font.js";
import React from "react";
import { useTheme } from '../context/ThemeContext';

const BrandBar = () => {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  return (
    <div className={`bg-gradient-to-br from-gray-800/90 via-gray-700/70 to-gray-800/90  w-full py-6`}>
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-16 gap-y-4 sm:gap-y-8 px-4">
        <span className= 'text-white text-xl sm:text-5xl font-light tracking-wide'>VERSACE</span>
        <span className={`${playfair.variable} text-white font-playfair  text-xl sm:text-5xl tracking-[0.25em]`}>
          ZARA
        </span>
        <span className= 'text-white text-xl sm:text-5xl font-serif tracking-wide'>GUCCI</span>
        <span className= 'text-white text-xl sm:text-5xl font-bold tracking-wides'>PRADA</span>
        <span className= 'text-white text-xl sm:text-5xl font-light tracking-wide'>Calvin Klein</span>
      </div>
    </div>
  );
};

export default BrandBar;
