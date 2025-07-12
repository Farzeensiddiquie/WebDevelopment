"use client";

import { useRef, useEffect } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { useTheme } from '../context/ThemeContext';

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

const categories = ["All", "men", "women", "accessories"];

export default function FilterSortBar({
  filterOpen,
  setFilterOpen,
  sortOpen,
  setSortOpen,
  selectedSort,
  setSelectedSort,
  priceFrom,
  setPriceFrom,
  priceTo,
  setPriceTo,
  selectedCategory,
  setSelectedCategory,
  categoryOpen,
  setCategoryOpen,
  onApplyFilters,
  onClearFilters,
  showBrandsFilter = false,
  brands = [],
  selectedBrand = "All",
  setSelectedBrand,
  brandOpen = false,
  setBrandOpen
}) {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  const sortRef = useRef(null);
  const catRef = useRef(null);
  const brandRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(e.target)) {
        setBrandOpen && setBrandOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSortOpen, setCategoryOpen, setBrandOpen]);

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2">
        {/* Filter button */}
        <button
          onClick={() => setFilterOpen(true)}
          className={`flex items-center gap-2 ${scheme.text} font-semibold`}
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Sort dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${scheme.textSecondary} ${scheme.card} border ${scheme.border} hover:${scheme.hover} transition`}
          >
            {sortOptions.find((opt) => opt.value === selectedSort)?.label}
            <ChevronDown className="w-4 h-4" />
          </button>

          {sortOpen && (
            <div
              className={`absolute right-0 mt-2 z-10 w-52 rounded-md ${scheme.card} border ${scheme.border} ${scheme.text}`}
            >
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setSelectedSort(option.value);
                    setSortOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:${scheme.hover} ${
                    selectedSort === option.value ? `${scheme.accent} text-white font-semibold` : ''
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter overlay */}
      {filterOpen && (
        <div
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${filterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* Filter drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-[80%] sm:w-[300px] z-50 backdrop-blur-md ${scheme.card} border-r ${scheme.border} transform transition-all duration-300 ease-in-out ${filterOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
      >
        <div className={`relative flex flex-col p-6 pt-16 ${scheme.text} font-semibold text-base gap-4`}>
          <button
            onClick={() => setFilterOpen(false)}
            className="absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold mb-4">Filters</h2>

          {/* Category custom dropdown */}
          <div className="relative" ref={catRef}>
            <label className={`block text-sm mb-1 ${scheme.textSecondary}`}>Category</label>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className={`w-full p-2 rounded text-sm text-left ${scheme.card} ${scheme.text} border ${scheme.border}`}
            >
              {selectedCategory}
            </button>

            {categoryOpen && (
              <div
                className={`absolute left-0 w-full mt-1 rounded-md ${scheme.card} border ${scheme.border} ${scheme.text} z-50`}
              >
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCategoryOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:${scheme.hover} ${
                      selectedCategory === cat ? `${scheme.accent} text-white font-semibold` : ''
                    }`}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brands custom dropdown - only show on brands page */}
          {showBrandsFilter && (
            <div className="relative" ref={brandRef}>
              <label className={`block text-sm mb-1 ${scheme.textSecondary}`}>Brand</label>
              <button
                onClick={() => setBrandOpen(!brandOpen)}
                className={`w-full p-2 rounded text-sm text-left ${scheme.card} ${scheme.text} border ${scheme.border}`}
              >
                {selectedBrand}
              </button>

              {brandOpen && (
                <div
                  className={`absolute left-0 w-full mt-1 rounded-md ${scheme.card} border ${scheme.border} ${scheme.text} z-50 max-h-48 overflow-y-auto`}
                >
                  {brands.map((brand) => (
                    <div
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setBrandOpen(false);
                      }}
                      className={`px-4 py-2 text-sm cursor-pointer hover:${scheme.hover} ${
                        selectedBrand === brand ? `${scheme.accent} text-white font-semibold` : ''
                      }`}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Price range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={`block text-sm mb-1 ${scheme.textSecondary}`}>Price From</label>
              <input
                type="number"
                min={0}
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className={`w-full p-2 rounded text-sm ${scheme.card} ${scheme.text} border ${scheme.border}`}
                placeholder="$0"
              />
            </div>
            <div className="flex-1">
              <label className={`block text-sm mb-1 ${scheme.textSecondary}`}>Price To</label>
              <input
                type="number"
                min={0}
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className={`w-full p-2 rounded text-sm ${scheme.card} ${scheme.text} border ${scheme.border}`}
                placeholder="$1000"
              />
            </div>
          </div>

          {/* Apply filters button */}
          <button
            onClick={() => {
              setFilterOpen(false);
              if (onApplyFilters) onApplyFilters();
            }}
            className={`mt-6 w-[90%] mx-auto py-2 ${scheme.accent} text-white font-semibold rounded-md`}
          >
            Apply Filters
          </button>

          {/* Clear filters button */}
          <button
            onClick={() => {
              if (onClearFilters) {
                onClearFilters();
              }
            }}
            className={`w-[90%] mx-auto py-2 mt-2 ${scheme.card} ${scheme.textSecondary} border ${scheme.border} rounded-md hover:${scheme.hover}`}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
}
