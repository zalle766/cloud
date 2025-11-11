import React, { useState, useEffect } from 'react'
import { Link, useLocation as useRouterLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getRestaurants } from '../services/supabaseApi'
import { useLocation } from '../contexts/LocationContext'
import { getDefaultRestaurantImage } from '../utils/restaurantImages'
import toast from 'react-hot-toast'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { userLocation } = useLocation()
  const routerLocation = useRouterLocation()

  // استخدام الموقع المحفوظ بدلاً من طلب الموقع في كل مرة
  const locationForQuery = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude
  } : null

  // حساب المسافة بين موقعين (بالكيلومتر) - صيغة Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Fetch restaurants from Supabase
  const { data: restaurantsData, isLoading, error: restaurantsError } = useQuery(
    ['restaurants', locationForQuery, searchTerm],
    async () => {
      const filters = {}
      
      // إضافة فلتر البحث إذا كان موجوداً
      if (searchTerm) {
        // سيتم تطبيق البحث في الكود أدناه
      }
      
      const result = await getRestaurants(filters)
      
      if (result.error) {
        throw result.error
      }
      
      // تطبيق البحث محلياً إذا كان موجوداً
      let restaurants = result.data || []
      if (searchTerm && restaurants.length > 0) {
        const searchLower = searchTerm.toLowerCase()
        restaurants = restaurants.filter(restaurant => 
          restaurant.name?.toLowerCase().includes(searchLower) ||
          restaurant.description?.toLowerCase().includes(searchLower) ||
          restaurant.cuisine_type?.toLowerCase().includes(searchLower)
        )
      }
      
      // حساب المسافة إذا كان الموقع متاحاً
      if (locationForQuery && restaurants.length > 0) {
        restaurants = restaurants.map(restaurant => {
          if (restaurant.latitude && restaurant.longitude) {
            const distance = calculateDistance(
              locationForQuery.latitude,
              locationForQuery.longitude,
              restaurant.latitude,
              restaurant.longitude
            )
            return { ...restaurant, distance }
          }
          return restaurant
        })
        // ترتيب حسب المسافة
        restaurants.sort((a, b) => (a.distance || 999) - (b.distance || 999))
      }
      
      return restaurants
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      enabled: true, // يمكن تشغيل الاستعلام حتى بدون موقع
      onError: (error) => {
        console.error('Error fetching restaurants:', error)
      }
    }
  )

  // عرض رسالة النجاح عند الوصول من صفحة التسجيل
  useEffect(() => {
    if (routerLocation.state?.registrationSuccess) {
      const message = routerLocation.state.message || 'تم إنشاء حسابك بنجاح! مرحباً بك في Eat to Eat 🎉'
      toast.success(message, {
        duration: 5000,
        icon: '🎉',
        style: {
          background: '#10b981',
          color: '#fff',
          fontSize: '16px',
          padding: '16px',
        }
      })
      // مسح state لتجنب إظهار الرسالة مرة أخرى عند التنقل
      window.history.replaceState({}, document.title)
    }
  }, [routerLocation.state])

  // التأكد من أن restaurants دائماً مصفوفة
  const restaurants = React.useMemo(() => {
    if (!restaurantsData) return []
    
    // إذا كانت البيانات مصفوفة مباشرة
    if (Array.isArray(restaurantsData)) return restaurantsData
    
    // محاولة استخراج المصفوفة من الاستجابة
    const data = restaurantsData?.data
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.restaurants && Array.isArray(data.restaurants)) return data.restaurants
    
    return []
  }, [restaurantsData])

  const features = [
    {
      icon: TruckIcon,
      title: 'توصيل سريع',
      description: 'توصيل في أقل من 30 دقيقة'
    },
    {
      icon: StarIcon,
      title: 'جودة عالية',
      description: 'أفضل المطاعم والوجبات'
    },
    {
      icon: MapPinIcon,
      title: 'تتبع مباشر',
      description: 'تتبع طلبك في الوقت الفعلي'
    },
    {
      icon: ClockIcon,
      title: 'متاح 24/7',
      description: 'خدمة متاحة على مدار الساعة'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              طلب الطعام أصبح أسهل
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              اطلب من أفضل المطاعم واستمتع بتوصيل سريع وآمن
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن مطعم أو نوع الطعام..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pr-10 pl-3 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              لماذا تختار Eat to Eat؟
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              نحن نقدم أفضل تجربة طلب طعام في مصر
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              المطاعم القريبة
            </h2>
            <Link
              to="/restaurants"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
            >
              عرض الكل
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="card-body">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : restaurantsError ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">خطأ في تحميل المطاعم</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {restaurantsError?.message || 'حدث خطأ في الاتصال بالخادم'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : Array.isArray(restaurants) && restaurants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">لا توجد مطاعم متاحة حالياً</p>
              <Link
                to="/restaurants"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                تصفح جميع المطاعم
              </Link>
            </div>
          ) : Array.isArray(restaurants) && restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.slice(0, 6).map((restaurant) => (
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
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center shadow-md">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-1">
                        {(restaurant.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {restaurant.name || 'مطعم'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {restaurant.description || 'لا يوجد وصف متاح'}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 ml-1" />
                        <span>توصيل مجاني</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 ml-1" />
                        <span>25-35 دقيقة</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">لا توجد مطاعم متاحة حالياً</p>
              <Link
                to="/restaurants"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                تصفح جميع المطاعم
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            جاهز لطلب الطعام؟
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            انضم إلى آلاف العملاء الذين يثقون في Eat to Eat
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
          >
            ابدأ الطلب الآن
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
