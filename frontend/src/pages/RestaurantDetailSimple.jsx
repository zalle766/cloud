import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiService from '../services/api'

const RestaurantDetail = () => {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // بيانات تجريبية للمطاعم
  const mockRestaurants = {
    1: {
      id: 1,
      name: 'مطعم الأطلس',
      description: 'أطباق مغربية أصيلة مع إطلالة رائعة',
      address: 'شارع محمد الخامس، المعاريف، الدار البيضاء',
      phone: '+212661234567',
      email: 'info@atlas.com',
      rating: 4.8,
      delivery_fee: 15,
      is_open: true,
      cover_image: null
    },
    2: {
      id: 2,
      name: 'بيتزا إيطاليا',
      description: 'أفضل البيتزا الإيطالية الأصيلة',
      address: 'شارع الحسن الثاني، وسط المدينة، الرباط',
      phone: '+212661234568',
      email: 'info@italy.com',
      rating: 4.6,
      delivery_fee: 12,
      is_open: true,
      cover_image: null
    },
    3: {
      id: 3,
      name: 'سوشي طوكيو',
      description: 'سوشي طازج ومأكولات يابانية أصيلة',
      address: 'شارع الأمير مولاي عبد الله، أكدال، الرباط',
      phone: '+212661234569',
      email: 'info@tokyo.com',
      rating: 4.9,
      delivery_fee: 20,
      is_open: true,
      cover_image: null
    },
    12: {
      id: 12,
      name: 'مطعم القلعة التاريخية',
      description: 'مأكولات في أجواء تاريخية',
      address: 'شارع القلعة، مكناس، المغرب',
      phone: '+212661234578',
      email: 'info@historicalcastle.com',
      rating: 4.7,
      delivery_fee: 18,
      is_open: true,
      cover_image: null
    }
  }

  const mockProducts = {
    1: [
      { id: 1, name: 'كباب مشوي', description: 'كباب مشوي طازج مع الأرز والسلطة', price: 45, category: 'Grilled', is_available: true },
      { id: 2, name: 'شاورما دجاج', description: 'شاورما دجاج مع الخضار والصلصة', price: 35, category: 'Sandwiches', is_available: true },
      { id: 3, name: 'مشويات مشكلة', description: 'طبق مشويات متنوعة مع الأرز والسلطة', price: 80, category: 'Grilled', is_available: true },
      { id: 4, name: 'طاجين لحم', description: 'طاجين لحم تقليدي مع الخضار', price: 55, category: 'Traditional', is_available: true }
    ],
    2: [
      { id: 5, name: 'بيتزا مارغريتا', description: 'بيتزا بالجبن والطماطم الطازجة', price: 55, category: 'Pizza', is_available: true },
      { id: 6, name: 'بيتزا بيبروني', description: 'بيتزا بالبيبروني والجبن', price: 65, category: 'Pizza', is_available: true },
      { id: 7, name: 'بيتزا هاواي', description: 'بيتزا بالأناناس واللحم', price: 60, category: 'Pizza', is_available: true },
      { id: 8, name: 'معكرونة بولونيز', description: 'معكرونة باللحم المفروم والصلصة', price: 40, category: 'Pasta', is_available: true }
    ],
    3: [
      { id: 9, name: 'سوشي سالمون', description: 'سوشي سالمون طازج', price: 75, category: 'Sushi', is_available: true },
      { id: 10, name: 'سوشي تونة', description: 'سوشي تونة طازجة', price: 70, category: 'Sushi', is_available: true },
      { id: 11, name: 'سوشي جمبري', description: 'سوشي جمبري مقلي', price: 65, category: 'Sushi', is_available: true },
      { id: 12, name: 'رامن نودلز', description: 'شوربة نودلز يابانية', price: 45, category: 'Soup', is_available: true }
    ],
    12: [
      { id: 13, name: 'طاجين لحم تقليدي', description: 'طاجين لحم بالطريقة التقليدية', price: 55, category: 'Traditional', is_available: true },
      { id: 14, name: 'دجاج بالزعفران', description: 'دجاج بالزعفران والليمون', price: 50, category: 'Chicken', is_available: true },
      { id: 15, name: 'كسكس بالخضار', description: 'كسكس بالخضار الطازجة', price: 40, category: 'Traditional', is_available: true },
      { id: 16, name: 'حلوى مغربية', description: 'حلوى مغربية تقليدية', price: 30, category: 'Dessert', is_available: true }
    ]
  }

  useEffect(() => {
    fetchRestaurantData()
  }, [id])

  const fetchRestaurantData = async () => {
    try {
      setLoading(true)
      
      // محاولة جلب البيانات من API أولاً
      try {
        const response = await apiService.getRestaurant(id)
        if (response.success) {
          setRestaurant(response.data)
          setProducts(mockProducts[id] || [])
          return
        }
      } catch (apiError) {
        console.log('API failed, using mock data:', apiError.message)
      }
      
      // استخدام البيانات التجريبية إذا فشل API
      const mockRestaurant = mockRestaurants[id]
      if (mockRestaurant) {
        setRestaurant(mockRestaurant)
        setProducts(mockProducts[id] || [])
      } else {
        setError('المطعم غير موجود')
      }
      
    } catch (error) {
      console.error('Error fetching restaurant:', error)
      setError('حدث خطأ في جلب بيانات المطعم')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    alert(`تم إضافة "${product.name}" إلى السلة بنجاح!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المطعم...</p>
        </div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">المطعم غير موجود</h2>
          <p className="text-gray-600 mb-4">{error || 'يرجى التحقق من رابط المطعم'}</p>
          <Link 
            to="/restaurants"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة للمطاعم
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Restaurant Image */}
            <div className="lg:col-span-1">
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-600">
                  {restaurant.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h1>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(restaurant.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="mr-2 text-sm text-gray-600">
                      {restaurant.rating} (120 تقييم)
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {restaurant.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{restaurant.address}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{restaurant.phone}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-600">
                        رسوم التوصيل: {restaurant.delivery_fee > 0 ? `${restaurant.delivery_fee} درهم` : 'مجاني'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    restaurant.is_open 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.is_open ? 'مفتوح' : 'مغلق'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">قائمة الطعام</h2>
        
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">
                    {product.name.charAt(0)}
                  </span>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-blue-600">
                      {product.price} درهم
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      إضافة للسلة
                    </button>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    الفئة: {product.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد منتجات متاحة
            </h3>
            <p className="text-gray-600">
              لم يتم العثور على منتجات لهذا المطعم
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetail




