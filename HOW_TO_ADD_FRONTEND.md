# كيفية إضافة مجلد frontend إلى Git

## المشكلة
مجلد `frontend` غير موجود في المستودع على GitHub، لذلك يفشل البناء على Vercel.

## الحل

### الطريقة 1: استخدام السكريبت (موصى به)

#### Windows (Batch):
```bash
add_frontend_to_git.bat
```

#### Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File add_frontend_to_git.ps1
```

### الطريقة 2: يدوياً

قم بتنفيذ هذه الأوامر في Terminal:

```bash
# إضافة ملفات frontend
git add frontend/package.json
git add frontend/vite.config.js
git add frontend/tailwind.config.js
git add frontend/postcss.config.js
git add frontend/index.html
git add frontend/src/
git add frontend/public/
git add frontend/.gitignore

# إضافة ملفات إضافية (إذا كانت موجودة)
git add frontend/Dockerfile
git add frontend/nginx.conf
git add frontend/README.md

# عمل commit
git commit -m "Add frontend directory"

# رفع إلى GitHub
git push
```

### الطريقة 3: إضافة كل شيء (أسرع)

```bash
git add frontend/
git commit -m "Add frontend directory"
git push
```

**ملاحظة:** `.gitignore` سيستبعد تلقائياً:
- `frontend/dist/`
- `frontend/node_modules/`
- `frontend/build/`

## بعد الرفع

بعد رفع الملفات إلى GitHub، أعد المحاولة على Vercel. يجب أن يعمل البناء الآن! ✅

