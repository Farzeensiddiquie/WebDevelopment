"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { productAPI, reviewAPI } from '../../../utils/api';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import { useTheme } from '../../../context/ThemeContext';
import { useProducts } from '../../../context/ProductContext';
import ProgressLink from '../../../components/ProgressLink';
import StarRating from '../../../components/StarRating';
import { Trash2 } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useUser();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { getCurrentScheme } = useTheme();
  const { updateProductRating } = useProducts();
  const scheme = getCurrentScheme();

  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
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
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product data and reviews from backend
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        setReviewsLoading(true);
        
        // Fetch product data
        const productResponse = await productAPI.getById(id);
        
        // Check if response contains an error
        if (productResponse && productResponse.error) {
          console.error('Failed to fetch product:', productResponse.error);
          setError('Failed to load product');
          return;
        }
        
        // Handle the response data
        const productData = productResponse.data || productResponse; // Extract data from response
        setProduct(productData);
        // Set initial selected image to first available image
        const imagesArr = (productData.images && productData.images.length > 0) ? productData.images : [productData.image];
        setSelectedImage(imagesArr[0]);

        // Fetch reviews and update product rating
        try {
          const reviewsResponse = await reviewAPI.getProductReviews(id, { limit: 20 });
          if (reviewsResponse && reviewsResponse.data) {
            setReviews(reviewsResponse.data);
            
            // Update product with latest rating from reviews
            if (reviewsResponse.stats && productData) {
              const newRating = reviewsResponse.stats.averageRating || productData.rating || 0;
              const newNumReviews = reviewsResponse.stats.totalReviews || productData.numReviews || 0;
              
              setProduct(prev => ({
                ...prev,
                rating: newRating,
                numReviews: newNumReviews
              }));
              
              // Update global product data in ProductContext
              updateProductRating(id, newRating, newNumReviews);
            }
          }
        } catch (reviewError) {
          console.error('Failed to fetch reviews:', reviewError);
          // Don't set error for reviews, just log it
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchProductAndReviews();
    }
  }, [id]);

  // Fetch latest product data from backend
  const fetchLatestProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      if (response && (response.data || response.rating)) {
        setProduct(response.data || response);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

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

  const handleSubmitReview = async () => {
    if (!user) {
      showToast('Please login to write a review', 'error');
      return;
    }

    if (reviewRating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    if (reviewText.trim().length < 10) {
      showToast('Review must be at least 10 characters long', 'error');
      return;
    }

    try {
      setSubmittingReview(true);
      
      const reviewData = {
        rating: reviewRating,
        text: reviewText.trim(),
        title: reviewTitle.trim() || undefined
      };

      const response = await reviewAPI.addReview(id, reviewData);
      
      // Check if response contains an error
      if (response && response.error) {
        showToast(response.error, 'error');
        return;
      }
      
      if (response && response.success) {
        showToast('Review submitted successfully!', 'success');
        
        // Refresh reviews
        const reviewsResponse = await reviewAPI.getProductReviews(id, { limit: 20 });
        if (reviewsResponse && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }
        
        // Update product rating
        if (product && response.stats) {
          const newRating = response.stats.averageRating || (product.rating ?? 0);
          const newNumReviews = response.stats.totalReviews || (product.numReviews ?? 0);
          
          console.log('Updating product rating:', {
            oldRating: product.rating ?? 0,
            newRating,
            oldNumReviews: product.numReviews ?? 0,
            newNumReviews
          });
          
          // Update local product state
          setProduct(prev => ({
            ...prev,
            rating: newRating,
            numReviews: newNumReviews
          }));
          
          // Update global product data in ProductContext
          updateProductRating(id, newRating, newNumReviews);
        }
        
        await fetchLatestProduct();
        setShowModal(false);
        setReviewText('');
        setReviewTitle('');
        setReviewRating(0);
      } else {
        showToast('Failed to submit review', 'error');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      showToast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAdmin) {
      showToast('Access denied. Admin privileges required.', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await reviewAPI.deleteReviewAdmin(reviewId);
      
      if (response && response.success) {
        showToast('Review deleted successfully', 'success');
        
        // Refresh reviews
        const reviewsResponse = await reviewAPI.getProductReviews(id, { limit: 20 });
        if (reviewsResponse && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }
        
        // Update product rating
        if (product && response.stats) {
          const newRating = response.stats.averageRating || (product.rating ?? 0);
          const newNumReviews = response.stats.totalReviews || (product.numReviews ?? 0);
          setProduct(prev => ({
            ...prev,
            rating: newRating,
            numReviews: newNumReviews
          }));
          // Update global product data in ProductContext
          updateProductRating(id, newRating, newNumReviews);
        }
        await fetchLatestProduct();
      } else {
        showToast('Failed to delete review', 'error');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      if (error.message?.includes('Access denied')) {
        showToast('Access denied. Admin privileges required.', 'error');
      } else {
        showToast('Failed to delete review', 'error');
      }
    }
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

  // Helper: get all images for gallery
  const galleryImages = (product.images && product.images.length > 0) ? product.images : [product.image];

  // Get colors and sizes from product
  const productColors = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors.map(c => c.hex)
    : ['#3b3b1f', '#003049', '#1c1c1c']; // fallback if no colors

  const productSizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : ['Small', 'Medium', 'Large', 'X-Large']; // fallback if no sizes

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
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 ${scheme.card} rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === img ? scheme.accent : scheme.border} hover:${scheme.hover}`}
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
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className={`w-20 h-20 ${scheme.card} rounded-lg overflow-hidden cursor-pointer
                      ${selectedImage === img
                        ? `${scheme.accent} border-4`
                        : `border-0`
                      } hover:${scheme.hover}`}
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
                          console.error('Thumbnail failed to load:', img);
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
              <StarRating 
                rating={product.rating || 0} 
                size="lg" 
                readonly={true} 
                showValue={true}
              />
              <span className={`${scheme.textSecondary} text-sm`}>({product.numReviews || reviews.length} Reviews)</span>
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
                {productColors.map((color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer ${selectedColor === color ? scheme.accent : scheme.border}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    title={product.colors && product.colors[i] ? product.colors[i].name : color}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Choose Size:</p>
              <div className="flex gap-2 flex-wrap">
                {productSizes.map(size => (
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
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className={`${scheme.textSecondary}`}>Loading reviews...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className={`border-b pb-4 ${scheme.border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${scheme.text}`}>{review.userName}</span>
                            <StarRating 
                              rating={review.rating} 
                              size="sm" 
                              readonly={true}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${scheme.textSecondary} text-sm`}>
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className={`p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 ${scheme.textSecondary} hover:text-red-600`}
                                title="Delete review (Admin only)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {review.title && (
                          <h4 className={`font-medium ${scheme.text} mb-1`}>{review.title}</h4>
                        )}
                        <p className={`${scheme.textSecondary}`}>{review.text}</p>
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <p className={`${scheme.textSecondary}`}>No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                )}
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
              <StarRating 
                rating={reviewRating} 
                size="lg" 
                readonly={false}
                onRatingChange={setReviewRating}
                className="justify-start"
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Title (Optional):</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className={`w-full p-2 border rounded ${scheme.border} ${scheme.background} ${scheme.text}`}
                placeholder="Brief title for your review..."
                maxLength={100}
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Review:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className={`w-full p-2 border rounded ${scheme.border} ${scheme.background} ${scheme.text}`}
                rows="4"
                placeholder="Share your thoughts about this product... (minimum 10 characters)"
                maxLength={1000}
              />
              <div className={`text-xs mt-1 ${scheme.textSecondary}`}>
                {reviewText.length}/1000 characters
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setReviewText('');
                  setReviewTitle('');
                  setReviewRating(0);
                }}
                className={`px-4 py-2 border rounded ${scheme.border} ${scheme.text}`}
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className={`px-4 py-2 ${scheme.accent} text-white rounded flex items-center gap-2`}
                disabled={submittingReview}
              >
                {submittingReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}