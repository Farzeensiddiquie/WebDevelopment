'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import NProgress from "nprogress";
import { useTheme } from '../context/ThemeContext';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      showToast("Removed from wishlist", "info");
    } else {
      addToWishlist(product);
      showToast("Added to wishlist", "success", "wishlist");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast("Added to cart", "success", "cart");
  };

  return (
    <div
      className={`${scheme.card} rounded-xl p-4 cursor-pointer transition-all duration-200 ${scheme.hover} relative border ${scheme.border}`}
      onClick={() => { NProgress.start(); router.push(`/product/${product._id || product.id}`); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`w-full h-48 mb-4 rounded-lg overflow-hidden ${scheme.card} flex items-center justify-center relative`}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        {hovered && (
          <>
            {/* Wishlist Heart Icon */}
            <button
              className={`absolute top-3 left-3 ${scheme.card} ${scheme.textSecondary} p-2 rounded-full shadow hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 z-10 border ${scheme.border}`}
              onClick={handleWishlistToggle}
              title={isInWishlist(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product._id || product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            {/* Add to Cart + Icon */}
            <button
              className={`absolute top-3 right-3 ${scheme.accent} text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow hover:opacity-90 z-10 border ${scheme.border}`}
              onClick={handleAddToCart}
              title="Add to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      <h3 className={`text-sm font-medium mb-2 truncate ${scheme.text}`}>{product.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${scheme.text}`}>${product.price}</span>
          {product.oldPrice && (
            <span className={`line-through text-sm ${scheme.textSecondary}`}>${product.oldPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 text-sm">★</span>
          <span className={`text-sm ${scheme.textSecondary}`}>{product.rating}</span>
        </div>
      </div>
    </div>
  );
}