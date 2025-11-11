# دليل انتقال البيانات من MySQL إلى Postgres (Supabase)
# MySQL to Postgres Migration Guide

## نظرة عامة / Overview

هذا الدليل يشرح كيفية نقل البيانات من Laravel MySQL إلى Supabase Postgres.
This guide explains how to migrate data from Laravel MySQL to Supabase Postgres.

---

## الخطوة 1: تصدير البيانات من MySQL
## Step 1: Export Data from MySQL

### أ) تصدير الجداول كـ CSV
### a) Export Tables as CSV

```bash
# Export users table
# تصدير جدول المستخدمين
mysql -u root -p eattoeat -e "SELECT * FROM users" | sed 's/\t/,/g' > users.csv

# Export restaurants table
# تصدير جدول المطاعم
mysql -u root -p eattoeat -e "SELECT * FROM restaurants" | sed 's/\t/,/g' > restaurants.csv

# Export menu_items table
# تصدير جدول عناصر القائمة
mysql -u root -p eattoeat -e "SELECT * FROM menu_items" | sed 's/\t/,/g' > menu_items.csv

# Export orders table
# تصدير جدول الطلبات
mysql -u root -p eattoeat -e "SELECT * FROM orders" | sed 's/\t/,/g' > orders.csv

# Export order_items table
# تصدير جدول عناصر الطلب
mysql -u root -p eattoeat -e "SELECT * FROM order_items" | sed 's/\t/,/g' > order_items.csv
```

### ب) استخدام mysqldump (للمخطط فقط)
### b) Using mysqldump (for schema only)

```bash
# Export schema only (no data)
# تصدير المخطط فقط (بدون بيانات)
mysqldump -u root -p --no-data eattoeat > schema.sql

# Export data only (no schema)
# تصدير البيانات فقط (بدون مخطط)
mysqldump -u root -p --no-create-info eattoeat > data.sql
```

---

## الخطوة 2: تحويل أنواع البيانات
## Step 2: Data Type Conversions

### تحويلات MySQL إلى Postgres الشائعة
### Common MySQL to Postgres Conversions

| MySQL | Postgres | Notes |
|-------|----------|-------|
| `INT(10)` | `INTEGER` or `BIGINT` | Remove length specifier |
| `VARCHAR(255)` | `TEXT` or `VARCHAR(255)` | Same |
| `TEXT` | `TEXT` | Same |
| `DATETIME` | `TIMESTAMPTZ` | Use timezone-aware |
| `TIMESTAMP` | `TIMESTAMPTZ` | Use timezone-aware |
| `ENUM('a','b')` | `TEXT` with CHECK constraint | See below |
| `AUTO_INCREMENT` | `SERIAL` or `GENERATED ALWAYS AS IDENTITY` | See below |
| `TINYINT(1)` | `BOOLEAN` | For true/false |
| `DECIMAL(10,2)` | `DECIMAL(10,2)` | Same |

### مثال: تحويل ENUM
### Example: Converting ENUM

**MySQL:**
```sql
status ENUM('pending', 'confirmed', 'delivered')
```

**Postgres:**
```sql
status TEXT CHECK (status IN ('pending', 'confirmed', 'delivered'))
```

### مثال: تحويل AUTO_INCREMENT
### Example: Converting AUTO_INCREMENT

**MySQL:**
```sql
id INT(10) AUTO_INCREMENT PRIMARY KEY
```

**Postgres:**
```sql
id SERIAL PRIMARY KEY
-- OR for UUID:
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
```

---

## الخطوة 3: استيراد البيانات إلى Supabase
## Step 3: Import Data to Supabase

### أ) استخدام Supabase SQL Editor
### a) Using Supabase SQL Editor

1. افتح Supabase Dashboard > SQL Editor
2. Open Supabase Dashboard > SQL Editor
3. قم بتشغيل ملف `supabase_schema.sql` لإنشاء الجداول
4. Run `supabase_schema.sql` to create tables

### ب) استيراد CSV عبر Supabase Storage
### b) Import CSV via Supabase Storage

1. ارفع ملفات CSV إلى Supabase Storage (bucket: `migrations`)
2. Upload CSV files to Supabase Storage (bucket: `migrations`)
3. استخدم SQL Editor لاستيراد البيانات:

```sql
-- Example: Import users from CSV
-- مثال: استيراد المستخدمين من CSV
COPY profiles(id, email, name, phone, role, created_at, updated_at)
FROM 'https://your-project.supabase.co/storage/v1/object/public/migrations/users.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

### ج) استخدام psql (إذا كان لديك وصول مباشر)
### c) Using psql (if you have direct access)

```bash
# Connect to Supabase Postgres
# الاتصال بـ Supabase Postgres
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Import CSV
# استيراد CSV
\copy profiles FROM 'users.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

---

## الخطوة 4: معالجة كلمات المرور
## Step 4: Handling Passwords

### المشكلة
### The Problem

Laravel يستخدم bcrypt لتشفير كلمات المرور، بينما Supabase يستخدم scrypt.

### الحلول الموصى بها
### Recommended Solutions

#### الحل 1: إعادة تعيين كلمات المرور (موصى به)
#### Solution 1: Password Reset (Recommended)

1. أرسل بريد إلكتروني لجميع المستخدمين يطلب منهم إعادة تعيين كلمة المرور
2. Send email to all users asking them to reset password
3. استخدم رابط Supabase Auth للـ password reset
4. Use Supabase Auth password reset link

**انظر ملف:** `templates/password_reset_email_ar.txt`

#### الحل 2: نقل كلمات المرور (معقد)
#### Solution 2: Migrate Passwords (Complex)

إذا كنت تريد نقل كلمات المرور مباشرة:

1. تصدير كلمات المرور المشفرة من MySQL
2. Export encrypted passwords from MySQL
3. إنشاء دالة في Supabase لتحويل bcrypt إلى scrypt (يتطلب كود مخصص)
4. Create Supabase function to convert bcrypt to scrypt (requires custom code)

**ملاحظة:** هذا الحل معقد وقد لا يعمل بشكل مثالي.
**Note:** This solution is complex and may not work perfectly.

---

## الخطوة 5: تحويل معرفات الجداول
## Step 5: Converting Table IDs

### من INT إلى UUID
### From INT to UUID

إذا كان MySQL يستخدم `INT` و Supabase يستخدم `UUID`:

1. أنشئ عمود `old_id` في Supabase لحفظ المعرف القديم
2. Create `old_id` column in Supabase to store old ID
3. استخدم هذا العمود لربط البيانات أثناء الانتقال
4. Use this column to link data during migration

```sql
-- Add old_id column
-- إضافة عمود old_id
ALTER TABLE restaurants ADD COLUMN old_id INTEGER;

-- Import with old_id mapping
-- استيراد مع ربط old_id
-- Then update foreign keys after migration
-- ثم تحديث المفاتيح الخارجية بعد الانتقال
```

---

## الخطوة 6: التحقق من البيانات
## Step 6: Data Verification

### فحص عدد السجلات
### Check Record Counts

```sql
-- In MySQL
-- في MySQL
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM restaurants;
SELECT COUNT(*) FROM orders;

-- In Supabase (Postgres)
-- في Supabase (Postgres)
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM restaurants;
SELECT COUNT(*) FROM orders;
```

### فحص العلاقات
### Check Relationships

```sql
-- Verify foreign keys
-- التحقق من المفاتيح الخارجية
SELECT 
  COUNT(*) as total_orders,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT restaurant_id) as unique_restaurants
FROM orders;
```

---

## نصائح مهمة
## Important Tips

1. **احفظ نسخة احتياطية:** قم بعمل backup كامل من MySQL قبل البدء
2. **Backup First:** Make full backup from MySQL before starting

3. **اختبر على بيانات تجريبية:** جرب العملية على نسخة تجريبية أولاً
4. **Test on Sample Data:** Try the process on sample data first

5. **انتقل تدريجياً:** ابدأ بالجداول البسيطة ثم انتقل للجداول المعقدة
6. **Migrate Gradually:** Start with simple tables, then complex ones

7. **تحقق من البيانات:** بعد كل خطوة، تحقق من صحة البيانات
8. **Verify Data:** After each step, verify data integrity

9. **استخدم المعاملات:** استخدم transactions لضمان الاتساق
10. **Use Transactions:** Use transactions to ensure consistency

---

## مثال سكريبت كامل
## Complete Script Example

```bash
#!/bin/bash
# migrate.sh

# 1. Export from MySQL
mysql -u root -p eattoeat -e "SELECT * FROM users" | sed 's/\t/,/g' > users.csv

# 2. Clean CSV (remove NULL, fix dates, etc.)
# You may need to process the CSV file

# 3. Upload to Supabase Storage (via API or UI)

# 4. Import via SQL
# Run in Supabase SQL Editor:
# COPY profiles(...) FROM '...' WITH (FORMAT csv, HEADER true);
```

---

## موارد إضافية
## Additional Resources

- [Supabase Migration Guide](https://supabase.com/docs/guides/database/migrations)
- [Postgres Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [MySQL to Postgres Migration](https://wiki.postgresql.org/wiki/Converting_from_other_Databases_to_PostgreSQL)

