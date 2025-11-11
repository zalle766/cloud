# قاعدة البيانات المحلية مع SQLite

## المميزات:
- ✅ بيانات دائمة لا تختفي
- ✅ استعلامات SQL قوية
- ✅ لا يحتاج خادم منفصل
- ✅ سهل التطوير والاختبار

## التطبيق:
1. استخدام Electron مع SQLite
2. أو استخدام Tauri مع SQLite
3. أو استخدام Node.js مع SQLite

## مثال على التطبيق:
```javascript
// قاعدة بيانات المستخدمين
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  street VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  full_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);

// قاعدة بيانات المطاعم
CREATE TABLE restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  cuisine_type VARCHAR(100),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  owner_name VARCHAR(100),
  license_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

// قاعدة بيانات الطلبات
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  restaurant_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```
