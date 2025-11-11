// Restaurant Default Images Helper
// مساعد الصور الافتراضية للمطاعم
// Returns appropriate default images based on restaurant type
// إرجاع صور افتراضية مناسبة بناءً على نوع المطعم

/**
 * Get default image URL based on cuisine type
 * الحصول على رابط صورة افتراضية بناءً على نوع المطبخ
 */
export const getDefaultRestaurantImage = (cuisineType, restaurantName = '') => {
  // Map cuisine types to appropriate Unsplash images
  // ربط أنواع المطابخ بصور Unsplash مناسبة
  
  const imageMap = {
    'عربي': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
    'مغربي': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    'إيطالي': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'ياباني': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    'صيني': 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=800&h=600&fit=crop',
    'وجبات سريعة': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    'مشويات': 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop',
    'حلويات': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
    'مأكولات بحرية': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    'صحراوي': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
  }

  // Try to get image by cuisine type
  // محاولة الحصول على الصورة حسب نوع المطبخ
  if (cuisineType && imageMap[cuisineType]) {
    return imageMap[cuisineType]
  }

  // Fallback: Use restaurant name to determine image
  // احتياطي: استخدام اسم المطعم لتحديد الصورة
  const name = restaurantName.toLowerCase()
  
  if (name.includes('حلويات') || name.includes('حلوى')) {
    return imageMap['حلويات']
  }
  if (name.includes('مشويات') || name.includes('شواء')) {
    return imageMap['مشويات']
  }
  if (name.includes('بحر') || name.includes('سمك') || name.includes('نخيل')) {
    return imageMap['مأكولات بحرية']
  }
  if (name.includes('بيتزا') || name.includes('إيطال')) {
    return imageMap['إيطالي']
  }
  if (name.includes('سوشي') || name.includes('يابان')) {
    return imageMap['ياباني']
  }
  if (name.includes('صين')) {
    return imageMap['صيني']
  }
  if (name.includes('برجر') || name.includes('سريع')) {
    return imageMap['وجبات سريعة']
  }
  if (name.includes('صحراء')) {
    return imageMap['صحراوي']
  }

  // Default: Moroccan/Arabic restaurant image
  // افتراضي: صورة مطعم مغربي/عربي
  return imageMap['مغربي'] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
}

/**
 * Get default menu item image based on item name
 * الحصول على صورة افتراضية لعنصر القائمة بناءً على الاسم
 */
export const getDefaultMenuItemImage = (itemName = '') => {
  const name = itemName.toLowerCase()
  
  const imageMap = {
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'dessert': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop',
  }

  // Default food image
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
}


