// Checkout Component - Create order in Supabase
// مكون الدفع - إنشاء طلب في Supabase
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getCurrentUser } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const Checkout = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')

  // Check authentication and load data
  // التحقق من المصادقة وتحميل البيانات
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        // Redirect to login if not authenticated
        // إعادة التوجيه لتسجيل الدخول إذا لم يكن المستخدم مسجلاً
        toast.error('يجب تسجيل الدخول أولاً')
        navigate('/auth/login')
        return
      }

      setUser(currentUser)
      loadCart()
      loadAddresses(currentUser.id)
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('فشل التحقق من الهوية')
      navigate('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  // Load cart from localStorage
  // تحميل السلة من localStorage
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const items = JSON.parse(savedCart)
        setCartItems(items)
        if (items.length === 0) {
          toast.error('السلة فارغة')
          navigate('/cart')
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  // Load user addresses
  // تحميل عناوين المستخدم
  const loadAddresses = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })

      if (error) throw error

      setAddresses(data || [])
      // Select default address if available
      // اختيار العنوان الافتراضي إذا كان متاحاً
      const defaultAddress = data?.find((addr) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id)
      } else if (data && data.length > 0) {
        setSelectedAddress(data[0].id)
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      toast.error('فشل تحميل العناوين')
    }
  }

  // Calculate total
  // حساب الإجمالي
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // Submit order
  // إرسال الطلب
  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (!selectedAddress) {
      toast.error('يرجى اختيار عنوان التوصيل')
      return
    }

    if (cartItems.length === 0) {
      toast.error('السلة فارغة')
      return
    }

    setSubmitting(true)

    try {
      const total = calculateTotal()

      // Create order in Supabase
      // إنشاء الطلب في Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          restaurant_id: cartItems[0].restaurant_id, // Assuming all items from same restaurant
          address_id: selectedAddress,
          total_amount: total,
          status: 'pending',
          payment_method: paymentMethod,
          notes: notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      // إنشاء عناصر الطلب
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      // مسح السلة
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('storage'))

      toast.success('تم إنشاء الطلب بنجاح!')
      navigate(`/orders/${order.id}`)
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">إتمام الطلب</h1>

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        {/* Address Selection */}
        {/* اختيار العنوان */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">عنوان التوصيل</h2>
          {addresses.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">لا توجد عناوين محفوظة</p>
              <button
                type="button"
                onClick={() => navigate('/profile/addresses')}
                className="text-blue-600 hover:text-blue-700"
              >
                إضافة عنوان جديد
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer ${
                    selectedAddress === address.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id}
                    onChange={(e) => setSelectedAddress(Number(e.target.value))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-semibold">{address.label}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.region}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        {/* طريقة الدفع */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">طريقة الدفع</h2>
          <div className="space-y-2">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <span>الدفع عند الاستلام</span>
            </label>
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <span>بطاقة ائتمانية</span>
            </label>
          </div>
        </div>

        {/* Order Notes */}
        {/* ملاحظات الطلب */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <label className="block text-xl font-semibold mb-4">
            ملاحظات (اختياري)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows="3"
            placeholder="أي تعليمات خاصة للطلب..."
          />
        </div>

        {/* Order Summary */}
        {/* ملخص الطلب */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{(item.price * item.quantity).toFixed(2)} ر.س</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>الإجمالي:</span>
            <span className="text-blue-600">{calculateTotal().toFixed(2)} ر.س</span>
          </div>
        </div>

        {/* Submit Button */}
        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={submitting || !selectedAddress}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'جاري المعالجة...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  )
}

export default Checkout

