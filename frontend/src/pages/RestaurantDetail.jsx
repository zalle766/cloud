import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getRestaurant, getMenuItems, getCategories } from '../services/supabaseApi'
import { useCart } from './Cart'
import { getDefaultRestaurantImage, getDefaultMenuItemImage } from '../utils/restaurantImages'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

const RestaurantDetail = () => {
  const { id } = useParams()
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data: restaurantData, isLoading: restaurantLoading } = useQuery(
    ['restaurant', id],
    async () => {
      const result = await getRestaurant(id)
      if (result.error) throw result.error
      return result.data
    }
  )

  const { data: categoriesData } = useQuery(
    ['categories', id],
    async () => {
      const result = await getCategories(id)
      if (result.error) return []
      return result.data || []
    }
  )

  const { data: productsData, isLoading: productsLoading } = useQuery(
    ['products', id, selectedCategory],
    async () => {
      const categoryId = selectedCategory && selectedCategory !== 'جميع الفئات' 
        ? categoriesData?.find(cat => cat.name === selectedCategory)?.id 
        : null
      const result = await getMenuItems(id, categoryId)
      if (result.error) throw result.error
      return result.data || []
    },
    {
      enabled: !!restaurantData
    }
  )

  const restaurant = restaurantData
  const products = productsData || []

  const categories = ['جميع الفئات', ...(categoriesData?.map(cat => cat.name) || [])]

  const handleAddToCart = (product) => {
    addItem(product, restaurant)
  }

  if (restaurantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">المطعم غير موجود</h2>
          <p className="text-gray-600">يرجى التحقق من رابط المطعم</p>
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
              <div className="aspect-w-16 aspect-h-9">
                <img
                  className="w-full h-64 object-cover rounded-lg"
                  src={restaurant.cover_image || getDefaultRestaurantImage(restaurant.cuisine_type, restaurant.name)}
                  alt={restaurant.name}
                  onError={(e) => {
                    e.target.src = getDefaultRestaurantImage(restaurant.cuisine_type, restaurant.name)
                  }}
                />
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
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(restaurant.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="mr-2 text-sm text-gray-600">
                      {restaurant.rating.toFixed(1)} ({restaurant.total_reviews} تقييم)
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {restaurant.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 ml-2" />
                      <span className="text-gray-600">{restaurant.address}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 ml-2" />
                      <span className="text-gray-600">
                        {restaurant.opening_time} - {restaurant.closing_time}
                      </span>
                    </div>
                    
                    {restaurant.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 ml-2" />
                        <span className="text-gray-600">{restaurant.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <span className="text-gray-600">
                        رسوم التوصيل: {restaurant.delivery_fee > 0 ? `${restaurant.delivery_fee} ج.م` : 'مجاني'}
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
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'جميع الفئات' ? '' : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (selectedCategory === '' && category === 'جميع الفئات') || 
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img
                    src={product.image_url || getDefaultMenuItemImage(product.name)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = getDefaultMenuItemImage(product.name)
                    }}
                  />
                  
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">غير متوفر</span>
                    </div>
                  )}
                </div>
                
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-primary-600">
                      {product.price?.toFixed(2)} ج.م
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.is_available}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="h-4 w-4 ml-1" />
                        إضافة
                      </button>
                    </div>
                  </div>
                  
                  {product.preparation_time && (
                    <div className="mt-2 text-sm text-gray-500">
                      وقت التحضير: {product.preparation_time} دقيقة
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد منتجات متاحة
            </h3>
            <p className="text-gray-600">
              لم يتم العثور على منتجات في هذه الفئة
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetail
