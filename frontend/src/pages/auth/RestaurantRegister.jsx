import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'restaurant', // ثابت لأصحاب المطاعم فقط
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    restaurant_name: '',
    restaurant_description: '',
    restaurant_phone: '',
    cuisine_type: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    // التحقق من الحقول المطلوبة
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = ['الاسم الكامل مطلوب']
    }
    
    if (!formData.email.trim()) {
      newErrors.email = ['البريد الإلكتروني مطلوب']
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ['البريد الإلكتروني غير صحيح']
    }
    
    if (!formData.restaurant_name.trim()) {
      newErrors.restaurant_name = ['اسم المطعم مطلوب']
    }
    
    if (!formData.password) {
      newErrors.password = ['كلمة المرور مطلوبة']
    } else if (formData.password.length < 8) {
      newErrors.password = ['كلمة المرور يجب أن تكون 8 أحرف على الأقل']
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = ['كلمة المرور غير متطابقة']
    }
    
    if (Object.keys(newErrors).length > 0) {
      newErrors.general = ['يرجى ملء جميع الحقول المطلوبة بشكل صحيح']
      setErrors(newErrors)
      setIsLoading(false)
      return
    }
    
    try {
      console.log('Form data being sent:', formData)
      
      // إضافة بيانات افتراضية للحقول المفقودة
      const completeFormData = {
        ...formData,
        restaurant_address: formData.restaurant_address || formData.address || '',
        restaurant_latitude: formData.restaurant_latitude || formData.latitude || '0',
        restaurant_longitude: formData.restaurant_longitude || formData.longitude || '0',
        restaurant_phone: formData.restaurant_phone || formData.phone || '',
        restaurant_email: formData.restaurant_email || formData.email || '',
        delivery_fee: formData.delivery_fee || '15.00',
        delivery_radius: formData.delivery_radius || '10',
        cuisine_type: formData.cuisine_type || 'عام'
      }
      
      console.log('Complete form data:', completeFormData)
      const result = await register(completeFormData)
      console.log('Registration result:', result)
      
      if (result && result.success) {
        alert('تم إنشاء الحساب بنجاح!')
        navigate('/restaurant/dashboard')
      } else {
        console.log('Registration failed:', result?.error)
        if (result?.error && typeof result.error === 'object') {
          setErrors(result.error)
        } else {
          setErrors({ general: [result?.error || 'حدث خطأ في إنشاء الحساب'] })
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error.name === 'AbortError') {
        setErrors({ general: ['تم إلغاء الطلب'] })
      } else {
        setErrors({ general: ['حدث خطأ في الاتصال بالخادم'] })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع الجغرافي')
      return
    }

    const loadingMessage = document.createElement('div')
    loadingMessage.textContent = 'جاري تحديد الموقع...'
    loadingMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-family: Arial, sans-serif;
    `
    document.body.appendChild(loadingMessage)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        document.body.removeChild(loadingMessage)
        
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        })
        
        alert('تم تحديد الموقع بنجاح!')
      },
      (error) => {
        document.body.removeChild(loadingMessage)
        
        let errorMessage = 'حدث خطأ في تحديد الموقع'
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض السماح بالوصول للموقع الجغرافي'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'الموقع غير متاح حالياً'
            break
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع'
            break
        }
        
        alert(errorMessage)
        console.error('Error getting location:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب صاحب مطعم
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link
              to="/restaurant/login"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Validation errors
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, messages]) => (
                        <li key={field}>
                          {Array.isArray(messages) ? messages.join(', ') : messages}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setErrors({})}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                اسم صاحب المطعم
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="أدخل اسمك الكامل"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(errors.name) ? errors.name.join(', ') : errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="أدخل بريدك الإلكتروني"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(errors.email) ? errors.email.join(', ') : errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="restaurant_name" className="block text-sm font-medium text-gray-700">
                اسم المطعم
              </label>
              <input
                id="restaurant_name"
                name="restaurant_name"
                type="text"
                required
                value={formData.restaurant_name}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل اسم المطعم"
              />
            </div>

            <div>
              <label htmlFor="cuisine_type" className="block text-sm font-medium text-gray-700">
                نوع المطبخ
              </label>
              <select
                id="cuisine_type"
                name="cuisine_type"
                value={formData.cuisine_type}
                onChange={handleChange}
                className="mt-1 input"
              >
                <option value="">اختر نوع المطبخ</option>
                <option value="arabic">عربي</option>
                <option value="italian">إيطالي</option>
                <option value="chinese">صيني</option>
                <option value="indian">هندي</option>
                <option value="mexican">مكسيكي</option>
                <option value="french">فرنسي</option>
                <option value="japanese">ياباني</option>
                <option value="thai">تايلندي</option>
                <option value="american">أمريكي</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <label htmlFor="restaurant_description" className="block text-sm font-medium text-gray-700">
                وصف المطعم
              </label>
              <textarea
                id="restaurant_description"
                name="restaurant_description"
                rows={3}
                value={formData.restaurant_description}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل وصف مختصر للمطعم"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم هاتف صاحب المطعم
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل رقم هاتفك"
              />
            </div>

            <div>
              <label htmlFor="restaurant_phone" className="block text-sm font-medium text-gray-700">
                رقم هاتف المطعم
              </label>
              <input
                id="restaurant_phone"
                name="restaurant_phone"
                type="tel"
                value={formData.restaurant_phone}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل رقم هاتف المطعم"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                عنوان المطعم
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل عنوان المطعم"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                تحديد موقع المطعم
              </button>
              
              {(formData.latitude && formData.longitude) && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-800">
                      تم تحديد الموقع بنجاح: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(errors.password) ? errors.password.join(', ') : errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                تأكيد كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`input pr-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                  placeholder="أعد إدخال كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {Array.isArray(errors.password_confirmation) ? errors.password_confirmation.join(', ') : errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'إنشاء حساب صاحب مطعم'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/restaurant/login"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RestaurantRegister
