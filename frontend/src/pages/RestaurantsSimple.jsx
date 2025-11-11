import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  StarIcon,
  ClockIcon,
  TruckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  // بيانات المطاعم التجريبية مع صور حقيقية
  const restaurants = [
    {
      id: 1,
      name: 'مطعم الأطلس',
      description: 'أطباق مغربية أصيلة مع إطلالة رائعة',
      address: 'شارع محمد الخامس، المعاريف، الدار البيضاء',
      rating: 4.8,
      deliveryTime: '25-35 دقيقة',
      deliveryFee: '15 درهم',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'مغربي',
      distance: '2.5 كم'
    },
    {
      id: 2,
      name: 'بيتزا إيطاليا',
      description: 'أفضل البيتزا الإيطالية الأصيلة',
      address: 'شارع الحسن الثاني، وسط المدينة، الرباط',
      rating: 4.6,
      deliveryTime: '20-30 دقيقة',
      deliveryFee: '12 درهم',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'إيطالي',
      distance: '1.8 كم'
    },
    {
      id: 3,
      name: 'سوشي طوكيو',
      description: 'سوشي طازج ومأكولات يابانية أصيلة',
      address: 'شارع الأمير مولاي عبد الله، أكدال، الرباط',
      rating: 4.9,
      deliveryTime: '30-40 دقيقة',
      deliveryFee: '20 درهم',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'ياباني',
      distance: '3.2 كم'
    },
    {
      id: 4,
      name: 'برجر كينغ',
      description: 'أشهى البرجرز والوجبات السريعة',
      address: 'شارع مولاي إسماعيل، المعاريف، الدار البيضاء',
      rating: 4.4,
      deliveryTime: '15-25 دقيقة',
      deliveryFee: '10 درهم',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'وجبات سريعة',
      distance: '1.5 كم'
    },
    {
      id: 5,
      name: 'مطعم الصين الذهبي',
      description: 'أطباق صينية أصيلة وحلويات تقليدية',
      address: 'شارع الحسن الأول، وسط المدينة، فاس',
      rating: 4.7,
      deliveryTime: '25-35 دقيقة',
      deliveryFee: '18 درهم',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'صيني',
      distance: '2.8 كم'
    },
    {
      id: 6,
      name: 'مطعم الأطلس الجديد',
      description: 'أطباق جبلية مع إطلالة رائعة على جبال الأطلس',
      address: 'شارع الأطلس، حي النخيل، مراكش',
      rating: 4.7,
      deliveryTime: '30-40 دقيقة',
      deliveryFee: '22 درهم',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'مغربي',
      distance: '4.1 كم'
    },
    {
      id: 7,
      name: 'مطعم جامع الفنا',
      description: 'أطباق تقليدية في قلب المدينة القديمة',
      address: 'ساحة جامع الفنا، مراكش',
      rating: 4.8,
      deliveryTime: '25-35 دقيقة',
      deliveryFee: '15 درهم',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'مغربي',
      distance: '2.7 كم'
    },
    {
      id: 8,
      name: 'مطعم السوق الأحمر',
      description: 'أطباق محلية في أجواء السوق التقليدي',
      address: 'السوق الأحمر، فاس',
      rating: 4.3,
      deliveryTime: '25-35 دقيقة',
      deliveryFee: '16 درهم',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'مغربي',
      distance: '2.6 كم'
    },
    {
      id: 9,
      name: 'مطعم القصر الملكي',
      description: 'مأكولات فاخرة بجوار القصر الملكي',
      address: 'شارع القصر الملكي، الرباط',
      rating: 4.9,
      deliveryTime: '30-40 دقيقة',
      deliveryFee: '25 درهم',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&t=' + Date.now(),
      cuisine: 'مغربي',
      distance: '2.4 كم'
    }
  ]

  // تصفية المطاعم حسب البحث
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ترتيب المطاعم
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance)
      case 'deliveryTime':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">المطاعم المتاحة</h1>
          <p className="mt-2 text-gray-600">اختر من أفضل المطاعم في مدينتك</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن مطعم أو نوع الطعام..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">جميع المطابخ</option>
                  <option value="مغربي">مغربي</option>
                  <option value="إيطالي">إيطالي</option>
                  <option value="ياباني">ياباني</option>
                  <option value="صيني">صيني</option>
                  <option value="وجبات سريعة">وجبات سريعة</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="rating">ترتيب حسب التقييم</option>
                  <option value="distance">ترتيب حسب المسافة</option>
                  <option value="deliveryTime">ترتيب حسب وقت التوصيل</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.length > 0 ? (
            sortedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.log('Image failed to load:', restaurant.image)
                      // استخدام صورة افتراضية مختلفة لكل مطعم
                      const fallbackImages = [
                        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&t=' + Date.now(),
                        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&t=' + Date.now(),
                        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&t=' + Date.now(),
                        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&t=' + Date.now(),
                        'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400&h=300&fit=crop&t=' + Date.now(),
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&t=' + Date.now()
                      ]
                      const randomIndex = Math.floor(Math.random() * fallbackImages.length)
                      e.target.src = fallbackImages[randomIndex]
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', restaurant.name)
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1 space-x-reverse">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {restaurant.distance}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPinIcon className="h-4 w-4 ml-1" />
                    <span>{restaurant.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 ml-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 ml-1" />
                      <span>{restaurant.deliveryFee}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                      {restaurant.cuisine}
                    </span>
                    <Link
                      to={`/restaurant/${restaurant.id}`}
                      className="btn btn-primary text-sm"
                    >
                      عرض القائمة
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مطاعم</h3>
              <p className="text-gray-500">
                لم يتم العثور على مطاعم تطابق معايير البحث
              </p>
            </div>
          )}
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

export default Restaurants