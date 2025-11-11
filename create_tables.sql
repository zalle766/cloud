-- إنشاء جدول المستخدمين البسيط
USE eat_to_eat;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255),
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  street VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  full_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول المطاعم البسيط
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  phone VARCHAR(20),
  email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول صور المطاعم
CREATE TABLE IF NOT EXISTS restaurant_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT,
  image_path VARCHAR(255),
  image_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);




