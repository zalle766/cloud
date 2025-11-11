# حل مشكلة "لا يمكن الاتصال بالخادم"

## المشكلة
عند محاولة التسجيل، تظهر رسالة الخطأ "لا يمكن الاتصال بالخادم" (Cannot connect to the server).

## السبب
الخادم الخلفي (Backend Server) غير شغال على المنفذ 5000.

## الحل

### الخطوة 1: تأكد من تشغيل MySQL
1. افتح **XAMPP Control Panel**
2. اضغط **Start** على MySQL
3. تأكد من أن MySQL يعمل بنجاح (خلفية خضراء)

### الخطوة 2: تشغيل الخادم الخلفي

#### الطريقة 1: استخدام ملف التشغيل
```
1. انقر نقراً مزدوجاً على: START_BACKEND_SERVER.bat
2. انتظر حتى ترى:
   ✅ Connected to MySQL database
   ✅ Server running on port 5000
   ✅ API available at http://localhost:5000/api
```

#### الطريقة 2: تشغيل يدوي
```bash
cd backend
node server.js
```

يجب أن ترى الرسائل التالية:
```
✅ Connected to MySQL database
✅ Server running on port 5000
✅ API available at http://localhost:5000/api
```

### الخطوة 3: التحقق من الاتصال
```
1. انقر نقراً مزدوجاً على: check_backend_connection.bat
2. إذا كان كل شيء يعمل، ستظهر رسالة:
   ✅ الخادم الخلفي يعمل على المنفذ 5000
```

أو افتح المتصفح على:
```
http://localhost:5000/api/restaurants
```

يجب أن ترى JSON response أو قائمة فارغة `[]`.

### الخطوة 4: تشغيل الواجهة الأمامية
في terminal منفصل:
```bash
cd frontend
npm run dev
```

ثم افتح المتصفح على:
```
http://localhost:3000/customer/register
```

## استكشاف الأخطاء

### خطأ: "Database connection failed"
**السبب**: MySQL غير شغال أو قاعدة البيانات غير موجودة

**الحل**:
1. تأكد من تشغيل MySQL في XAMPP
2. تأكد من وجود قاعدة البيانات `eattoeat`:
   ```sql
   CREATE DATABASE IF NOT EXISTS eattoeat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### خطأ: "Port 5000 already in use"
**السبب**: المنفذ 5000 مستخدم بالفعل

**الحل**:
1. أغلق التطبيق الذي يستخدم المنفذ 5000
2. أو غيّر المنفذ في `backend/server.js`:
   ```javascript
   const PORT = process.env.PORT || 5001; // غيّر 5000 إلى 5001
   ```
3. ثم غيّر `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
   ```

### خطأ: "Cannot find module"
**السبب**: التبعيات غير مثبتة

**الحل**:
```bash
cd backend
npm install
```

### خطأ: CORS Error
**السبب**: CORS غير مفعل بشكل صحيح

**الحل**: تأكد من أن `backend/server.js` يحتوي على:
```javascript
app.use(cors());
```

## ملاحظات مهمة

1. **يجب تشغيل الخادم الخلفي أولاً** قبل الواجهة الأمامية
2. **لا تغلق terminal الخادم الخلفي** طالما تريد استخدام الموقع
3. **تأكد من أن MySQL يعمل** قبل تشغيل الخادم الخلفي
4. **إذا غيرت أي إعدادات**، أعد تشغيل الخادم الخلفي

## التحقق السريع

إذا كنت تريد التحقق بسرعة من أن كل شيء يعمل:

```bash
# في terminal واحد
cd backend && node server.js

# في terminal آخر
cd frontend && npm run dev
```

ثم افتح:
- Backend: http://localhost:5000/api/restaurants
- Frontend: http://localhost:3000

## المساعدة الإضافية

إذا استمرت المشكلة:
1. تحقق من console المتصفح (F12) للأخطاء
2. تحقق من console الخادم الخلفي للأخطاء
3. تأكد من أن firewall لا يمنع الاتصال

