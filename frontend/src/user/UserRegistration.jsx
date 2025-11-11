import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './user-forms.css'
import apiService from '../services/api'
import { 
  UserIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/react/24/outline'

const UserRegistration = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    // معلومات المستخدم الأساسية
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    
    // معلومات العنوان (مبسطة)
    city: '',
    neighborhood: '',
    street: '',
    latitude: '',
    longitude: '',
    fullAddress: '',
    
    // شروط الاستخدام
    acceptTerms: false,
    acceptPrivacyPolicy: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const steps = [
    { id: 1, title: 'المعلومات الأساسية', icon: UserIcon },
    { id: 2, title: 'الموقع والموافقة', icon: MapPinIcon }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // مسح الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const handleArrayChange = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }))
  }

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع الجغرافي')
      return
    }

    setIsGettingLocation(true)
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const { latitude, longitude } = position.coords
      
      // استخدام خدمة reverse geocoding للحصول على العنوان
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`
      )
      
      if (response.ok) {
        const data = await response.json()
        
        // استخراج المعلومات من الاستجابة
        const street = data.localityInfo?.locality?.name || ''
        const neighborhood = data.localityInfo?.informative?.find(
          info => info.description === 'Neighborhood' || info.description === 'Sublocality'
        )?.name || ''
        const district = data.localityInfo?.administrativeArea?.name || ''
        const city = data.locality || data.city || ''
        
        // بناء العنوان الكامل
        const addressParts = []
        if (street && street !== city) addressParts.push(street)
        if (neighborhood && neighborhood !== city && neighborhood !== district) addressParts.push(neighborhood)
        if (district && district !== city) addressParts.push(district)
        if (city) addressParts.push(city)
        if (data.countryName) addressParts.push(data.countryName)
        
        const fullAddress = addressParts.join(', ')
        
        // تحديث البيانات
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          city: city,
          neighborhood: neighborhood,
          street: street,
          fullAddress: fullAddress
        }))
        
        alert('تم تحديد موقعك بنجاح!')
      } else {
        throw new Error('فشل في الحصول على العنوان')
      }
    } catch (error) {
      console.error('Error getting location:', error)
      alert('حدث خطأ في تحديد الموقع. يرجى المحاولة مرة أخرى أو إدخال العنوان يدوياً.')
    } finally {
      setIsGettingLocation(false)
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'الاسم الأول مطلوب'
        if (!formData.lastName) newErrors.lastName = 'اسم العائلة مطلوب'
        if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح'
        if (!formData.phoneNumber) newErrors.phoneNumber = 'رقم الهاتف مطلوب'
        if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة'
        else if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        if (!formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمة المرور غير متطابقة'
        break
      case 2:
        if (!formData.city) newErrors.city = 'المدينة مطلوبة'
        if (!formData.acceptTerms) newErrors.acceptTerms = 'يجب الموافقة على شروط الاستخدام'
        if (!formData.acceptPrivacyPolicy) newErrors.acceptPrivacyPolicy = 'يجب الموافقة على سياسة الخصوصية'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // التحقق من صحة الخطوة الأخيرة قبل الإرسال
    if (!validateStep(currentStep)) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // إعداد البيانات للإرسال
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        city: formData.city,
        neighborhood: formData.neighborhood,
        street: formData.street,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        fullAddress: formData.fullAddress
      }
      
      console.log('Sending user registration data:', userData)
      
      // إرسال البيانات للخادم
      const response = await apiService.register(userData)
      
      if (response.success) {
        // حفظ بيانات المستخدم في localStorage
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('isAuthenticated', 'true')
        }
        
        // رسالة نجاح
        alert('تم إنشاء الحساب بنجاح! مرحباً بك في Eat to Eat.')
        
        // توجيه المستخدم إلى صفحة المطاعم
        navigate('/restaurants')
      } else {
        throw new Error(response.message || 'فشل في إنشاء الحساب')
      }
      
    } catch (error) {
      console.error('Error creating user account:', error)
      
      // Handle different types of errors
      let errorMessage = 'حدث خطأ في إنشاء الحساب'
      
      if (error.message.includes('User already exists')) {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر.'
      } else if (error.message.includes('Validation errors')) {
        errorMessage = 'يرجى التأكد من صحة البيانات المدخلة'
      } else if (error.message.includes('Network')) {
        errorMessage = 'خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">المعلومات الأساسية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الأول *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="أدخل اسمك الأول"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العائلة *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="أدخل اسم العائلة"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="+212 6XX XXX XXX"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="أكد كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">الموقع والموافقة</h3>
            
            {/* زر تحديد الموقع التلقائي */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">تحديد الموقع التلقائي</h4>
                  <p className="text-sm text-blue-800">اضغط على الزر لتحديد موقعك الحالي بدقة</p>
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isGettingLocation}
                  className="btn btn-primary flex items-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapIcon className="h-4 w-4" />
                  <span>{isGettingLocation ? 'جاري التحديد...' : 'تحديد الموقع'}</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                >
                  <option value="">اختر المدينة</option>
                  <option value="الدار البيضاء">الدار البيضاء</option>
                  <option value="الرباط">الرباط</option>
                  <option value="مراكش">مراكش</option>
                  <option value="فاس">فاس</option>
                  <option value="أكادير">أكادير</option>
                  <option value="طنجة">طنجة</option>
                  <option value="مكناس">مكناس</option>
                  <option value="وجدة">وجدة</option>
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحي (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className="input"
                  placeholder="اسم الحي"
                />
              </div>
            </div>

            {/* عرض العنوان المحدد تلقائياً */}
            {formData.fullAddress && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 mb-2">العنوان المحدد:</h4>
                <p className="text-sm text-green-800">{formData.fullAddress}</p>
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-green-600 mt-1">
                    الإحداثيات: {formData.latitude}, {formData.longitude}
                  </p>
                )}
              </div>
            )}

            {/* حقول إضافية للعنوان الدقيق */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشارع (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="input"
                  placeholder="اسم الشارع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان الكامل (اختياري)
                </label>
                <textarea
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  className="input"
                  rows={2}
                  placeholder="العنوان الكامل مع التفاصيل"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="mt-1 rounded"
                />
                <span className="text-sm text-gray-700">
                  أوافق على <a href="#" className="text-primary-600 underline">شروط الاستخدام</a> *
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}

              <label className="flex items-start space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacyPolicy}
                  onChange={(e) => handleInputChange('acceptPrivacyPolicy', e.target.checked)}
                  className="mt-1 rounded"
                />
                <span className="text-sm text-gray-700">
                  أوافق على <a href="#" className="text-primary-600 underline">سياسة الخصوصية</a> *
                </span>
              </label>
              {errors.acceptPrivacyPolicy && (
                <p className="text-sm text-red-600">{errors.acceptPrivacyPolicy}</p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إنشاء حساب جديد</h1>
          <p className="mt-2 text-gray-600">انضم إلى Eat to Eat في خطوتين بسيطتين</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="mr-3 text-right">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link to="/user/login" className="text-primary-600 hover:text-primary-700 font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserRegistration
