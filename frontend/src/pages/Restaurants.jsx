import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getRestaurants } from '../services/supabaseApi'
import { useLocation } from '../contexts/LocationContext'
import { getDefaultRestaurantImage } from '../utils/restaurantImages'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const { userLocation } = useLocation()

  // استخدام الموقع المحفوظ
  const locationForQuery = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude
  } : null

  // حساب المسافة بين موقعين (بالكيلومتر) - صيغة Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null
    
    const R = 6371 // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Fetch restaurants from Supabase
  const { data: restaurantsData, isLoading, error: restaurantsError } = useQuery(
    ['restaurants', locationForQuery, searchTerm, selectedCategory],
    async () => {
      try {
        console.log('🔄 Starting to fetch restaurants...')
        const filters = {}
        
        // إضافة فلتر نوع المطبخ إذا كان محدداً
        if (selectedCategory && selectedCategory !== 'جميع الفئات') {
          filters.cuisine_type = selectedCategory
        }
        
        const result = await getRestaurants(filters)
        
        if (result.error) {
          console.error('❌ Error from getRestaurants:', result.error)
          throw result.error
        }
        
        // تطبيق البحث محلياً إذا كان موجوداً
        let restaurants = result.data || []
        console.log(`📊 Found ${restaurants.length} restaurants before filtering`)
        
        if (searchTerm && restaurants.length > 0) {
          const searchLower = searchTerm.toLowerCase()
          restaurants = restaurants.filter(restaurant => 
            restaurant.name?.toLowerCase().includes(searchLower) ||
            restaurant.description?.toLowerCase().includes(searchLower) ||
            restaurant.cuisine_type?.toLowerCase().includes(searchLower)
          )
          console.log(`🔍 After search filter: ${restaurants.length} restaurants`)
        }
        
        // حساب المسافة إذا كان الموقع متاحاً
        if (userLocation && userLocation.latitude && userLocation.longitude && restaurants.length > 0) {
          restaurants = restaurants.map(restaurant => {
            if (restaurant.latitude && restaurant.longitude) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                parseFloat(restaurant.latitude),
                parseFloat(restaurant.longitude)
              )
              return {
                ...restaurant,
                distance: distance ? Math.round(distance * 10) / 10 : null
              }
            }
            return { ...restaurant, distance: null }
          })
        }
        
        console.log(`✅ Returning ${restaurants.length} restaurants`)
        return restaurants
      } catch (error) {
        console.error('❌ Error in restaurants query:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        throw error
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      enabled: true, // يمكن تشغيل الاستعلام حتى بدون موقع
      onError: (error) => {
        console.error('❌ Query error callback:', error)
      }
    }
  )

  // التأكد من أن restaurants دائماً مصفوفة
  const restaurants = useMemo(() => {
    if (!restaurantsData) {
      return []
    }
    
    // إذا كانت البيانات مصفوفة مباشرة
    if (Array.isArray(restaurantsData)) {
      return restaurantsData
    }
    
    // محاولة استخراج المصفوفة من الاستجابة
    const data = restaurantsData?.data
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    
    return []
  }, [restaurantsData])

  const categories = [
    'جميع الفئات',
    'مشويات',
    'بيتزا',
    'برجر',
    'ساندويتش',
    'مأكولات عربية',
    'مأكولات آسيوية',
    'حلويات',
    'مشروبات'
  ]

  const sortOptions = [
    { value: 'distance', label: 'الأقرب' },
    { value: 'rating', label: 'الأعلى تقييماً' },
    { value: 'delivery_fee', label: 'أقل رسوم توصيل' },
    { value: 'name', label: 'الاسم' }
  ]

  // ترتيب المطاعم حسب الخيار المحدد
  const sortedRestaurants = useMemo(() => {
    if (!Array.isArray(restaurants)) return []
    
    const sorted = [...restaurants]
    
    switch (sortBy) {
      case 'distance':
        // إذا كان هناك موقع، تم الترتيب بالفعل حسب المسافة في useMemo السابق
        // إذا لم يكن هناك موقع، لا يمكن الترتيب حسب المسافة
        return sorted // تم الترتيب بالفعل حسب المسافة
      
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = typeof a.rating === 'number' ? a.rating : parseFloat(a.rating) || 0
          const ratingB = typeof b.rating === 'number' ? b.rating : parseFloat(b.rating) || 0
          return ratingB - ratingA // الأعلى تقييماً أولاً
        })
      
      case 'delivery_fee':
        return sorted.sort((a, b) => {
          const feeA = parseFloat(a.delivery_fee) || 0
          const feeB = parseFloat(b.delivery_fee) || 0
          return feeA - feeB // أقل رسوم أولاً
        })
      
      case 'name':
        return sorted.sort((a, b) => {
          return (a.name || '').localeCompare(b.name || '', 'ar')
        })
      
      default:
        return sorted
    }
  }, [restaurants, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {userLocation ? 'المطاعم القريبة منك' : 'المطاعم المتاحة'}
          </h1>
          
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="ابحث عن مطعم أو نوع الطعام..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category === 'جميع الفئات' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">
            {isLoading ? 'جاري التحميل...' : `تم العثور على ${Array.isArray(sortedRestaurants) ? sortedRestaurants.length : 0} مطعم${userLocation ? ' قريب' : ''}`}
          </p>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <FunnelIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">مرتب حسب: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
          </div>
        </div>

        {/* Restaurants Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="card-body">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : restaurantsError ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              خطأ في تحميل المطاعم
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {restaurantsError?.message || restaurantsError?.details || 'حدث خطأ في الاتصال بالخادم'}
            </p>
            {restaurantsError?.hint && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                💡 تلميح: {restaurantsError.hint}
              </p>
            )}
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-600 dark:bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
              >
                إعادة المحاولة
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                تأكد من أن البيانات موجودة في قاعدة البيانات Supabase
              </p>
            </div>
          </div>
        ) : Array.isArray(sortedRestaurants) && sortedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img
                    src={restaurant.cover_image || getDefaultRestaurantImage(restaurant.cuisine_type, restaurant.name)}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = getDefaultRestaurantImage(restaurant.cuisine_type, restaurant.name)
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {restaurant.is_open ? (
                      <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
                        مفتوح
                      </span>
                    ) : (
                      <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-medium px-2 py-1 rounded-full">
                        مغلق
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center shadow-md">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-1">
                      {(() => {
                        const rating = typeof restaurant.rating === 'number' 
                          ? restaurant.rating 
                          : parseFloat(restaurant.rating) || 0
                        return rating.toFixed(1)
                      })()}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {restaurant.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {restaurant.description || 'لا يوجد وصف متاح'}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 flex-1 min-w-0">
                        <MapPinIcon className="h-4 w-4 ml-1 flex-shrink-0" />
                        <span className="truncate">{restaurant.address || 'لا يوجد عنوان'}</span>
                      </div>
                      {restaurant.distance !== null && restaurant.distance !== undefined && (
                        <span className="text-primary-600 dark:text-primary-400 font-medium mr-2 flex items-center whitespace-nowrap">
                          <MapPinIcon className="h-3 w-3 ml-1" />
                          {restaurant.distance} كم
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 ml-1" />
                        <span>25-35 دقيقة</span>
                      </div>
                      
                      <div className="text-primary-600 dark:text-primary-400 font-medium">
                        {(restaurant.delivery_fee && parseFloat(restaurant.delivery_fee) > 0) ? 
                          `${restaurant.delivery_fee} ج.م` : 
                          'توصيل مجاني'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              لم يتم العثور على مطاعم
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || selectedCategory ? 'جرب البحث بكلمات مختلفة أو تغيير الفلاتر' : 'لا توجد مطاعم متاحة حالياً'}
            </p>
            {!searchTerm && !selectedCategory && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-right max-w-2xl mx-auto">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  <strong>💡 ملاحظة:</strong> إذا كانت المطاعم موجودة في قاعدة البيانات ولكن لا تظهر:
                </p>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside text-right">
                  <li>تأكد من تنفيذ ملف <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">database/supabase_seed_data.sql</code> في Supabase SQL Editor</li>
                  <li>تحقق من أن RLS policies تسمح بالوصول للمطاعم (يجب أن تكون policy "Anyone can view active restaurants" مفعلة)</li>
                  <li>افتح Console في المتصفح (F12) للتحقق من الأخطاء والرسائل</li>
                  <li>تأكد من أن جميع المطاعم لديها <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">is_active = true</code></li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Restaurants
