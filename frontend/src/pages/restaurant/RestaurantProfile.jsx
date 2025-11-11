import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const RestaurantProfile = () => {
  const { user } = useAuth()
  const [restaurantData, setRestaurantData] = useState({
    name: user?.restaurant?.name || 'مطعم جديد',
    description: user?.restaurant?.description || '',
    address: user?.restaurant?.address || '',
    phone: user?.restaurant?.phone || '',
    email: user?.restaurant?.email || '',
    delivery_fee: user?.restaurant?.delivery_fee || 15.00,
    delivery_radius: user?.restaurant?.delivery_radius || 10,
    cuisine_type: user?.restaurant?.cuisine_type || 'عام',
    is_open: user?.restaurant?.is_open !== false
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setRestaurantData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // محاكاة حفظ البيانات
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      alert('تم حفظ التغييرات بنجاح!')
    }, 1000)
  }

  const handleCancel = () => {
    setRestaurantData({
      name: user?.restaurant?.name || 'مطعم جديد',
      description: user?.restaurant?.description || '',
      address: user?.restaurant?.address || '',
      phone: user?.restaurant?.phone || '',
      email: user?.restaurant?.email || '',
      delivery_fee: user?.restaurant?.delivery_fee || 15.00,
      delivery_radius: user?.restaurant?.delivery_radius || 10,
      cuisine_type: user?.restaurant?.cuisine_type || 'عام',
      is_open: user?.restaurant?.is_open !== false
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تعديل المطعم</h1>
              <p className="text-gray-600 mt-2">تحديث معلومات مطعمك</p>
            </div>
            <Link
              to="/restaurant/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">معلومات المطعم</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSave} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">المعلومات الأساسية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المطعم</label>
                    <input
                      type="text"
                      name="name"
                      value={restaurantData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع المطبخ</label>
                    <select
                      name="cuisine_type"
                      value={restaurantData.cuisine_type}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="عام">عام</option>
                      <option value="عربي">عربي</option>
                      <option value="إيطالي">إيطالي</option>
                      <option value="آسيوي">آسيوي</option>
                      <option value="مكسيكي">مكسيكي</option>
                      <option value="هندي">هندي</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف المطعم</label>
                  <textarea
                    name="description"
                    value={restaurantData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="اكتب وصفاً مختصراً عن مطعمك..."
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">معلومات الاتصال</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={restaurantData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={restaurantData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <textarea
                    name="address"
                    value={restaurantData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="اكتب العنوان الكامل للمطعم..."
                  />
                </div>
              </div>

              {/* Delivery Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">إعدادات التوصيل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رسوم التوصيل (ج.م)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="delivery_fee"
                      value={restaurantData.delivery_fee}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نطاق التوصيل (كم)</label>
                    <input
                      type="number"
                      name="delivery_radius"
                      value={restaurantData.delivery_radius}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">حالة المطعم</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_open"
                    checked={restaurantData.is_open}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    المطعم مفتوح للطلبات
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 space-x-reverse mt-8 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  إلغاء
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default RestaurantProfile
