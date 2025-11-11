import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  CameraIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const RestaurantRegistration = () => {
  const [formData, setFormData] = useState({
    // معلومات المطعم الأساسية
    restaurantName: '',
    description: '',
    cuisineType: '',
    phoneNumber: '',
    email: '',
    website: '',
    
    // معلومات العنوان
    street: '',
    neighborhood: '',
    city: '',
    latitude: '',
    longitude: '',
    fullAddress: '',
    
    // معلومات صاحب المطعم
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerIdNumber: '',
    
    // معلومات الشراكة
    partnershipType: 'individual', // individual, company, partnership
    partnerName: '',
    partnerPhone: '',
    partnerEmail: '',
    
    // معلومات الرخصة والترخيص
    licenseNumber: '',
    licenseType: '',
    licenseExpiryDate: '',
    taxNumber: '',
    commercialRegister: '',
    
    // معلومات التشغيل
    openingHours: {
      sunday: { open: '', close: '', closed: false },
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false }
    },
    
    // معلومات الدفع والتسعير
    deliveryFee: '',
    minimumOrder: '',
    paymentMethods: [],
    
    // الصور
    coverImage: null,
    menuImages: [],
    licenseImages: [],
    
    // معلومات إضافية
    specialFeatures: [],
    deliveryRadius: '',
    estimatedDeliveryTime: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const steps = [
    { id: 1, title: 'معلومات المطعم الأساسية', icon: BuildingOfficeIcon },
    { id: 2, title: 'معلومات العنوان', icon: MapPinIcon },
    { id: 3, title: 'معلومات صاحب المطعم', icon: UserIcon },
    { id: 4, title: 'معلومات الشراكة', icon: DocumentTextIcon },
    { id: 5, title: 'معلومات الترخيص', icon: DocumentTextIcon },
    { id: 6, title: 'ساعات العمل', icon: ClockIcon },
    { id: 7, title: 'الصور والمرفقات', icon: CameraIcon },
    { id: 8, title: 'مراجعة وإرسال', icon: DocumentTextIcon }
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

  const handleNestedInputChange = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
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

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleMultipleFileUpload = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...files]
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.restaurantName) newErrors.restaurantName = 'اسم المطعم مطلوب'
        if (!formData.description) newErrors.description = 'وصف المطعم مطلوب'
        if (!formData.cuisineType) newErrors.cuisineType = 'نوع المطبخ مطلوب'
        if (!formData.phoneNumber) newErrors.phoneNumber = 'رقم الهاتف مطلوب'
        break
      case 2:
        if (!formData.street) newErrors.street = 'اسم الشارع مطلوب'
        if (!formData.neighborhood) newErrors.neighborhood = 'الحي مطلوب'
        if (!formData.city) newErrors.city = 'المدينة مطلوبة'
        if (!formData.latitude) newErrors.latitude = 'خط العرض مطلوب'
        if (!formData.longitude) newErrors.longitude = 'خط الطول مطلوب'
        break
      case 3:
        if (!formData.ownerName) newErrors.ownerName = 'اسم صاحب المطعم مطلوب'
        if (!formData.ownerPhone) newErrors.ownerPhone = 'رقم هاتف صاحب المطعم مطلوب'
        if (!formData.ownerEmail) newErrors.ownerEmail = 'بريد صاحب المطعم مطلوب'
        break
      // يمكن إضافة المزيد من التحقق للخطوات الأخرى
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
    setIsSubmitting(true)
    
    try {
      // هنا ستكون عملية إرسال البيانات للخادم
      console.log('Restaurant registration data:', formData)
      
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('تم إرسال طلب التسجيل بنجاح! سيتم مراجعته من قبل الإدارة.')
      
    } catch (error) {
      console.error('Error submitting restaurant registration:', error)
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">معلومات المطعم الأساسية</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المطعم *
              </label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                className={`input ${errors.restaurantName ? 'border-red-500' : ''}`}
                placeholder="أدخل اسم المطعم"
              />
              {errors.restaurantName && (
                <p className="mt-1 text-sm text-red-600">{errors.restaurantName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المطعم *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`input ${errors.description ? 'border-red-500' : ''}`}
                rows={4}
                placeholder="أدخل وصف مختصر للمطعم ونوع الطعام المقدم"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المطبخ *
              </label>
              <select
                value={formData.cuisineType}
                onChange={(e) => handleInputChange('cuisineType', e.target.value)}
                className={`input ${errors.cuisineType ? 'border-red-500' : ''}`}
              >
                <option value="">اختر نوع المطبخ</option>
                <option value="arabic">عربي</option>
                <option value="moroccan">مغربي</option>
                <option value="italian">إيطالي</option>
                <option value="chinese">صيني</option>
                <option value="indian">هندي</option>
                <option value="fast-food">وجبات سريعة</option>
                <option value="seafood">مأكولات بحرية</option>
                <option value="desserts">حلويات</option>
                <option value="other">أخرى</option>
              </select>
              {errors.cuisineType && (
                <p className="mt-1 text-sm text-red-600">{errors.cuisineType}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input"
                  placeholder="restaurant@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="input"
                placeholder="https://www.restaurant.com"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">معلومات العنوان</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الشارع *
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className={`input ${errors.street ? 'border-red-500' : ''}`}
                placeholder="شارع محمد الخامس"
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحي *
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  className={`input ${errors.neighborhood ? 'border-red-500' : ''}`}
                  placeholder="المعاريف"
                />
                {errors.neighborhood && (
                  <p className="mt-1 text-sm text-red-600">{errors.neighborhood}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="الدار البيضاء"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  خط العرض (Latitude) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={`input ${errors.latitude ? 'border-red-500' : ''}`}
                  placeholder="33.5731"
                />
                {errors.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  خط الطول (Longitude) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={`input ${errors.longitude ? 'border-red-500' : ''}`}
                  placeholder="-7.5898"
                />
                {errors.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان الكامل
              </label>
              <textarea
                value={formData.fullAddress}
                onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                className="input"
                rows={3}
                placeholder="العنوان الكامل للمطعم"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">كيفية الحصول على الإحداثيات:</h4>
              <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>اذهب إلى <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">خرائط جوجل</a></li>
                <li>ابحث عن موقع مطعمك</li>
                <li>انقر بزر الماوس الأيمن على الموقع</li>
                <li>اختر "الإحداثيات" أو "Coordinates"</li>
                <li>انسخ الأرقام وأدخلها هنا</li>
              </ol>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">معلومات صاحب المطعم</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم صاحب المطعم *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className={`input ${errors.ownerName ? 'border-red-500' : ''}`}
                placeholder="الاسم الكامل لصاحب المطعم"
              />
              {errors.ownerName && (
                <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم هاتف صاحب المطعم *
                </label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                  className={`input ${errors.ownerPhone ? 'border-red-500' : ''}`}
                  placeholder="+212 6XX XXX XXX"
                />
                {errors.ownerPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.ownerPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بريد صاحب المطعم *
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                  className={`input ${errors.ownerEmail ? 'border-red-500' : ''}`}
                  placeholder="owner@example.com"
                />
                {errors.ownerEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهوية الوطنية
              </label>
              <input
                type="text"
                value={formData.ownerIdNumber}
                onChange={(e) => handleInputChange('ownerIdNumber', e.target.value)}
                className="input"
                placeholder="رقم الهوية الوطنية"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">معلومات الشراكة</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الملكية
              </label>
              <select
                value={formData.partnershipType}
                onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                className="input"
              >
                <option value="individual">فردي</option>
                <option value="company">شركة</option>
                <option value="partnership">شراكة</option>
              </select>
            </div>

            {formData.partnershipType === 'partnership' && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">معلومات الشريك</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الشريك
                  </label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => handleInputChange('partnerName', e.target.value)}
                    className="input"
                    placeholder="اسم الشريك"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم هاتف الشريك
                    </label>
                    <input
                      type="tel"
                      value={formData.partnerPhone}
                      onChange={(e) => handleInputChange('partnerPhone', e.target.value)}
                      className="input"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      بريد الشريك
                    </label>
                    <input
                      type="email"
                      value={formData.partnerEmail}
                      onChange={(e) => handleInputChange('partnerEmail', e.target.value)}
                      className="input"
                      placeholder="partner@example.com"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">معلومات الترخيص والرخصة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الرخصة
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="input"
                  placeholder="رقم الرخصة التجارية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الرخصة
                </label>
                <select
                  value={formData.licenseType}
                  onChange={(e) => handleInputChange('licenseType', e.target.value)}
                  className="input"
                >
                  <option value="">اختر نوع الرخصة</option>
                  <option value="commercial">تجارية</option>
                  <option value="restaurant">مطعم</option>
                  <option value="catering">تقديم الطعام</option>
                  <option value="delivery">توصيل الطعام</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ انتهاء الرخصة
              </label>
              <input
                type="date"
                value={formData.licenseExpiryDate}
                onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرقم الضريبي
                </label>
                <input
                  type="text"
                  value={formData.taxNumber}
                  onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                  className="input"
                  placeholder="الرقم الضريبي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السجل التجاري
                </label>
                <input
                  type="text"
                  value={formData.commercialRegister}
                  onChange={(e) => handleInputChange('commercialRegister', e.target.value)}
                  className="input"
                  placeholder="رقم السجل التجاري"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">ساعات العمل</h3>
            
            <div className="space-y-4">
              {Object.entries(formData.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-20">
                    <label className="block text-sm font-medium text-gray-700">
                      {day === 'sunday' && 'الأحد'}
                      {day === 'monday' && 'الاثنين'}
                      {day === 'tuesday' && 'الثلاثاء'}
                      {day === 'wednesday' && 'الأربعاء'}
                      {day === 'thursday' && 'الخميس'}
                      {day === 'friday' && 'الجمعة'}
                      {day === 'saturday' && 'السبت'}
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) => handleNestedInputChange('openingHours', day, { ...hours, closed: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">مغلق</span>
                  </div>
                  
                  {!hours.closed && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleNestedInputChange('openingHours', day, { ...hours, open: e.target.value })}
                        className="input w-32"
                      />
                      <span className="text-sm text-gray-600">إلى</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleNestedInputChange('openingHours', day, { ...hours, close: e.target.value })}
                        className="input w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">الصور والمرفقات</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الغلاف الرئيسية
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">اسحب وأفلت الصورة هنا أو انقر للاختيار</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('coverImage', e.target.files[0])}
                  className="hidden"
                  id="cover-image"
                />
                <label htmlFor="cover-image" className="mt-2 btn btn-outline">
                  اختيار صورة
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صور القائمة
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">اسحب وأفلت الصور هنا أو انقر للاختيار</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileUpload('menuImages', Array.from(e.target.files))}
                  className="hidden"
                  id="menu-images"
                />
                <label htmlFor="menu-images" className="mt-2 btn btn-outline">
                  اختيار صور متعددة
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صور الرخص والوثائق
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">اسحب وأفلت الوثائق هنا أو انقر للاختيار</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => handleMultipleFileUpload('licenseImages', Array.from(e.target.files))}
                  className="hidden"
                  id="license-images"
                />
                <label htmlFor="license-images" className="mt-2 btn btn-outline">
                  اختيار وثائق
                </label>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">مراجعة المعلومات</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h4 className="text-md font-medium text-gray-800">معلومات المطعم</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>الاسم:</strong> {formData.restaurantName}</div>
                <div><strong>نوع المطبخ:</strong> {formData.cuisineType}</div>
                <div><strong>الهاتف:</strong> {formData.phoneNumber}</div>
                <div><strong>البريد:</strong> {formData.email}</div>
              </div>
              
              <h4 className="text-md font-medium text-gray-800 mt-4">العنوان</h4>
              <div className="text-sm">
                <div><strong>الشارع:</strong> {formData.street}</div>
                <div><strong>الحي:</strong> {formData.neighborhood}</div>
                <div><strong>المدينة:</strong> {formData.city}</div>
                <div><strong>الإحداثيات:</strong> {formData.latitude}, {formData.longitude}</div>
              </div>
              
              <h4 className="text-md font-medium text-gray-800 mt-4">صاحب المطعم</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>الاسم:</strong> {formData.ownerName}</div>
                <div><strong>الهاتف:</strong> {formData.ownerPhone}</div>
                <div><strong>البريد:</strong> {formData.ownerEmail}</div>
                <div><strong>رقم الهوية:</strong> {formData.ownerIdNumber}</div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">تنبيه مهم:</h4>
              <p className="text-sm text-yellow-700">
                سيتم مراجعة طلب التسجيل من قبل الإدارة خلال 24-48 ساعة. 
                ستتلقى إشعاراً بالبريد الإلكتروني عند الموافقة على الطلب.
              </p>
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
          <h1 className="text-3xl font-bold text-gray-900">تسجيل مطعم جديد</h1>
          <p className="mt-2 text-gray-600">أدخل معلومات مطعمك ليظهر في منصة Eat to Eat</p>
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
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RestaurantRegistration
