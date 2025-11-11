# تثبيت Supabase - Install Supabase

## ⚠️ خطأ: الحزمة غير مثبتة
## Error: Package Not Installed

الخطأ الذي تراه يعني أن حزمة `@supabase/supabase-js` غير مثبتة.

## ✅ الحل السريع:
## Quick Solution:

### افتح Terminal في مجلد `frontend` واكتب:

```bash
npm install @supabase/supabase-js
```

### أو إذا كنت في المجلد الرئيسي:

```bash
cd frontend
npm install @supabase/supabase-js
```

---

## 📝 خطوات مفصلة:
## Detailed Steps:

### 1. افتح Terminal/Command Prompt

### 2. اذهب إلى مجلد frontend:

```bash
cd C:\xampp\htdocs\eattoeat\frontend
```

### 3. ثبت الحزمة:

```bash
npm install @supabase/supabase-js
```

### 4. انتظر حتى يكتمل التثبيت

### 5. أعد تشغيل خادم التطوير:

```bash
npm run dev
```

---

## ✅ بعد التثبيت:

- ✅ الخطأ سيختفي
- ✅ Error will disappear
- ✅ المشروع سيعمل بشكل طبيعي
- ✅ Project will work normally

---

## 🔍 التحقق:

بعد التثبيت، تأكد من أن الحزمة موجودة في `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

---

**ملاحظة:** إذا استمر الخطأ بعد التثبيت، أعد تشغيل خادم التطوير (`npm run dev`)

