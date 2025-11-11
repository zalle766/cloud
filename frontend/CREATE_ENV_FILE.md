# كيفية إنشاء ملف .env
# How to Create .env File

## ⚠️ يجب إنشاء الملف يدوياً
## Must Create File Manually

### الطريقة السهلة (Windows):
### Easy Way (Windows):

1. **افتح File Explorer**
2. اذهب إلى مجلد `frontend`
3. **انقر بزر الماوس الأيمن** في أي مكان فارغ
4. اختر **"New"** → **"Text Document"**
5. **أعد تسميته** إلى `.env` (احذف `.txt`)
6. إذا ظهرت رسالة تحذير، اضغط **"Yes"**

### ثم:
7. **افتح ملف `.env`** (انقر نقراً مزدوجاً)
8. **انسخ والصق** المحتوى التالي:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc

# Google Maps API (optional)
VITE_GOOGLE_MAPS_API_KEY=

# App Configuration
VITE_APP_NAME=Eat to Eat
VITE_APP_URL=http://localhost:3000
```

9. **احفظ الملف** (Ctrl+S)

---

## ✅ تم!
## Done!

الآن ملف `.env` جاهز! ✅

---

## طريقة بديلة (من Terminal):
## Alternative Way (from Terminal):

افتح Terminal في مجلد `frontend` واكتب:

```bash
copy env_content.txt .env
```

أو:

```bash
type env_content.txt > .env
```

---

## التحقق:
## Verify:

بعد إنشاء الملف، تأكد من:
- الملف موجود في `frontend/.env`
- يحتوي على المفاتيح الصحيحة
- لا يحتوي على `.txt` في الاسم

