import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const RestaurantProducts = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'وجبات رئيسية',
    image: null,
    imagePreview: null
  })

  // جلب المنتجات من API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/restaurant/products')
      if (response.data.success) {
        setProducts(response.data.data)
      } else {
        setError('فشل في جلب المنتجات')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('حدث خطأ في جلب المنتجات')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewProduct({
          ...newProduct,
          image: file,
          imagePreview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    try {
      const formData = new FormData()
      formData.append('name', newProduct.name)
      formData.append('price', newProduct.price)
      formData.append('description', newProduct.description)
      formData.append('category', newProduct.category)
      formData.append('preparation_time', 15)
      
      if (newProduct.image) {
        formData.append('image', newProduct.image)
      }
      
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data.success) {
        alert('تم إضافة المنتج بنجاح!')
        setNewProduct({ 
          name: '', 
          price: '', 
          description: '', 
          category: 'وجبات رئيسية',
          image: null,
          imagePreview: null
        })
        setShowAddForm(false)
        fetchProducts() // إعادة جلب المنتجات
      } else {
        alert('فشل في إضافة المنتج')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('حدث خطأ في إضافة المنتج')
    }
  }

  const toggleAvailability = async (product) => {
    try {
      const response = await api.put(`/products/${product.id}`, {
        is_available: !product.is_available
      })
      
      if (response.data.success) {
        fetchProducts() // إعادة جلب المنتجات
      } else {
        alert('فشل في تحديث حالة المنتج')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('حدث خطأ في تحديث حالة المنتج')
    }
  }

  const [deletingId, setDeletingId] = useState(null)

  const deleteProduct = async (product) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      return
    }

    try {
      setDeletingId(product.id)
      console.log('Deleting product:', product.id)
      
      const response = await api.delete(`/products/${product.id}`)
      console.log('Delete response:', response.data)
      
      if (response.data.success) {
        alert('تم حذف المنتج بنجاح!')
        fetchProducts() // إعادة جلب المنتجات
      } else {
        alert('فشل في حذف المنتج: ' + (response.data.message || 'خطأ غير معروف'))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      if (error.response?.status === 403) {
        alert('غير مصرح لك بحذف هذا المنتج')
      } else if (error.response?.status === 404) {
        alert('المنتج غير موجود')
      } else {
        alert('حدث خطأ في حذف المنتج: ' + (error.response?.data?.message || error.message))
      }
    } finally {
      setDeletingId(null)
    }
  }

  const getImageUrl = (imagePath, productId = null) => {
    // إذا كان المسار يحتوي على http، استخدمه مباشرة
    if (imagePath && imagePath.startsWith('http')) {
      return imagePath
    }
    
    // إذا كان المسار نسبي، أضف base URL
    if (imagePath && imagePath !== '') {
      const baseUrl = 'http://localhost:8000'
      return `${baseUrl}/storage/${imagePath}`
    }
    
    // إذا لم يكن هناك مسار صورة، استخدم صورة افتراضية مختلفة لكل منتج
    const defaultImages = [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', // برجر
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', // بيتزا
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // سلطة
      'https://images.unsplash.com/photo-1529042410759-befb11dac5a9?w=400&h=300&fit=crop', // كباب
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', // سوشي
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', // معكرونة
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', // تاكو
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop', // شاورما
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop', // تشيز كيك
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', // قهوة
    ]
    
    // استخدام معرف المنتج لتحديد الصورة الافتراضية
    const imageIndex = productId ? (productId % defaultImages.length) : 0
    return defaultImages[imageIndex] || defaultImages[0]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
              <p className="text-gray-600 mt-2">إدارة منتجات مطعمك</p>
            </div>
            <Link
              to="/restaurant/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            إضافة منتج جديد
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة منتج جديد</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ج.م)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="وجبات رئيسية">وجبات رئيسية</option>
                  <option value="بيتزا">بيتزا</option>
                  <option value="سلطات">سلطات</option>
                  <option value="مشروبات">مشروبات</option>
                  <option value="حلويات">حلويات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="product-image"
                    />
                    <label htmlFor="product-image" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-2">اضغط لرفع صورة المنتج</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                    </label>
                  </div>
                  {newProduct.imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">معاينة الصورة:</p>
                      <div className="relative inline-block">
                        <img
                          src={newProduct.imagePreview}
                          alt="معاينة المنتج"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProduct({...newProduct, image: null, imagePreview: null})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 space-x-reverse">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  إضافة المنتج
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">قائمة المنتجات</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل المنتجات...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      {/* صورة المنتج */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={getImageUrl(product.image, product.id)}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
                            }}
                          />
                          {!product.is_available && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-medium">غير متاح</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* معلومات المنتج */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 space-x-reverse">
                              <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                {product.category}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.is_available 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {product.is_available ? 'متاح' : 'غير متاح'}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{product.description}</p>
                            <p className="text-lg font-semibold text-gray-900 mt-2">{product.price} ج.م</p>
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <Link
                              to={`/restaurant/products/${product.id}`}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200"
                            >
                              عرض
                            </Link>
                            <button
                              onClick={() => toggleAvailability(product)}
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                product.is_available
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {product.is_available ? 'إخفاء' : 'إظهار'}
                            </button>
                            <button
                              onClick={() => deleteProduct(product)}
                              disabled={deletingId === product.id}
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                deletingId === product.id
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              {deletingId === product.id ? 'جاري الحذف...' : 'حذف'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-600">ابدأ بإضافة منتج جديد لمطعمك</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantProducts
