'use client';

import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import ProgressLink from "./ProgressLink";
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductContext';

export default function ProductSection({ title, products, viewAllRoute = "/", onAddToCart, productType = "all" }) {
  const { getCurrentScheme } = useTheme();
  const { products: allProducts, loading } = useProducts();
  const scheme = getCurrentScheme();

  // Get products based on type or use passed products
  const getDisplayProducts = () => {
    if (products) {
      return products;
    }

    if (loading) {
      return [];
    }

    let filteredProducts = allProducts;

    // Filter based on product type
    switch (productType) {
      case "newarrivals":
        // Take first 4 products as new arrivals
        filteredProducts = allProducts.slice(0, 4);
        break;
      case "onsale":
        // Take next 4 products as top selling
        filteredProducts = allProducts.slice(4, 8);
        break;
      default:
        // Take first 4 products
        filteredProducts = allProducts.slice(0, 4);
    }

    return filteredProducts;
  };

  const displayProducts = getDisplayProducts();

  return (
    <section className={`${scheme.card} py-12 px-4`}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className={`text-4xl font-black tracking-tight mb-10 ${scheme.text}`}>{title}</h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <>
            {/* Mobile view: swipe carousel */}
            <div className="block sm:hidden overflow-x-auto hide-scrollbar -mx-2 px-2">
              <div className="flex gap-4 w-max pr-4">
                {displayProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[80vw]">
                    <ProductCard product={product} onAddToCart={onAddToCart} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop view: grid layout */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className={`text-lg ${scheme.textSecondary}`}>No products available</p>
          </div>
        )}

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
