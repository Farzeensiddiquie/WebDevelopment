"use client";

import FilterSortBar from "../../components/FilterSortBar";
import ProductCard from "../../components/ProductCard";
import { ProductGridSkeleton } from "../../components/Skeleton";
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductContext';

export default function NewArrivalsClient({ products }) {
  const { getCurrentScheme } = useTheme();
  const { products: allProducts, loading } = useProducts();
  const scheme = getCurrentScheme();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    
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
  }, [allProducts, selectedCategory, priceFrom, priceTo, selectedSort]);

  return (
    <div className="min-h-screen px-4 py-6">
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
        onApplyFilters={() => {}}
      />
      <h1 className={`text-3xl font-extrabold mb-8 ${scheme.text}`}>New Arrivals</h1>
      
      {loading ? (
        <ProductGridSkeleton count={12} />
      ) : (
        <>
          {/* Desktop: Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-5 box-border">
            {filteredProducts.map(product => (
              <div key={product.id}>
                <ProductCard product={product} showAddToCart={true} isGrid={true} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 