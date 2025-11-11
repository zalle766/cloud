import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from '../../contexts/LocationContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer', // ثابت للعملاء فقط
    phone: '',
    address: '',
    latitude: '',
    longitude: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { register } = useAuth()
  const { userLocation, openLocationModal } = useLocation()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🚀 Form submitted!')
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
      console.log('❌ Validation failed, stopping loading')
      return
    }
    
    console.log('✅ Validation passed, starting registration...')
    
    try {
      // إضافة timeout للتأكد من عدم الدوران إلى الأبد
      // Add timeout to ensure it doesn't spin forever
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('انتهت مهلة الطلب. يرجى المحاولة مرة أخرى'))
        }, 30000) // 30 ثانية
      })

      // تحويل البيانات إلى التنسيق المتوقع من الخادم الخلفي
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: 'customer',
        phone: formData.phone || null,
        address: formData.address || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }
      
      console.log('📤 Form data being sent:', registrationData)
      console.log('⏳ Starting registration process...')
      
      // استخدام Promise.race للتأكد من عدم تجاوز الوقت المحدد
      // Use Promise.race to ensure timeout
      console.log('⏳ About to call register function...')
      let result
      try {
        result = await Promise.race([
          register(registrationData),
          timeoutPromise
        ])
        console.log('✅ Promise.race completed')
      } catch (raceError) {
        console.error('❌ Promise.race error:', raceError)
        throw raceError
      }
      
      console.log('📥 Registration result received:', {
        hasResult: !!result,
        resultType: typeof result,
        resultIsNull: result === null,
        resultIsUndefined: result === undefined,
        resultKeys: result ? Object.keys(result) : [],
        success: result?.success,
        successType: typeof result?.success,
        successIsTrue: result?.success === true,
        successIsFalse: result?.success === false,
        hasError: !!result?.error,
        errorKeys: result?.error ? Object.keys(result.error) : [],
        errorMessage: result?.error?.general?.[0] || result?.error?.message || 'No error message',
        fullResult: JSON.stringify(result, null, 2)
      })
      
      // التحقق من النجاح بشكل صريح
      const isSuccess = result && result.success === true
      console.log('🔍 Checking success condition:', {
        hasResult: !!result,
        resultSuccess: result?.success,
        isSuccess: isSuccess
      })
      
      if (isSuccess) {
        console.log('✅ Registration successful! Redirecting...')
        // إيقاف التحميل فوراً
        setIsLoading(false)
        // الانتقال إلى الصفحة الرئيسية مع رسالة نجاح
        navigate('/', { 
          replace: true,
          state: { 
            registrationSuccess: true,
            message: 'تم إنشاء حسابك بنجاح! مرحباً بك في Eat to Eat 🎉'
          }
        })
      } else {
        console.error('❌ Registration failed!')
        console.error('❌ Result is:', result)
        console.error('❌ Result type:', typeof result)
        console.error('❌ Result keys:', result ? Object.keys(result) : 'null')
        console.error('❌ Success value:', result?.success)
        console.error('❌ Success type:', typeof result?.success)
        console.error('❌ Error details:', {
          result: result,
          error: result?.error,
          errorType: typeof result?.error,
          errorKeys: result?.error ? Object.keys(result.error) : []
        })
        
        // معالجة الأخطاء بشكل أفضل
        const errorObj = {}
        
        if (result?.error) {
          if (typeof result.error === 'object') {
            // إذا كان الخطأ كائن، نستخدمه مباشرة
            Object.keys(result.error).forEach(key => {
              if (Array.isArray(result.error[key])) {
                errorObj[key] = result.error[key]
              } else if (typeof result.error[key] === 'string') {
                errorObj[key] = [result.error[key]]
              } else {
                errorObj[key] = [String(result.error[key])]
              }
            })
          } else if (typeof result.error === 'string') {
            // إذا كان الخطأ نصاً، نحاول تحديد نوعه
            const errorMsg = result.error.toLowerCase()
            if (errorMsg.includes('email') || errorMsg.includes('بريد')) {
              errorObj.email = [result.error]
            } else if (errorMsg.includes('password') || errorMsg.includes('كلمة المرور')) {
              errorObj.password = [result.error]
            } else if (errorMsg.includes('name') || errorMsg.includes('اسم')) {
              errorObj.name = [result.error]
            } else {
              errorObj.general = [result.error]
            }
          } else {
            errorObj.general = ['حدث خطأ في إنشاء الحساب']
          }
        } else {
          errorObj.general = ['حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى']
        }
        
        setErrors(errorObj)
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
      const errorObj = {}
      
      if (error.name === 'AbortError') {
        errorObj.general = ['تم إلغاء الطلب']
      } else if (error.message) {
        // محاولة استخراج معلومات من رسالة الخطأ
        const errorMsg = error.message.toLowerCase()
        if (errorMsg.includes('timeout') || errorMsg.includes('مهلة')) {
          errorObj.general = ['انتهت مهلة الطلب. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى']
        } else if (errorMsg.includes('email') || errorMsg.includes('بريد')) {
          errorObj.email = [error.message]
        } else if (errorMsg.includes('password') || errorMsg.includes('كلمة المرور')) {
          errorObj.password = [error.message]
        } else if (errorMsg.includes('name') || errorMsg.includes('اسم')) {
          errorObj.name = [error.message]
        } else {
          errorObj.general = [error.message || 'حدث خطأ في الاتصال بالخادم']
        }
      } else {
        errorObj.general = ['حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى']
      }
      
      setErrors(errorObj)
    } finally {
      // التأكد من إيقاف التحميل دائماً - حتى لو حدث خطأ غير متوقع
      // Ensure loading is always stopped - even if unexpected error occurs
      console.log('🛑 Stopping loading spinner (finally block)')
      setIsLoading(false)
      console.log('✅ Loading stopped')
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
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب عميل
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* رسالة تحذيرية للحقول المطلوبة */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  الحقول المطلوبة
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>يجب ملء الحقول التالية: الاسم الكامل، البريد الإلكتروني، كلمة المرور، وتأكيد كلمة المرور</p>
                </div>
              </div>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    {errors.general ? 'خطأ في إنشاء الحساب' : 'يرجى تصحيح الأخطاء التالية'}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, messages]) => {
                        // تخطي عرض الأخطاء العامة إذا كانت هناك أخطاء محددة
                        if (field === 'general' && Object.keys(errors).length > 1) {
                          return null
                        }
                        
                        const fieldLabels = {
                          name: 'الاسم الكامل',
                          email: 'البريد الإلكتروني',
                          password: 'كلمة المرور',
                          password_confirmation: 'تأكيد كلمة المرور',
                          phone: 'رقم الهاتف',
                          address: 'العنوان',
                          general: 'خطأ عام'
                        }
                        
                        const fieldLabel = fieldLabels[field] || field
                        const messageText = Array.isArray(messages) ? messages.join(', ') : String(messages)
                        
                        return (
                          <li key={field} className="font-medium">
                            <span className="font-semibold">{fieldLabel}:</span> {messageText}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setErrors({})}
                    className="text-red-400 hover:text-red-600"
                    aria-label="إغلاق"
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
                الاسم الكامل
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الهاتف
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
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                العنوان
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل عنوانك"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                تحديد الموقع الحالي
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>جاري إنشاء الحساب...</span>
                </div>
              ) : (
                'إنشاء حساب عميل'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
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

export default CustomerRegister
