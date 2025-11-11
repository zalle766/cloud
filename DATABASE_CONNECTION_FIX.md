# إصلاح مشكلة الاتصال بقاعدة البيانات والخادم الخلفي

## المشكلة
كان الموقع يواجه مشكلة في الاتصال بقاعدة البيانات والخادم الخلفي:

1. ✅ **قاعدة البيانات**: ملف `.env` كان يستخدم SQLite بدلاً من MySQL
2. ✅ **الخادم الخلفي**: الواجهة الأمامية كانت تحاول الاتصال بالمنفذ 8000 بينما Node.js يعمل على المنفذ 5000
3. ✅ **Endpoints**: كانت endpoints في الواجهة الأمامية لا تطابق endpoints في Node.js

## الحلول المطبقة

### 1. تحديث إعدادات قاعدة البيانات
تم تحديث ملف `backend/.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eattoeat
DB_USERNAME=root
DB_PASSWORD=
```

### 2. تحديث إعدادات API في الواجهة الأمامية
تم تحديث ملف `frontend/src/services/api.js`:
- تغيير `API_BASE_URL` من `http://localhost:8000/api` إلى `http://localhost:5000/api`
- تحديث endpoints:
  - `/register` → `/auth/register`
  - `/login` → `/auth/login`
  - `/user` → `/user/profile`

### 3. تحديث Vite Config
تم تحديث ملف `frontend/vite.config.js`:
- تغيير proxy target من `http://localhost:8000` إلى `http://localhost:5000`

### 4. تحديث AuthContext
تم تحديث ملف `frontend/src/contexts/AuthContext.jsx`:
- تحديث جميع API calls لتستخدم endpoints الصحيحة

## كيفية التشغيل

### 1. تشغيل قاعدة البيانات MySQL
تأكد من أن MySQL يعمل في XAMPP:
```bash
# افتح XAMPP Control Panel
# اضغط Start على MySQL
```

### 2. تشغيل الخادم الخلفي (Node.js)
```bash
cd backend
npm install
node server.js
# يجب أن ترى: "Connected to MySQL database"
# و: "Server running on port 5000"
```

### 3. تشغيل الواجهة الأمامية
```bash
cd frontend
npm install
npm run dev
# يجب أن يعمل على http://localhost:3000
```

## التحقق من الاتصال

### اختبار قاعدة البيانات
```bash
php test_db_connection.php
```

### اختبار API
افتح المتصفح على:
- http://localhost:5000/api/restaurants (يجب أن يعرض JSON)

### اختبار التسجيل
افتح المتصفح على:
- http://localhost:3000/customer/register
- حاول التسجيل - يجب أن يعمل بدون خطأ timeout

## ملاحظات مهمة

1. **يجب أن يكون MySQL يعمل** قبل تشغيل الخادم الخلفي
2. **يجب أن تكون قاعدة البيانات `eattoeat` موجودة** وتحتوي على الجداول المطلوبة
3. **يجب تشغيل الخادم الخلفي أولاً** قبل الواجهة الأمامية
4. **إذا ظهر خطأ CORS**، تأكد من أن `backend/server.js` يحتوي على `app.use(cors())`

## استكشاف الأخطاء

### خطأ "Connection timed out"
- تأكد من أن الخادم الخلفي يعمل على المنفذ 5000
- تحقق من console المتصفح للأخطاء
- تحقق من console الخادم الخلفي

### خطأ "Database connection failed"
- تأكد من أن MySQL يعمل
- تحقق من إعدادات `.env` في مجلد `backend`
- تأكد من أن قاعدة البيانات `eattoeat` موجودة

### خطأ 404
- تأكد من أن endpoints صحيحة
- تحقق من `backend/server.js` للتأكد من أن الـ routes موجودة

