-- حل مباشر لمشكلة الصور المتكررة
-- حذف جميع المنتجات الموجودة
DELETE FROM products;

-- إدراج منتجات جديدة مع صور مختلفة
INSERT INTO products (restaurant_id, name, description, price, category, preparation_time, image, is_available, created_at, updated_at) VALUES
(1, 'برجر دجاج طازج', 'برجر دجاج طازج مع الخضار والصلصة الخاصة', 75.00, 'وجبات رئيسية', 15, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'بيتزا مارجريتا', 'بيتزا إيطالية أصيلة بالجبن والطماطم', 200.00, 'بيتزا', 20, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'سلطة خضراء طازجة', 'سلطة طازجة ومتنوعة مع الصلصة', 45.00, 'سلطات', 10, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'كباب مشوي لذيذ', 'كباب مشوي طازج مع الأرز والسلطة', 85.00, 'وجبات رئيسية', 25, 'https://images.unsplash.com/photo-1529042410759-befb11dac5a9?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'سوشي طازج', 'سوشي طازج مع الأرز والأسماك', 120.00, 'مأكولات بحرية', 30, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'معكرونة كاربونارا', 'معكرونة إيطالية بالجبن والبيض', 90.00, 'معكرونة', 18, 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'تاكو مكسيكي', 'تاكو مكسيكي أصيل مع اللحم والخضار', 55.00, 'مكسيكي', 15, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'شاورما دجاج', 'شاورما دجاج مع الخضار والصلصة', 65.00, 'وجبات رئيسية', 12, 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'تشيز كيك', 'تشيز كيك كريمي مع التوت الطازج', 40.00, 'حلويات', 5, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop', 1, NOW(), NOW()),
(1, 'قهوة لاتيه', 'قهوة لاتيه كريمية مع الحليب الطازج', 25.00, 'مشروبات', 3, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', 1, NOW(), NOW());
