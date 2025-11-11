import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './user-forms.css'
import { 
  UserIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phoneNumber: '+212 6XX XXX XXX',
    street: 'شارع محمد الخامس',
    neighborhood: 'المعاريف',
    city: 'الدار البيضاء',
    latitude: '33.5731',
    longitude: '-7.5898',
    fullAddress: 'شارع محمد الخامس، المعاريف، الدار البيضاء',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    preferredLanguage: 'ar',
    favoriteCuisines: ['عربي', 'مغربي'],
    dietaryRestrictions: ['حلال'],
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true
  })

  const [originalData, setOriginalData] = useState({ ...formData })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSave = () => {
    // هنا ستكون عملية حفظ البيانات
    console.log('Saving user profile:', formData)
    setOriginalData({ ...formData })
    setIsEditing(false)
    alert('تم حفظ التغييرات بنجاح!')
  }

  const handleCancel = () => {
    setFormData({ ...originalData })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
              <p className="mt-2 text-gray-600">إدارة معلوماتك الشخصية وإعداداتك</p>
            </div>
            <div className="flex space-x-3 space-x-reverse">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <PencilIcon className="h-4 w-4 ml-2" />
                  تعديل الملف
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    <CheckIcon className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    <XMarkIcon className="h-4 w-4 ml-2" />
                    إلغاء
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-gray-500">{formData.email}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">العنوان</p>
                    <p className="text-sm text-gray-500">{formData.fullAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">الهاتف</p>
                    <p className="text-sm text-gray-500">{formData.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">البريد</p>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">المعلومات الشخصية</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">المعلومات الأساسية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الأول
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العائلة
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الميلاد
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الجنس
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">معلومات العنوان</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الشارع
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحي
                      </label>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                        className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الإحداثيات
                      </label>
                      <input
                        type="text"
                        value={`${formData.latitude}, ${formData.longitude}`}
                        disabled
                        className="input bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان الكامل
                    </label>
                    <textarea
                      value={formData.fullAddress}
                      onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">التفضيلات</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المطابخ المفضلة
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['عربي', 'مغربي', 'إيطالي', 'صيني', 'هندي', 'وجبات سريعة', 'مأكولات بحرية', 'حلويات'].map((cuisine) => (
                        <label key={cuisine} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            checked={formData.favoriteCuisines.includes(cuisine)}
                            onChange={(e) => handleArrayChange('favoriteCuisines', cuisine, e.target.checked)}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">{cuisine}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القيود الغذائية
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['حلال', 'نباتي', 'نباتي صرف', 'خالي من الجلوتين', 'خالي من اللاكتوز', 'قليل السكر'].map((restriction) => (
                        <label key={restriction} className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="checkbox"
                            checked={formData.dietaryRestrictions.includes(restriction)}
                            onChange={(e) => handleArrayChange('dietaryRestrictions', restriction, e.target.checked)}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">{restriction}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللغة المفضلة
                    </label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                      disabled={!isEditing}
                      className={`input ${!isEditing ? 'bg-gray-50' : ''}`}
                    >
                      <option value="ar">العربية</option>
                      <option value="fr">الفرنسية</option>
                      <option value="en">الإنجليزية</option>
                    </select>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">إعدادات الإشعارات</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications}
                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">الإشعارات عبر البريد الإلكتروني</span>
                    </label>
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.smsNotifications}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">الإشعارات عبر الرسائل النصية</span>
                    </label>
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.pushNotifications}
                        onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">الإشعارات الفورية</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
