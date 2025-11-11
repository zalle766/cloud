// أمثلة بسيطة جداً لاستخدام Supabase
// Very Simple Supabase Usage Examples

import { useState, useEffect } from 'react'
import {
  login,
  signup,
  logout,
  getCurrentUser,
  getAll,
  getById,
  add,
  update,
  remove,
  uploadFile,
  isLoggedIn,
} from '../utils/supabaseHelpers'

/**
 * مثال 1: صفحة تسجيل الدخول بسيطة جداً
 * Example 1: Very Simple Login Page
 */
export const SimpleLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // استخدم الدالة الجاهزة!
    // Use the ready function!
    const { user, error } = await login(email, password)

    if (user) {
      console.log('تم تسجيل الدخول!', user)
      // انتقل إلى الصفحة الرئيسية
      // Navigate to home page
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} className="p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        className="border p-2 mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="كلمة المرور"
        className="border p-2 mb-2"
      />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
        {loading ? 'جاري...' : 'تسجيل الدخول'}
      </button>
    </form>
  )
}

/**
 * مثال 2: عرض قائمة المطاعم
 * Example 2: Display Restaurants List
 */
export const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    // استخدم الدالة الجاهزة!
    // Use the ready function!
    const { data, error } = await getAll('restaurants', {
      eq: { is_active: true },
      orderBy: 'name',
      ascending: true,
    })

    if (!error) {
      setRestaurants(data)
    }
    setLoading(false)
  }

  if (loading) return <div>جاري التحميل...</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">المطاعم</h2>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="border p-4 mb-2">
          <h3 className="text-xl font-semibold">{restaurant.name}</h3>
          <p>{restaurant.description}</p>
        </div>
      ))}
    </div>
  )
}

/**
 * مثال 3: إضافة مطعم جديد
 * Example 3: Add New Restaurant
 */
export const AddRestaurant = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // استخدم الدالة الجاهزة!
    // Use the ready function!
    const { data, error } = await add('restaurants', {
      name: name,
      description: description,
      is_active: true,
    })

    if (!error) {
      console.log('تمت الإضافة!', data)
      setName('')
      setDescription('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم المطعم"
        className="border p-2 mb-2"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="الوصف"
        className="border p-2 mb-2"
      />
      <button type="submit" disabled={loading} className="bg-green-500 text-white p-2">
        {loading ? 'جاري...' : 'إضافة'}
      </button>
    </form>
  )
}

/**
 * مثال 4: تحديث مطعم
 * Example 4: Update Restaurant
 */
export const UpdateRestaurant = ({ restaurantId }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRestaurant()
  }, [restaurantId])

  const loadRestaurant = async () => {
    const { data } = await getById('restaurants', restaurantId)
    if (data) {
      setName(data.name)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    // استخدم الدالة الجاهزة!
    // Use the ready function!
    const { data, error } = await update('restaurants', restaurantId, {
      name: name,
    })

    if (!error) {
      console.log('تم التحديث!', data)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleUpdate} className="p-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2"
        required
      />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
        {loading ? 'جاري...' : 'تحديث'}
      </button>
    </form>
  )
}

/**
 * مثال 5: حذف مطعم
 * Example 5: Delete Restaurant
 */
export const DeleteRestaurant = ({ restaurantId, onDeleted }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return

    setLoading(true)

    // استخدم الدالة الجاهزة!
    // Use the ready function!
    const { success } = await remove('restaurants', restaurantId)

    if (success && onDeleted) {
      onDeleted()
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500 text-white p-2"
    >
      {loading ? 'جاري...' : 'حذف'}
    </button>
  )
}

/**
 * مثال 6: رفع صورة
 * Example 6: Upload Image
 */
export const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)

    // استخدم الدالة الجاهزة!
    // Use the ready function!
    const { url, error } = await uploadFile(file, 'images', 'restaurants')

    if (!error && url) {
      setImageUrl(url)
      console.log('رابط الصورة:', url)
    }

    setLoading(false)
  }

  return (
    <div className="p-4">
      <input type="file" onChange={handleUpload} disabled={loading} />
      {loading && <p>جاري الرفع...</p>}
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Uploaded" className="max-w-xs" />
          <p className="text-sm text-gray-600 mt-2">{imageUrl}</p>
        </div>
      )}
    </div>
  )
}

/**
 * مثال 7: التحقق من تسجيل الدخول
 * Example 7: Check Login Status
 */
export const CheckAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  if (loading) return <div>جاري التحقق...</div>

  if (!user) {
    return <div>لم يتم تسجيل الدخول</div>
  }

  return (
    <div className="p-4">
      <p>مرحباً، {user.email}!</p>
      <button onClick={logout} className="bg-red-500 text-white p-2 mt-2">
        تسجيل الخروج
      </button>
    </div>
  )
}

/**
 * مثال 8: استخدام كامل (CRUD)
 * Example 8: Complete Usage (CRUD)
 */
export const CompleteExample = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // جلب البيانات
  // Get data
  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    const { data } = await getAll('restaurants')
    setRestaurants(data || [])
  }

  // إضافة
  // Add
  const handleAdd = async (name, description) => {
    const { data } = await add('restaurants', {
      name,
      description,
      is_active: true,
    })
    if (data) {
      loadRestaurants() // إعادة تحميل القائمة
    }
  }

  // تحديث
  // Update
  const handleUpdate = async (id, name) => {
    const { data } = await update('restaurants', id, { name })
    if (data) {
      loadRestaurants() // إعادة تحميل القائمة
    }
  }

  // حذف
  // Delete
  const handleDelete = async (id) => {
    const { success } = await remove('restaurants', id)
    if (success) {
      loadRestaurants() // إعادة تحميل القائمة
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">إدارة المطاعم</h2>
      
      {/* عرض القائمة */}
      {/* Display list */}
      <div className="space-y-2">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="border p-4 flex justify-between">
            <div>
              <h3 className="font-semibold">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setSelectedId(restaurant.id)}
                className="bg-blue-500 text-white px-3 py-1"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(restaurant.id)}
                className="bg-red-500 text-white px-3 py-1"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

