// Cart Component - Client-side cart with localStorage persistence
// مكون السلة - سلة العميل مع حفظ في localStorage
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const Cart = ({ onCheckout }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  // تحميل السلة من localStorage عند التحميل
  useEffect(() => {
    loadCart()
  }, [])

  // Listen for cart updates from other components
  // الاستماع لتحديثات السلة من المكونات الأخرى
  useEffect(() => {
    const handleStorageChange = () => {
      loadCart()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  const saveCart = (items) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
      setCartItems(items)
      // Dispatch custom event for other components
      // إرسال حدث مخصص للمكونات الأخرى
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('Error saving cart:', error)
      toast.error('فشل حفظ السلة')
    }
  }

  // Add item to cart
  // إضافة عنصر للسلة
  const addItem = (item, quantity = 1) => {
    const existingItem = cartItems.find((i) => i.id === item.id)

    if (existingItem) {
      // Update quantity if item exists
      // تحديث الكمية إذا كان العنصر موجوداً
      const updatedItems = cartItems.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      )
      saveCart(updatedItems)
    } else {
      // Add new item
      // إضافة عنصر جديد
      saveCart([...cartItems, { ...item, quantity }])
    }
    toast.success('تمت الإضافة للسلة')
  }

  // Remove item from cart
  // إزالة عنصر من السلة
  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((i) => i.id !== itemId)
    saveCart(updatedItems)
    toast.success('تمت الإزالة من السلة')
  }

  // Update item quantity
  // تحديث كمية العنصر
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    const updatedItems = cartItems.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    )
    saveCart(updatedItems)
  }

  // Calculate total price
  // حساب السعر الإجمالي
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // Clear cart
  // مسح السلة
  const clearCart = () => {
    saveCart([])
    toast.success('تم مسح السلة')
  }

  // Expose methods via ref or context (for use in other components)
  // يمكنك استخدام Context API لتمرير هذه الدوال

  return (
    <div className="cart-container bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">السلة</h2>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            مسح الكل
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          السلة فارغة
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.price} ر.س × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 ml-4"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">الإجمالي:</span>
              <span className="text-2xl font-bold text-blue-600">
                {calculateTotal().toFixed(2)} ر.س
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              إتمام الطلب
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Export cart utilities for use in other components
// تصدير دوال السلة للاستخدام في المكونات الأخرى
export const useCart = () => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }

    loadCart()

    const handleStorageChange = () => loadCart()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const addToCart = (item, quantity = 1) => {
    const savedCart = localStorage.getItem('cart')
    const items = savedCart ? JSON.parse(savedCart) : []
    const existingItem = items.find((i) => i.id === item.id)

    if (existingItem) {
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      )
      localStorage.setItem('cart', JSON.stringify(updatedItems))
      setCartItems(updatedItems)
    } else {
      const updatedItems = [...items, { ...item, quantity }]
      localStorage.setItem('cart', JSON.stringify(updatedItems))
      setCartItems(updatedItems)
    }
    window.dispatchEvent(new Event('storage'))
    toast.success('تمت الإضافة للسلة')
  }

  return { cartItems, addToCart }
}

export default Cart

