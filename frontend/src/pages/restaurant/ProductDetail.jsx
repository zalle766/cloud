import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const ProductDetail = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [product, setProduct] = useState({
    id: 1,
    name: 'برجر دجاج',
    price: 75.00,
    description: 'برجر دجاج طازج مع الخضار والصلصة الخاصة',
    category: 'وجبات رئيسية',
    is_available: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    ingredients: ['دجاج طازج', 'خس', 'طماطم', 'بصل', 'صلصة خاصة'],
    preparation_time: '15-20 دقيقة',
    calories: '450 سعرة حرارية'
  })

  const [editData, setEditData] = useState({ ...product })
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setEditData({ ...editData, image: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setProduct({ ...editData })
    setIsEditing(false)
    setImagePreview(null)
    alert('تم حفظ التغييرات بنجاح!')
  }

  const handleCancel = () => {
    setEditData({ ...product })
    setIsEditing(false)
    setImagePreview(null)
  }

  const handleDelete = async () => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await api.delete(`/products/${product.id}`)
      
      if (response.data.success) {
        alert('تم حذف المنتج بنجاح!')
        navigate('/restaurant/products')
      } else {
        alert('فشل في حذف المنتج')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('حدث خطأ في حذف المنتج')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تفاصيل المنتج</h1>
              <p className="text-gray-600 mt-2">عرض وتعديل تفاصيل المنتج</p>
            </div>
            <Link
              to="/restaurant/products"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              العودة للمنتجات
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">معلومات المنتج</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل المنتج
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">صورة المنتج</h4>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="edit-product-image"
                      />
                      <label htmlFor="edit-product-image" className="cursor-pointer">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-2">اضغط لتغيير الصورة</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                      </label>
                    </div>
                    {(imagePreview || editData.image) && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">معاينة الصورة الجديدة:</p>
                        <img
                          src={imagePreview || editData.image}
                          alt="معاينة المنتج"
                          className="w-full h-64 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image'
                      }}
                    />
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-medium">غير متاح</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">المعلومات الأساسية</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ج.م)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editData.price}
                          onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({...editData, category: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="وجبات رئيسية">وجبات رئيسية</option>
                          <option value="بيتزا">بيتزا</option>
                          <option value="سلطات">سلطات</option>
                          <option value="مشروبات">مشروبات</option>
                          <option value="حلويات">حلويات</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">تفاصيل إضافية</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">وقت التحضير</label>
                      <input
                        type="text"
                        value={editData.preparation_time}
                        onChange={(e) => setEditData({...editData, preparation_time: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">السعرات الحرارية</label>
                      <input
                        type="text"
                        value={editData.calories}
                        onChange={(e) => setEditData({...editData, calories: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المكونات</label>
                      <textarea
                        value={editData.ingredients.join(', ')}
                        onChange={(e) => setEditData({...editData, ingredients: e.target.value.split(', ')})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="اكتب المكونات مفصولة بفاصلة"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">حالة المنتج</h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editData.is_available}
                      onChange={(e) => setEditData({...editData, is_available: e.target.checked})}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                    <label className="mr-2 text-sm font-medium text-gray-700">
                      المنتج متاح للطلب
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 space-x-reverse mt-8 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    حفظ التغييرات
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    تعديل المنتج
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`px-6 py-2 rounded-lg flex items-center ${
                      isDeleting
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isDeleting ? 'جاري الحذف...' : 'حذف المنتج'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
