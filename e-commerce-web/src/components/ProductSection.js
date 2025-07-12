'use client';

import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import ProgressLink from "./ProgressLink";
import { useTheme } from '../context/ThemeContext';

export default function ProductSection({ title, products, viewAllRoute = "/", onAddToCart }) {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  return (
    <section className={`${scheme.card} py-12 px-4`}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className={`text-4xl font-black tracking-tight mb-10 ${scheme.text}`}>{title}</h2>

        {/* Mobile view: swipe carousel */}
        <div className="block sm:hidden overflow-x-auto hide-scrollbar -mx-2 px-2">
          <div className="flex gap-4 w-max pr-4">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[80vw]">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop view: grid layout */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>

        <ProgressLink
          href={viewAllRoute}
          className={`mt-10 px-6 py-2 ${scheme.accent} text-white font-semibold border ${scheme.border} rounded-full hover:opacity-90 transition inline-block`}
        >
          View All
        </ProgressLink>
      </div>
    </section>
  );
}
