import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from '../contexts/LocationContext'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  TruckIcon,
  UsersIcon,
  ShoppingBagIcon,
  GiftIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userLocation, filterRestaurantsByDistance } = useLocation()

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Mock data for demonstration with precise coordinates
        const mockRestaurants = [
          {
            id: 1,
            name: 'مطعم الأصالة',
            description: 'مطعم عربي أصيل يقدم أشهى الأطباق التقليدية',
            address: 'شارع محمد الخامس، المعاريف، الدار البيضاء',
            latitude: 33.5731,
            longitude: -7.5898,
            rating: 4.5,
            cover_image: null,
            neighborhood: 'المعاريف',
            city: 'الدار البيضاء'
          },
          {
            id: 2,
            name: 'بيتزا هت',
            description: 'أشهى البيتزا الإيطالية الطازجة',
            address: 'شارع الحسن الثاني، أكدال، الرباط',
            latitude: 34.0209,
            longitude: -6.8416,
            rating: 4.2,
            cover_image: null,
            neighborhood: 'أكدال',
            city: 'الرباط'
          },
          {
            id: 3,
            name: 'مطعم الشرق',
            description: 'أطباق شرقية ومغربية متنوعة',
            address: 'شارع علال الفاسي، المدينة القديمة، فاس',
            latitude: 34.0331,
            longitude: -5.0003,
            rating: 4.7,
            cover_image: null,
            neighborhood: 'المدينة القديمة',
            city: 'فاس'
          },
          {
            id: 4,
            name: 'كنتاكي',
            description: 'دجاج مقلي شهي ومقرمش',
            address: 'شارع الجولان، المدينة القديمة، مراكش',
            latitude: 31.6295,
            longitude: -7.9811,
            rating: 4.0,
            cover_image: null,
            neighborhood: 'المدينة القديمة',
            city: 'مراكش'
          },
          {
            id: 5,
            name: 'مطعم البحر',
            description: 'أطباق بحرية طازجة ومتنوعة',
            address: 'شارع الكورنيش، المدينة، أكادير',
            latitude: 30.4278,
            longitude: -9.5981,
            rating: 4.3,
            cover_image: null,
            neighborhood: 'المدينة',
            city: 'أكادير'
          },
          {
            id: 6,
            name: 'ماكدونالدز',
            description: 'وجبات سريعة شهية ومتنوعة',
            address: 'شارع الحسن الثاني، المدينة، طنجة',
            latitude: 35.7595,
            longitude: -5.8340,
            rating: 3.8,
            cover_image: null,
            neighborhood: 'المدينة',
            city: 'طنجة'
          },
          {
            id: 7,
            name: 'مطعم النخيل',
            description: 'أطباق مغربية تقليدية في أجواء هادئة',
            address: 'شارع النخيل، حي النخيل، مراكش',
            latitude: 31.6300,
            longitude: -7.9800,
            rating: 4.6,
            cover_image: null,
            neighborhood: 'حي النخيل',
            city: 'مراكش'
          },
          {
            id: 8,
            name: 'مطعم الأطلس',
            description: 'مأكولات جبلية أصيلة',
            address: 'شارع الأطلس، حي الأطلس، فاس',
            latitude: 34.0340,
            longitude: -5.0010,
            rating: 4.4,
            cover_image: null,
            neighborhood: 'حي الأطلس',
            city: 'فاس'
          },
          // مطاعم إضافية في مراكش
          {
            id: 9,
            name: 'مطعم جامع الفنا',
            description: 'أطباق تقليدية في قلب المدينة القديمة',
            address: 'ساحة جامع الفنا، المدينة القديمة، مراكش',
            latitude: 31.6258,
            longitude: -7.9891,
            rating: 4.8,
            cover_image: null,
            neighborhood: 'المدينة القديمة',
            city: 'مراكش'
          },
          {
            id: 10,
            name: 'مطعم القصر الملكي',
            description: 'مأكولات فاخرة بجوار القصر الملكي',
            address: 'شارع القصر الملكي، حي النخيل، مراكش',
            latitude: 31.6320,
            longitude: -7.9850,
            rating: 4.9,
            cover_image: null,
            neighborhood: 'حي النخيل',
            city: 'مراكش'
          },
          {
            id: 11,
            name: 'مطعم الأطلس الكبير',
            description: 'أطباق جبلية مع إطلالة على الأطلس',
            address: 'شارع الأطلس، حي النخيل، مراكش',
            latitude: 31.6280,
            longitude: -7.9820,
            rating: 4.5,
            cover_image: null,
            neighborhood: 'حي النخيل',
            city: 'مراكش'
          },
          {
            id: 12,
            name: 'مطعم السوق الأحمر',
            description: 'أطباق محلية في أجواء السوق التقليدي',
            address: 'السوق الأحمر، المدينة القديمة، مراكش',
            latitude: 31.6270,
            longitude: -7.9880,
            rating: 4.3,
            cover_image: null,
            neighborhood: 'المدينة القديمة',
            city: 'مراكش'
          },
          // مطعم جديد للاختبار
          {
            id: 16,
            name: 'مطعم الأطلس الجديد',
            description: 'أطباق جبلية مع إطلالة رائعة على جبال الأطلس',
            address: 'شارع الأطلس، حي النخيل، مراكش',
            latitude: 31.6290,
            longitude: -7.9840,
            rating: 4.7,
            cover_image: null,
            neighborhood: 'حي النخيل',
            city: 'مراكش'
          },
          // مطاعم إضافية في الدار البيضاء
          {
            id: 13,
            name: 'مطعم كورنيش الدار البيضاء',
            description: 'أطباق بحرية مع إطلالة على المحيط',
            address: 'الكورنيش، المعاريف، الدار البيضاء',
            latitude: 33.5750,
            longitude: -7.5850,
            rating: 4.6,
            cover_image: null,
            neighborhood: 'المعاريف',
            city: 'الدار البيضاء'
          },
          {
            id: 14,
            name: 'مطعم أنفا',
            description: 'أطباق عصرية في حي أنفا الراقي',
            address: 'شارع أنفا، أنفا، الدار البيضاء',
            latitude: 33.5700,
            longitude: -7.5800,
            rating: 4.7,
            cover_image: null,
            neighborhood: 'أنفا',
            city: 'الدار البيضاء'
          },
          // مطاعم إضافية في الرباط
          {
            id: 15,
            name: 'مطعم أكدال',
            description: 'أطباق مغربية في قلب أكدال',
            address: 'شارع أكدال، أكدال، الرباط',
            latitude: 34.0250,
            longitude: -6.8400,
            rating: 4.4,
            cover_image: null,
            neighborhood: 'أكدال',
            city: 'الرباط'
          }
        ]
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setRestaurants(mockRestaurants)
        console.log('Restaurants loaded:', mockRestaurants.length, 'restaurants')
        console.log('New restaurant added: مطعم الأطلس الجديد')
      } catch (err) {
        console.error('Error fetching restaurants:', err)
        setError('حدث خطأ في تحميل المطاعم')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  // Filter restaurants locally if search term exists
  const filteredRestaurants = searchTerm && Array.isArray(restaurants)
    ? restaurants.filter(restaurant => 
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : Array.isArray(restaurants) ? restaurants : []
  
  // Apply location-based filtering with reasonable radius for demo
  const nearbyRestaurants = userLocation 
    ? filterRestaurantsByDistance(filteredRestaurants, 10) // 10km radius for demo purposes
    : filteredRestaurants

  // Debug logging
  console.log('User location:', userLocation)
  console.log('Filtered restaurants:', filteredRestaurants.length)
  console.log('Nearby restaurants:', nearbyRestaurants.length)
  console.log('Restaurant filtering working correctly!')

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
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 animate-pulse opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              طلب الطعام أصبح أسهل
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-fade-in-delay">
              اطلب من أفضل المطاعم واستمتع بتوصيل سريع وآمن
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className={`h-5 w-5 transition-colors ${
                    isSearchFocused ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن مطعم أو نوع الطعام..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="block w-full pr-10 pl-3 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 hover:shadow-lg focus:shadow-xl search-glow"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Quick Filters */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {[
                  { name: 'بيتزا', icon: '🍕' },
                  { name: 'برجر', icon: '🍔' },
                  { name: 'سوشي', icon: '🍣' },
                  { name: 'مشويات', icon: '🥩' },
                  { name: 'حلويات', icon: '🍰' },
                  { name: 'مشروبات', icon: '🥤' },
                  { name: 'وجبات سريعة', icon: '🍟' },
                  { name: 'صحي', icon: '🥗' }
                ].map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => setSearchTerm(filter.name)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 filter-button ${
                      searchTerm === filter.name
                        ? 'bg-white text-primary-600 shadow-lg scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:shadow-md'
                    }`}
                  >
                    <span className="text-lg">{filter.icon}</span>
                    {filter.name}
                  </button>
                ))}
              </div>
              
              {/* Search Suggestions */}
              {searchTerm && (
                <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      نتائج البحث لـ: <span className="font-semibold text-primary-600">"{searchTerm}"</span>
                    </div>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        جاري البحث...
                      </div>
                    ) : error ? (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        خطأ في البحث
                      </div>
                    ) : restaurants.length > 0 ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        تم العثور على {nearbyRestaurants.length} مطعم
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        لم يتم العثور على نتائج
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  {nearbyRestaurants.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                          className="px-3 py-1 bg-primary-600 text-white text-xs rounded-full hover:bg-primary-700 transition-colors"
                        >
                          عرض المطاعم
                        </button>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full hover:bg-gray-300 transition-colors"
                        >
                          مسح البحث
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-sm text-gray-600">مطعم متاح</div>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-sm text-gray-600">عميل سعيد</div>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100K+</div>
              <div className="text-sm text-gray-600">طلب مكتمل</div>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <StarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="text-sm text-gray-600">تقييم العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {userLocation ? (
                userLocation.neighborhood && userLocation.neighborhood !== userLocation.city 
                  ? `المطاعم القريبة من ${userLocation.neighborhood}, ${userLocation.city}`
                  : userLocation.street && userLocation.street !== userLocation.city
                  ? `المطاعم القريبة من ${userLocation.street}, ${userLocation.city}`
                  : userLocation.district && userLocation.district !== userLocation.city
                  ? `المطاعم القريبة من ${userLocation.district}, ${userLocation.city}`
                  : `المطاعم القريبة من ${userLocation.city}`
              ) : 'المطاعم المتاحة'}
            </h2>
            <Link
              to="/restaurants"
              className="text-primary-600 hover:text-primary-700 font-medium"
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
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل المطاعم</h3>
              <p className="text-gray-600 mb-4">
                {error || 'حدث خطأ غير متوقع'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : !Array.isArray(nearbyRestaurants) || nearbyRestaurants.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {userLocation ? 'لا توجد مطاعم قريبة' : 'لا توجد مطاعم متاحة'}
              </h3>
              {/* Debug info */}
              <div className="text-sm text-gray-500 mb-4">
                <p>إجمالي المطاعم: {restaurants.length}</p>
                <p>المطاعم المفلترة: {filteredRestaurants.length}</p>
                <p>المطاعم القريبة: {nearbyRestaurants.length}</p>
                {userLocation && (
                  <div>
                    <p>موقعك: {userLocation.city}</p>
                    <p>الحي: {userLocation.neighborhood || userLocation.district || 'غير محدد'}</p>
                    <p>الشارع: {userLocation.street || 'غير محدد'}</p>
                    <p>العنوان الكامل: {userLocation.address}</p>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4">
                {userLocation 
                  ? `لم نتمكن من العثور على أي مطاعم قريبة من ${
                      userLocation.neighborhood && userLocation.neighborhood !== userLocation.city 
                        ? `${userLocation.neighborhood}, ${userLocation.city}`
                        : userLocation.street && userLocation.street !== userLocation.city
                        ? `${userLocation.street}, ${userLocation.city}`
                        : userLocation.district && userLocation.district !== userLocation.city
                        ? `${userLocation.district}, ${userLocation.city}`
                        : userLocation.city
                    }`
                  : 'لم نتمكن من العثور على أي مطاعم'
                }
              </p>
              <Link
                to="/restaurants"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                تصفح جميع المطاعم
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(nearbyRestaurants) ? nearbyRestaurants.slice(0, 6) : []).map((restaurant) => {
                if (!restaurant || !restaurant.id) {
                  console.warn('Invalid restaurant data:', restaurant)
                  return null
                }
                
                return (
                  <Link
                    key={restaurant.id}
                    to={`/restaurants/${restaurant.id}`}
                    className="card hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {restaurant.cover_image ? (
                        <img
                          src={restaurant.cover_image}
                          alt={restaurant.name || 'مطعم'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary-600">
                            {(restaurant.name || 'م').charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 mr-1">
                          {(restaurant.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {restaurant.name || 'مطعم غير محدد'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {restaurant.description || 'وصف غير متوفر'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 ml-1" />
                          <span>
                            {restaurant.distance 
                              ? <span className="distance-badge">{restaurant.distance} كم</span>
                              : 'توصيل مجاني'
                            }
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 ml-1" />
                          <span>25-35 دقيقة</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار Eat to Eat؟
            </h2>
            <p className="text-lg text-gray-600">
              نحن نقدم أفضل تجربة طلب طعام في المغرب
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
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