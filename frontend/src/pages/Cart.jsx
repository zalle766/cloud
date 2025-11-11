import React, { useState, useContext, createContext } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  MinusIcon, 
  TrashIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)

  const addItem = (product, restaurantData) => {
    setRestaurant(restaurantData)
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeItem = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId))
    
    // Clear restaurant if cart is empty
    if (items.length === 1) {
      setRestaurant(null)
    }
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    setRestaurant(null)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items,
    restaurant,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

const Cart = () => {
  const { 
    items, 
    restaurant, 
    removeItem, 
    updateQuantity, 
    getTotalPrice, 
    getTotalItems,
    clearCart 
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">أضف بعض المنتجات من المطاعم</p>
          <Link
            to="/restaurants"
            className="btn-primary"
          >
            تصفح المطاعم
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">
                  سلة التسوق ({getTotalItems()} منتج)
                </h2>
                {restaurant && (
                  <p className="text-sm text-gray-600 mt-1">
                    من مطعم: {restaurant.name}
                  </p>
                )}
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 space-x-reverse border-b border-gray-200 pb-4">
                      <div className="flex-shrink-0 h-20 w-20">
                        {item.image ? (
                          <img
                            className="h-20 w-20 rounded-lg object-cover"
                            src={item.image}
                            alt={item.name}
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">صورة</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-lg font-semibold text-primary-600 mt-1">
                          {item.price} ج.م
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <MinusIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <PlusIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    مسح السلة
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">ملخص الطلب</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="text-gray-900">{getTotalPrice()} ج.م</span>
                  </div>
                  
                  {restaurant && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">رسوم التوصيل:</span>
                      <span className="text-gray-900">
                        {restaurant.delivery_fee > 0 ? `${restaurant.delivery_fee} ج.م` : 'مجاني'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الضريبة (10%):</span>
                    <span className="text-gray-900">{(getTotalPrice() * 0.1).toFixed(2)} ج.م</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">المجموع الكلي:</span>
                      <span className="text-gray-900">
                        {(getTotalPrice() + (restaurant?.delivery_fee || 0) + (getTotalPrice() * 0.1)).toFixed(2)} ج.م
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full btn-primary text-center block"
                  >
                    متابعة الطلب
                  </Link>
                  
                  <Link
                    to="/restaurants"
                    className="w-full btn-outline text-center block"
                  >
                    إضافة المزيد
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
