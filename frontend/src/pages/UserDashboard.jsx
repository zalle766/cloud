import React from 'react'
import { Link } from 'react-router-dom'
import { 
  UserIcon, 
  MapPinIcon, 
  ShoppingBagIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline'

const UserDashboard = () => {
  // بيانات تجريبية للمستخدم
  const userStats = {
    totalOrders: 12,
    favoriteRestaurants: 5,
    totalSpent: 450,
    averageRating: 4.8
  }

  const recentOrders = [
    {
      id: 1,
      restaurant: 'مطعم الأطلس',
      items: 'طاجين لحم، سلطة، مشروب',
      total: 85,
      status: 'تم التوصيل',
      date: '2024-01-15',
      rating: 5
    },
    {
      id: 2,
      restaurant: 'بيتزا إيطاليا',
      items: 'بيتزا مارغريتا، مشروب',
      total: 65,
      status: 'قيد التوصيل',
      date: '2024-01-14',
      rating: null
    },
    {
      id: 3,
      restaurant: 'سوشي طوكيو',
      items: 'سوشي متنوع، شاي أخضر',
      total: 120,
      status: 'تم التوصيل',
      date: '2024-01-13',
      rating: 4
    }
  ]

  const favoriteRestaurants = [
    {
      id: 1,
      name: 'مطعم الأطلس',
      cuisine: 'مغربي',
      rating: 4.8,
      distance: '2.5 كم',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
    },
    {
      id: 2,
      name: 'بيتزا إيطاليا',
      cuisine: 'إيطالي',
      rating: 4.6,
      distance: '1.8 كم',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200'
    },
    {
      id: 3,
      name: 'سوشي طوكيو',
      cuisine: 'ياباني',
      rating: 4.9,
      distance: '3.2 كم',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="mt-2 text-gray-600">مرحباً بك في لوحة تحكمك الشخصية</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBagIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي الطلبات</p>
                <p className="text-2xl font-semibold text-gray-900">{userStats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المطاعم المفضلة</p>
                <p className="text-2xl font-semibold text-gray-900">{userStats.favoriteRestaurants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPinIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي المصروف</p>
                <p className="text-2xl font-semibold text-gray-900">{userStats.totalSpent} درهم</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">متوسط التقييم</p>
                <p className="text-2xl font-semibold text-gray-900">{userStats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">الطلبات الأخيرة</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{order.restaurant}</h4>
                      <p className="text-sm text-gray-500">{order.items}</p>
                      <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                        <span className="text-sm text-gray-500">{order.date}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          order.status === 'تم التوصيل' ? 'bg-green-100 text-green-800' :
                          order.status === 'قيد التوصيل' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{order.total} درهم</p>
                      {order.rating && (
                        <div className="flex items-center mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-500 mr-1">{order.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/orders"
                  className="w-full btn btn-outline text-center"
                >
                  عرض جميع الطلبات
                </Link>
              </div>
            </div>
          </div>

          {/* Favorite Restaurants */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">المطاعم المفضلة</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {favoriteRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="flex items-center space-x-4 space-x-reverse">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{restaurant.name}</h4>
                      <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                      <div className="flex items-center mt-1 space-x-2 space-x-reverse">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-500 mr-1">{restaurant.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{restaurant.distance}</span>
                      </div>
                    </div>
                    <Link
                      to={`/restaurant/${restaurant.id}`}
                      className="btn btn-primary text-sm"
                    >
                      طلب
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  to="/restaurants"
                  className="w-full btn btn-outline text-center"
                >
                  استكشاف المطاعم
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">الإجراءات السريعة</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/restaurants"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBagIcon className="h-6 w-6 text-primary-600 ml-3" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">طلب طعام</h4>
                    <p className="text-sm text-gray-500">استكشف المطاعم المتاحة</p>
                  </div>
                </Link>

                <Link
                  to="/user/profile"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserIcon className="h-6 w-6 text-primary-600 ml-3" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">الملف الشخصي</h4>
                    <p className="text-sm text-gray-500">إدارة معلوماتك الشخصية</p>
                  </div>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ClockIcon className="h-6 w-6 text-primary-600 ml-3" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">طلباتي</h4>
                    <p className="text-sm text-gray-500">تتبع طلباتك</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
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

export default UserDashboard
