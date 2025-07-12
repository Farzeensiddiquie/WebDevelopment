"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { productAPI } from '../../../utils/api';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import ProgressLink from '../../../components/ProgressLink';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useUser();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b3b1f');
  const [selectedSize, setSelectedSize] = useState('Large');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('rating');
  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        const productData = response.data; // Extract data from response
        console.log('Product data received:', productData);
        console.log('Product image URL:', productData.image);
        setProduct(productData);
        setSelectedImage(productData.image);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${scheme.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`min-h-screen ${scheme.background} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-500">{error || 'Product not found.'}</p>
        </div>
      </div>
    );
  }

  const handleSubmitReview = () => {
    const newReview = {
      name: user?.name || 'Anonymous',
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };
    setReviews([...reviews, newReview]);
    setShowModal(false);
    setReviewText('');
    setReviewRating(0);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
      
      showToast(`${product.name} added to cart successfully!`, 'success', 'cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('Failed to add to cart', 'error');
    }
  };

  return (
    <main className={`min-h-screen ${scheme.background} px-4 py-6 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2">
            {/* Desktop View: Thumbnails on left, main image on right */}
            <div className="hidden lg:flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {[product.image, product.image, product.image, product.image].map((img, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 ${scheme.card} rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === img ? scheme.accent : 'border-transparent'} hover:${scheme.hover}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Desktop thumbnail failed to load:', img);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className={`flex-1 aspect-square ${scheme.card} rounded-2xl overflow-hidden`}>
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Desktop image failed to load:', selectedImage);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Desktop image loaded successfully:', selectedImage);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile View: Main image on top, thumbnails below */}
            <div className="lg:hidden">
              <div className={`aspect-square ${scheme.card} rounded-2xl overflow-hidden mb-4`}>
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Mobile image failed to load:', selectedImage);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Mobile image loaded successfully:', selectedImage);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {[product.image, product.image, product.image, product.image].map((img, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 ${scheme.card} rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === img ? scheme.accent : 'border-transparent'} hover:${scheme.hover}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Mobile thumbnail failed to load:', img);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className={`w-full lg:w-1/2 ${scheme.card} rounded-xl shadow-md p-6 border ${scheme.border}`}>
            <h1 className={`text-xl sm:text-2xl font-black ${scheme.text}`}>{product.name}</h1>
            <div className="flex items-center gap-2 my-2">
              <span className="text-yellow-500 text-lg">★ {product.rating || 4.5}</span>
              <span className={`${scheme.textSecondary} text-sm`}>({reviews.length} Reviews)</span>
            </div>

            <div className="flex items-center gap-4 text-lg sm:text-xl font-semibold mt-4">
              <span>${product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="line-through text-gray-400">${product.oldPrice}</span>
                  <span className="text-red-500">
                    -{Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className={`${scheme.textSecondary} text-sm mt-4`}>{product.description || 'Stylish and comfortable, perfect for any occasion.'}</p>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Select Color:</p>
              <div className="flex gap-2">
                {["#3b3b1f", "#003049", "#1c1c1c"].map((color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer ${selectedColor === color ? scheme.accent : scheme.border}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Choose Size:</p>
              <div className="flex gap-2 flex-wrap">
                {["Small", "Medium", "Large", "X-Large"].map(size => (
                  <button
                    key={size}
                    className={`px-4 py-1 border rounded-full ${selectedSize === size ? `${scheme.accent} text-white` : scheme.border}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className={`flex items-center border rounded-full ${scheme.border}`}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3">-</button>
                <span className="px-4">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3">+</button>
              </div>
              <button onClick={handleAddToCart} className={`${scheme.accent} text-white px-6 py-2 rounded-full hover:opacity-90`}>
                Add to Cart
              </button>
            </div>

            {/* Explore More Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <ProgressLink
                href="/shop"
                className={`group relative inline-flex items-center justify-center w-full px-8 py-4 ${scheme.card} text-${scheme.text} font-bold text-lg border ${scheme.border} rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <span className="mr-2">Explore More Products</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </ProgressLink>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className={`flex border-b ${scheme.border}`}>
            <button
              className={`px-4 py-2 ${activeTab === 'rating' ? `border-b-2 ${scheme.accent}` : ''}`}
              onClick={() => setActiveTab('rating')}
            >
              Reviews
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'description' ? `border-b-2 ${scheme.accent}` : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'rating' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-semibold ${scheme.text}`}>Customer Reviews</h3>
                  <button
                    onClick={() => setShowModal(true)}
                    className={`${scheme.accent} text-white px-4 py-2 rounded-full text-sm`}
                  >
                    Write a Review
                  </button>
                </div>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div key={index} className={`border-b pb-4 ${scheme.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-semibold ${scheme.text}`}>{review.name}</span>
                        <span className="text-yellow-500">★ {review.rating}</span>
                        <span className={`${scheme.textSecondary} text-sm`}>{review.date}</span>
                      </div>
                      <p className={`${scheme.textSecondary}`}>{review.text}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <p className={`${scheme.textSecondary}`}>No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>Product Description</h3>
                <p className={`${scheme.textSecondary} leading-relaxed`}>
                  {product.description || 'This product offers excellent quality and comfort. Perfect for everyday wear and special occasions.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${scheme.card} p-6 rounded-lg w-full max-w-md mx-4`}>
            <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>Write a Review</h3>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Review:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className={`w-full p-2 border rounded ${scheme.border} ${scheme.background} ${scheme.text}`}
                rows="4"
                placeholder="Share your thoughts about this product..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 border rounded ${scheme.border} ${scheme.text}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className={`px-4 py-2 ${scheme.accent} text-white rounded`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}