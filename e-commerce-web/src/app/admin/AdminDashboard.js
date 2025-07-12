'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { productAPI } from '../../utils/api';
import ProgressLink from '../../components/ProgressLink';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useUser();
  const { getCurrentScheme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();
  const scheme = getCurrentScheme();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: 'men',
    stock: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.push('/login');
    }
  }, [user, loading, isAdmin, router]);

  // Load products
  useEffect(() => {
    if (user && isAdmin()) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await productAPI.getAll({ limit: 100 });
      setProducts(response.data || []);
    } catch (error) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData, selectedImage);
        showToast('Product updated successfully', 'success');
      } else {
        await productAPI.create(productData, selectedImage);
        showToast('Product created successfully', 'success');
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        brand: '',
        category: 'men',
        stock: ''
      });
      setSelectedImage(null);
      setImagePreview('');
      setEditingProduct(null);
      setShowAddForm(false);
      loadProducts();
    } catch (error) {
      showToast(error.message || 'Failed to save product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      brand: product.brand,
      category: product.category,
      stock: product.stock.toString()
    });
    setImagePreview(product.image);
    setSelectedImage(null);
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        showToast('Product deleted successfully', 'success');
        loadProducts();
      } catch (error) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      brand: '',
      category: 'men',
      stock: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingProduct(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user || !isAdmin()) {
    return null; // Will redirect
  }

  return (
    <div className={`min-h-screen ${scheme.background} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${scheme.text}`}>Admin Dashboard</h1>
            <p className={`${scheme.textSecondary} mt-2`}>Manage your products</p>
          </div>
          <ProgressLink
            href="/"
            className={`${scheme.card} ${scheme.text} px-4 py-2 rounded-lg border ${scheme.border} hover:${scheme.hover} transition`}
          >
            Back to Store
          </ProgressLink>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className={`${scheme.accent} ${scheme.text} px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition`}
          >
            {editingProduct ? 'Cancel Edit' : 'Add New Product'}
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className={`${scheme.card} p-6 rounded-lg border ${scheme.border} mb-8`}>
            <h2 className={`text-xl font-semibold ${scheme.text} mb-4`}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                    className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    step="0.01"
                    min="0"
                    className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                    min="0"
                    className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                    Product Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingProduct} // Required for new products, optional for editing
                    className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${scheme.text} mb-1`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="3"
                  className={`w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`${scheme.accent} ${scheme.text} px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition`}
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`${scheme.card} ${scheme.text} px-6 py-2 rounded-lg border ${scheme.border} font-semibold hover:${scheme.hover} transition`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className={`${scheme.card} rounded-lg border ${scheme.border} overflow-hidden`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${scheme.text}`}>Products ({products.length})</h3>
          </div>
          {loadingProducts ? (
            <div className="p-6 text-center">
              <p className={scheme.textSecondary}>Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${scheme.card} border-b ${scheme.border}`}>
                  <tr>
                    <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Product</th>
                    <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Brand</th>
                    <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Category</th>
                    <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Price</th>
                    <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Stock</th>
                    <th className={`text-left py-3 px-6 ${scheme.text} font-semibold`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className={`border-b ${scheme.border} hover:${scheme.hover}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                          />
                          <div>
                            <p className={`${scheme.text} font-medium`}>{product.name}</p>
                            <p className={`${scheme.textSecondary} text-sm`}>{product.description.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 ${scheme.text}`}>{product.brand}</td>
                      <td className={`py-4 px-6 ${scheme.text}`}>{product.category}</td>
                      <td className={`py-4 px-6 ${scheme.text}`}>${product.price}</td>
                      <td className={`py-4 px-6 ${scheme.text}`}>{product.stock}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className={`${scheme.accent} ${scheme.text} px-3 py-1 rounded text-sm hover:opacity-90 transition`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 