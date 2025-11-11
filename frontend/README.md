# Eat to Eat Frontend

تطبيق توصيل الطعام - الواجهة الأمامية

## الميزات

- **React 18** مع Vite للسرعة والأداء
- **TailwindCSS** للتصميم المتجاوب
- **React Router** للتنقل
- **React Query** لإدارة البيانات
- **Pusher** للاتصال في الوقت الفعلي
- **Google Maps** للتتبع والخرائط
- **Laravel Sanctum** للمصادقة

## التثبيت

```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة البناء
npm run preview
```

## المتغيرات البيئية

أنشئ ملف `.env` في مجلد `frontend`:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Pusher Configuration
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_CLUSTER=your_pusher_cluster
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_SCHEME=http
```

## البنية

```
src/
├── components/          # المكونات المشتركة
├── contexts/           # Context API
├── pages/              # صفحات التطبيق
├── services/           # خدمات API
└── main.jsx           # نقطة الدخول
```

## الأدوار

- **Customer**: العملاء
- **Restaurant**: أصحاب المطاعم
- **Courier**: السائقين
- **Admin**: الإدارة

## التطوير

```bash
# تشغيل في وضع التطوير
npm run dev

# فحص الكود
npm run lint
```

## الإنتاج

```bash
# بناء المشروع
npm run build

# الملفات المبنية ستكون في مجلد dist/
```