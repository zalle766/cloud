# دليل تشغيل تطبيق Eat to Eat مع قاعدة البيانات الجديدة

## 📋 الخطوات المطلوبة:

### 1. إنشاء قاعدة البيانات في phpMyAdmin

1. **افتح phpMyAdmin** في المتصفح: `http://localhost/phpmyadmin`
2. **شغل الملف** `create_database.sql` لإنشاء قاعدة البيانات
3. **شغل الملف** `simple_database.sql` لإنشاء الجداول والبيانات

### 2. تحديث إعدادات قاعدة البيانات

تم تحديث `backend/config/database.php` لاستخدام MySQL بدلاً من SQLite.

### 3. إنشاء ملف .env للخادم الخلفي

أنشئ ملف `.env` في مجلد `backend` مع المحتوى التالي:

```env
APP_NAME="Eat to Eat"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eattoeat
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 4. تشغيل الخوادم

#### الخادم الخلفي (Laravel):
```bash
cd backend
php artisan serve
```

#### الخادم الأمامي (React):
```bash
cd frontend
npm run dev
```

## 🎯 الحسابات التجريبية:

### مدير النظام:
- **البريد:** `admin@eattoeat.com`
- **كلمة المرور:** `password`

### صاحب مطعم:
- **البريد:** `restaurant@eattoeat.com`
- **كلمة المرور:** `password`

### عميل:
- **البريد:** `customer@eattoeat.com`
- **كلمة المرور:** `password`

### سائق:
- **البريد:** `courier@eattoeat.com`
- **كلمة المرور:** `password`

## 🍽️ المطاعم المتاحة:

1. **مطعم الأصالة** - أطباق عربية
2. **مطعم الشرق الأوسط** - مأكولات عربية
3. **بيتزا إيطاليا** - بيتزا إيطالية
4. **برجر هاوس** - برجرز ووجبات سريعة
5. **مطعم الصين الذهبية** - مأكولات آسيوية
6. **كافيه الحلويات** - حلويات ومشروبات
7. **مطعم البحار** - مأكولات بحرية
8. **مطعم السوشي الياباني** - سوشي ومأكولات يابانية

## 🔗 الروابط:

- **الموقع الأمامي:** `http://localhost:3000`
- **الخادم الخلفي:** `http://localhost:8000`
- **phpMyAdmin:** `http://localhost/phpmyadmin`

## ✅ التحقق من عمل النظام:

1. **افتح الموقع الأمامي** في المتصفح
2. **تأكد من ظهور المطاعم** في صفحة المطاعم
3. **جرب تسجيل الدخول** بأحد الحسابات التجريبية
4. **جرب إنشاء حساب جديد** لأصحاب المطاعم
5. **تأكد من عمل جميع الوظائف** بشكل صحيح

## 🚨 في حالة وجود مشاكل:

1. **تأكد من تشغيل XAMPP** (Apache + MySQL)
2. **تأكد من إنشاء قاعدة البيانات** في phpMyAdmin
3. **تأكد من وجود ملف .env** في مجلد backend
4. **تأكد من تشغيل الخوادم** على المنافذ الصحيحة
5. **تحقق من رسائل الخطأ** في console المتصفح

## 🎉 النتيجة المتوقعة:

بعد تنفيذ جميع الخطوات، ستحصل على:
- ✅ موقع يعمل بشكل كامل
- ✅ مطاعم تظهر في الصفحة الرئيسية
- ✅ نظام تسجيل دخول وتسجيل يعمل
- ✅ لوحات تحكم للمطاعم والسائقين
- ✅ نظام طلبات وتقييمات
- ✅ قاعدة بيانات مكتملة مع بيانات تجريبية
