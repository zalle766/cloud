import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { createOrder } from '../services/supabaseApi'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from './Cart'
import GoogleMap from '../components/GoogleMap'
import { 
  MapPinIcon,
  CreditCardIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, restaurant, getTotalPrice, clearCart } = useCart()
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '')
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: user?.latitude || 30.0444,
    longitude: user?.longitude || 31.2357
  })
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const createOrderMutation = useMutation(createOrder, {
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message || 'حدث خطأ في إنشاء الطلب')
        return
      }
      toast.success('تم إنشاء الطلب بنجاح!')
      clearCart()
      navigate(`/order-tracking/${result.data.id}`)
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ في إنشاء الطلب')
    }
  })

  const handleLocationSelect = (location) => {
    setDeliveryLocation(location)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!restaurant) {
      toast.error('يرجى اختيار مطعم أولاً')
      return
    }

    if (items.length === 0) {
      toast.error('السلة فارغة')
      return
    }

    const orderData = {
      restaurant_id: restaurant.id,
      address_id: null, // سيتم إضافة العنوان لاحقاً
      items: items.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        special_instructions: ''
      })),
      total_amount: total,
      delivery_fee: deliveryFee,
      payment_method: paymentMethod,
      notes: notes
    }

    createOrderMutation.mutate(orderData)
  }

  const subtotal = getTotalPrice()
  const deliveryFee = restaurant?.delivery_fee || 0
  const tax = subtotal * 0.1
  const total = subtotal + deliveryFee + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
          <p className="text-gray-600 mb-6">أضف بعض المنتجات من المطاعم</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="btn-primary"
          >
            تصفح المطاعم
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Information */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TruckIcon className="h-5 w-5 ml-2" />
                    معلومات التسليم
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="delivery_address" className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان التسليم
                      </label>
                      <textarea
                        id="delivery_address"
                        rows={3}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="input"
                        placeholder="أدخل عنوان التسليم بالتفصيل"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        موقع التسليم على الخريطة
                      </label>
                      <GoogleMap
                        center={deliveryLocation}
                        zoom={15}
                        onLocationSelect={handleLocationSelect}
                        className="h-64 w-full"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        انقر على الخريطة لتحديد موقع التسليم الدقيق
                      </p>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        ملاحظات إضافية (اختياري)
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input"
                        placeholder="أي ملاحظات خاصة للطلب..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCardIcon className="h-5 w-5 ml-2" />
                    طريقة الدفع
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="cash"
                        name="payment_method"
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="cash" className="mr-3 block text-sm font-medium text-gray-700">
                        الدفع عند الاستلام
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="card"
                        name="payment_method"
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        disabled
                      />
                      <label htmlFor="card" className="mr-3 block text-sm font-medium text-gray-500">
                        الدفع بالبطاقة (قريباً)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createOrderMutation.isLoading}
                  className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createOrderMutation.isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                      جاري إنشاء الطلب...
                    </div>
                  ) : (
                    'تأكيد الطلب'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">ملخص الطلب</h3>
                {restaurant && (
                  <p className="text-sm text-gray-600 mt-1">
                    من مطعم: {restaurant.name}
                  </p>
                )}
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 ml-3">
                          {item.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={item.image}
                              alt={item.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">صورة</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-gray-900 font-medium">
                        {item.price * item.quantity} ج.م
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="text-gray-900">{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">رسوم التوصيل:</span>
                    <span className="text-gray-900">
                      {deliveryFee > 0 ? `${deliveryFee} ج.م` : 'مجاني'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الضريبة (10%):</span>
                    <span className="text-gray-900">{tax.toFixed(2)} ج.م</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">المجموع الكلي:</span>
                      <span className="text-gray-900">{total.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
