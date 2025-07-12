"use client";

import FilterSortBar from "../../../components/FilterSortBar";
import ProductCard from "../../../components/ProductCard";
import { ProductGridSkeleton } from "../../../components/Skeleton";
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useProducts } from '../../../context/ProductContext';

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function MenClient() {
  const { getCurrentScheme } = useTheme();
  const { products, loading } = useProducts();
  const scheme = getCurrentScheme();
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  
  const productsPerPage = 12;

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.category === 'men');
    
    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    
    // Price filter
    if (priceFrom) {
      filtered = filtered.filter((p) => p.price >= Number(priceFrom));
    }
    if (priceTo) {
      filtered = filtered.filter((p) => p.price <= Number(priceTo));
    }
    
    // Sort
    switch (selectedSort) {
      case "price_low_high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Relevance - keep original order
        break;
    }
    
    return filtered;
  }, [products, selectedCategory, priceFrom, priceTo, selectedSort]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage);

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when filters are applied
  };

  return (
    <div className="min-h-screen px-4">
      <FilterSortBar
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        priceFrom={priceFrom}
        setPriceFrom={setPriceFrom}
        priceTo={priceTo}
        setPriceTo={setPriceTo}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
        onApplyFilters={handleApplyFilters}
      />
      <h1 className={`text-3xl font-bold text-start ml-4 mb-6 ${scheme.text}`}>Men</h1>
      
      {loading ? (
        <ProductGridSkeleton count={12} />
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-5 box-border">
            {paginatedProducts.map(product => (
              <div key={product._id || product.id}>
                <ProductCard product={product} showAddToCart={true} isGrid={true} />
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded transition-colors ${
                    page === i + 1 
                      ? `${scheme.accent} text-white` 
                      : `${scheme.card} ${scheme.textSecondary} border ${scheme.border} hover:${scheme.hover}`
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 