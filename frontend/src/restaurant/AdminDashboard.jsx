import React, { useState, useEffect } from 'react'
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [isLoading, setIsLoading] = useState(true)

  // بيانات تجريبية للمطاعم المعلقة
  const mockRestaurants = [
    {
      id: 1,
      restaurantName: 'مطعم الأصالة الجديد',
      description: 'مطعم عربي أصيل يقدم أشهى الأطباق التقليدية',
      cuisineType: 'عربي',
      phoneNumber: '+212 6XX XXX XXX',
      email: 'restaurant@example.com',
      street: 'شارع محمد الخامس',
      neighborhood: 'المعاريف',
      city: 'الدار البيضاء',
      latitude: 33.5731,
      longitude: -7.5898,
      ownerName: 'أحمد محمد',
      ownerPhone: '+212 6XX XXX XXX',
      ownerEmail: 'ahmed@example.com',
      ownerIdNumber: '123456789',
      partnershipType: 'individual',
      licenseNumber: 'LIC123456',
      licenseType: 'تجارية',
      licenseExpiryDate: '2025-12-31',
      taxNumber: 'TAX123456',
      commercialRegister: 'CR123456',
      verificationStatus: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
      coverImage: null,
      menuImages: [],
      licenseImages: [],
      ownerDocuments: []
    },
    {
      id: 2,
      restaurantName: 'مطعم البحر الأزرق',
      description: 'أطباق بحرية طازجة ومتنوعة',
      cuisineType: 'مأكولات بحرية',
      phoneNumber: '+212 6XX XXX XXX',
      email: 'seafood@example.com',
      street: 'شارع الكورنيش',
      neighborhood: 'أنفا',
      city: 'الدار البيضاء',
      latitude: 33.5700,
      longitude: -7.5800,
      ownerName: 'فاطمة الزهراء',
      ownerPhone: '+212 6XX XXX XXX',
      ownerEmail: 'fatima@example.com',
      ownerIdNumber: '987654321',
      partnershipType: 'partnership',
      partnerName: 'محمد علي',
      partnerPhone: '+212 6XX XXX XXX',
      partnerEmail: 'mohamed@example.com',
      licenseNumber: 'LIC789012',
      licenseType: 'مطعم',
      licenseExpiryDate: '2025-06-30',
      taxNumber: 'TAX789012',
      commercialRegister: 'CR789012',
      verificationStatus: 'pending',
      submittedAt: '2024-01-14T14:20:00Z',
      coverImage: null,
      menuImages: [],
      licenseImages: [],
      ownerDocuments: []
    }
  ]

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setRestaurants(mockRestaurants)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (filter === 'all') return true
    return restaurant.verificationStatus === filter
  })

  const handleApprove = (restaurantId) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, verificationStatus: 'approved' }
          : restaurant
      )
    )
    alert('تم الموافقة على المطعم بنجاح!')
  }

  const handleReject = (restaurantId) => {
    const reason = prompt('يرجى إدخال سبب الرفض:')
    if (reason) {
      setRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === restaurantId 
            ? { ...restaurant, verificationStatus: 'rejected', rejectionReason: reason }
            : restaurant
        )
      )
      alert('تم رفض المطعم.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'في الانتظار'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      default: return 'غير محدد'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الإدارة</h1>
          <p className="mt-2 text-gray-600">إدارة طلبات تسجيل المطاعم</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">إجمالي المطاعم</p>
                <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {restaurants.filter(r => r.verificationStatus === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">موافق عليها</p>
                <p className="text-2xl font-bold text-gray-900">
                  {restaurants.filter(r => r.verificationStatus === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-600">مرفوضة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {restaurants.filter(r => r.verificationStatus === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex space-x-4 space-x-reverse">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'pending' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              في الانتظار
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'approved' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              موافق عليها
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'rejected' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مرفوضة
            </button>
          </div>
        </div>

        {/* Restaurants List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">طلبات المطاعم</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {restaurant.restaurantName}
                        </h4>
                        <p className="text-sm text-gray-600">{restaurant.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(restaurant.verificationStatus)}`}>
                        {getStatusText(restaurant.verificationStatus)}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span>{restaurant.street}, {restaurant.neighborhood}, {restaurant.city}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span>{restaurant.ownerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span>{restaurant.ownerPhone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      تم الإرسال: {formatDate(restaurant.submittedAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="btn btn-outline text-sm"
                    >
                      <EyeIcon className="h-4 w-4 ml-1" />
                      عرض التفاصيل
                    </button>
                    
                    {restaurant.verificationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(restaurant.id)}
                          className="btn btn-primary text-sm"
                        >
                          <CheckCircleIcon className="h-4 w-4 ml-1" />
                          موافقة
                        </button>
                        <button
                          onClick={() => handleReject(restaurant.id)}
                          className="btn btn-danger text-sm"
                        >
                          <XCircleIcon className="h-4 w-4 ml-1" />
                          رفض
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Details Modal */}
        {selectedRestaurant && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedRestaurant(null)}></div>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">تفاصيل المطعم</h3>
                </div>
                
                <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="space-y-6">
                    {/* معلومات المطعم الأساسية */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">معلومات المطعم الأساسية</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>اسم المطعم:</strong> {selectedRestaurant.restaurantName}</div>
                        <div><strong>نوع المطبخ:</strong> {selectedRestaurant.cuisineType}</div>
                        <div><strong>الهاتف:</strong> {selectedRestaurant.phoneNumber}</div>
                        <div><strong>البريد:</strong> {selectedRestaurant.email}</div>
                        <div className="md:col-span-2"><strong>الوصف:</strong> {selectedRestaurant.description}</div>
                      </div>
                    </div>

                    {/* العنوان */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">العنوان الدقيق</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>الشارع:</strong> {selectedRestaurant.street}</div>
                        <div><strong>الحي:</strong> {selectedRestaurant.neighborhood}</div>
                        <div><strong>المدينة:</strong> {selectedRestaurant.city}</div>
                        <div><strong>الإحداثيات:</strong> {selectedRestaurant.latitude}, {selectedRestaurant.longitude}</div>
                      </div>
                    </div>

                    {/* معلومات صاحب المطعم */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">معلومات صاحب المطعم</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>الاسم:</strong> {selectedRestaurant.ownerName}</div>
                        <div><strong>الهاتف:</strong> {selectedRestaurant.ownerPhone}</div>
                        <div><strong>البريد:</strong> {selectedRestaurant.ownerEmail}</div>
                        <div><strong>رقم الهوية:</strong> {selectedRestaurant.ownerIdNumber}</div>
                      </div>
                    </div>

                    {/* معلومات الشراكة */}
                    {selectedRestaurant.partnershipType === 'partnership' && (
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3">معلومات الشريك</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><strong>اسم الشريك:</strong> {selectedRestaurant.partnerName}</div>
                          <div><strong>هاتف الشريك:</strong> {selectedRestaurant.partnerPhone}</div>
                          <div><strong>بريد الشريك:</strong> {selectedRestaurant.partnerEmail}</div>
                        </div>
                      </div>
                    )}

                    {/* معلومات الرخصة */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">معلومات الرخصة</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>رقم الرخصة:</strong> {selectedRestaurant.licenseNumber}</div>
                        <div><strong>نوع الرخصة:</strong> {selectedRestaurant.licenseType}</div>
                        <div><strong>تاريخ الانتهاء:</strong> {selectedRestaurant.licenseExpiryDate}</div>
                        <div><strong>الرقم الضريبي:</strong> {selectedRestaurant.taxNumber}</div>
                        <div><strong>السجل التجاري:</strong> {selectedRestaurant.commercialRegister}</div>
                      </div>
                    </div>

                    {/* حالة المراجعة */}
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">حالة المراجعة</h4>
                      <div className="text-sm">
                        <div><strong>الحالة:</strong> 
                          <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRestaurant.verificationStatus)}`}>
                            {getStatusText(selectedRestaurant.verificationStatus)}
                          </span>
                        </div>
                        <div><strong>تاريخ الإرسال:</strong> {formatDate(selectedRestaurant.submittedAt)}</div>
                        {selectedRestaurant.rejectionReason && (
                          <div><strong>سبب الرفض:</strong> {selectedRestaurant.rejectionReason}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 space-x-reverse">
                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="btn btn-outline"
                  >
                    إغلاق
                  </button>
                  {selectedRestaurant.verificationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(selectedRestaurant.id)
                          setSelectedRestaurant(null)
                        }}
                        className="btn btn-primary"
                      >
                        موافقة
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedRestaurant.id)
                          setSelectedRestaurant(null)
                        }}
                        className="btn btn-danger"
                      >
                        رفض
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
