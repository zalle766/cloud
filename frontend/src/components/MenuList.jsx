// MenuList Component - Display menu items with categories
// مكون قائمة الطعام - عرض عناصر القائمة مع الفئات
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const MenuList = ({ restaurantId, onAddToCart }) => {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch categories and menu items
  // جلب الفئات وعناصر القائمة
  useEffect(() => {
    fetchMenuData()
  }, [restaurantId])

  const fetchMenuData = async () => {
    try {
      setLoading(true)

      // Fetch categories for this restaurant
      // جلب الفئات لهذا المطعم
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('name')

      if (categoriesError) throw categoriesError

      // Fetch menu items with category info
      // جلب عناصر القائمة مع معلومات الفئة
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('name')

      if (itemsError) throw itemsError

      setCategories(categoriesData || [])
      setMenuItems(itemsData || [])
    } catch (error) {
      console.error('Error fetching menu:', error)
      toast.error('فشل تحميل القائمة')
    } finally {
      setLoading(false)
    }
  }

  // Filter menu items by category
  // تصفية عناصر القائمة حسب الفئة
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category_id === selectedCategory)
    : menuItems

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="menu-list">
      {/* Category Filter */}
      {/* فلتر الفئات */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          الكل
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {/* شبكة عناصر القائمة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Item Image */}
            {/* صورة العنصر */}
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {item.price} ر.س
                </span>
                <button
                  onClick={() => onAddToCart(item)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  أضف للسلة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد عناصر متاحة في هذه الفئة
        </div>
      )}
    </div>
  )
}

export default MenuList

