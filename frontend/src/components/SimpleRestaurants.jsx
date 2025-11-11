// مكون بسيط لعرض وإدارة المطاعم - جاهز للاستخدام مباشرة
// Simple component to display and manage restaurants - Ready to use directly
import { useState, useEffect } from 'react'
import { getAll, add, update, remove } from '../utils/supabaseHelpers'

const SimpleRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // نموذج الإضافة/التعديل
  // Add/Edit form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  // جلب المطاعم عند التحميل
  // Load restaurants on mount
  useEffect(() => {
    loadRestaurants()
  }, [])

  // جلب جميع المطاعم
  // Get all restaurants
  const loadRestaurants = async () => {
    setLoading(true)
    const { data, error } = await getAll('restaurants', {
      eq: { is_active: true },
      orderBy: 'name',
      ascending: true,
    })

    if (!error && data) {
      setRestaurants(data)
    }
    setLoading(false)
  }

  // إضافة مطعم جديد
  // Add new restaurant
  const handleAdd = async (e) => {
    e.preventDefault()

    const { data, error } = await add('restaurants', {
      name: formData.name,
      description: formData.description,
      is_active: true,
    })

    if (!error && data) {
      setFormData({ name: '', description: '' })
      setShowAddForm(false)
      loadRestaurants() // إعادة تحميل القائمة
    }
  }

  // تحديث مطعم
  // Update restaurant
  const handleUpdate = async (e) => {
    e.preventDefault()

    const { data, error } = await update('restaurants', editingId, {
      name: formData.name,
      description: formData.description,
    })

    if (!error && data) {
      setFormData({ name: '', description: '' })
      setEditingId(null)
      loadRestaurants() // إعادة تحميل القائمة
    }
  }

  // حذف مطعم
  // Delete restaurant
  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المطعم؟')) return

    const { success } = await remove('restaurants', id)

    if (success) {
      loadRestaurants() // إعادة تحميل القائمة
    }
  }

  // بدء التعديل
  // Start editing
  const startEdit = (restaurant) => {
    setEditingId(restaurant.id)
    setFormData({
      name: restaurant.name,
      description: restaurant.description || '',
    })
    setShowAddForm(true)
  }

  // إلغاء التعديل
  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', description: '' })
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">المطاعم</h1>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ name: '', description: '' })
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + إضافة مطعم
        </button>
      </div>

      {/* نموذج الإضافة/التعديل */}
      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'تعديل مطعم' : 'إضافة مطعم جديد'}
          </h2>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المطعم</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="أدخل اسم المطعم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="أدخل وصف المطعم"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {editingId ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* قائمة المطاعم */}
      {/* Restaurants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {restaurant.image_url && (
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {restaurant.description || 'لا يوجد وصف'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(restaurant)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">لا توجد مطاعم</p>
          <p className="text-sm">ابدأ بإضافة مطعم جديد</p>
        </div>
      )}
    </div>
  )
}

export default SimpleRestaurants

