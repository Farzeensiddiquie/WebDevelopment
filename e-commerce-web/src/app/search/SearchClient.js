"use client";

import FilterSortBar from "../../components/FilterSortBar";
import ProductCard from "../../components/ProductCard";
import { ProductGridSkeleton } from "../../components/Skeleton";
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useProducts } from '../../context/ProductContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from "lucide-react";

export default function SearchClient() {
  const { getCurrentScheme } = useTheme();
  const { products, loading } = useProducts();
  const scheme = getCurrentScheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [brandOpen, setBrandOpen] = useState(false);

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const brands = [...new Set(products.map(product => product.brand))];
    return brands.sort();
  }, [products]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput('');
    router.push('/search');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSort("relevance");
    setPriceFrom("");
    setPriceTo("");
    setSelectedCategory("All");
    setSelectedBrand("All");
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Search filter
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
      );
    }
    
    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    
    // Brand filter
    if (selectedBrand !== "All") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
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
  }, [products, query, selectedCategory, selectedBrand, priceFrom, priceTo, selectedSort]);

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Search Input Field */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products, brands, or categories..."
              className={`block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 ${scheme.bg} ${scheme.text} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Reset Button */}
      {(selectedCategory !== "All" || selectedBrand !== "All" || priceFrom || priceTo || selectedSort !== "relevance") && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={handleResetFilters}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${scheme.border} ${scheme.textSecondary} hover:${scheme.text} transition-colors`}
          >
            Reset All Filters
          </button>
        </div>
      )}

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
        showBrandsFilter={true}
        brands={availableBrands}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brandOpen={brandOpen}
        setBrandOpen={setBrandOpen}
        onApplyFilters={() => {}}
        onClearFilters={handleResetFilters}
      />
      
      <h1 className={`text-3xl font-extrabold mb-8 ${scheme.text}`}>
        {query ? `Search Results for "${query}"` : 'Search Products'}
      </h1>
      
      {loading ? (
        <ProductGridSkeleton count={12} />
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-lg ${scheme.textSecondary}`}>
                {query ? `No products found matching "${query}".` : 'No products found. Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <>
              <p className={`text-sm ${scheme.textSecondary} mb-6`}>
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-5 box-border">
                {filteredProducts.map(product => (
                  <div key={product._id || product.id}>
                    <ProductCard product={product} showAddToCart={true} isGrid={true} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
} 