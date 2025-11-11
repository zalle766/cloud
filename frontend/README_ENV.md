# ⚠️ إصلاح مشكلة Supabase - Fix Supabase Issue

## 🔴 المشكلة:
## Problem:

**"Supabase غير مهيأ. يرجى التحقق من ملف .env"**

---

## ✅ الحل السريع (دقيقة واحدة):
## Quick Solution (1 minute):

### 1. انقر نقراً مزدوجاً على:
### 1. Double-click:

**`FIX_ENV_NOW.bat`** (في مجلد `frontend`)

### 2. أوقف الخادم:
### 2. Stop Server:

اضغط `Ctrl+C` في Terminal

### 3. أعد تشغيله:
### 3. Restart:

```bash
npm run dev
```

### 4. جرب التسجيل:
### 4. Test Registration:

افتح: [http://localhost:3000/customer/register](http://localhost:3000/customer/register)

---

## ✅ تم! يجب أن يعمل الآن!

---

## 📝 المحتوى المطلوب في `.env`:

```
VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc
```

---

**⚠️ مهم: بعد إنشاء الملف، يجب إعادة تشغيل الخادم!**

