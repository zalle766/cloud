# إصلاح تنسيق بيانات التسجيل

## المشكلة
كانت الواجهة الأمامية ترسل بيانات بتنسيق مختلف عن المتوقع في الخادم الخلفي:

**الواجهة الأمامية كانت ترسل:**
- `name` (اسم واحد)
- `phone`
- `address`
- `latitude`, `longitude`

**الخادم الخلفي يتوقع:**
- `firstName`, `lastName` (اسمين منفصلين)
- `phoneNumber`
- `city`, `neighborhood`, `street`, `fullAddress`
- `latitude`, `longitude`

## الحل المطبق

تم تحديث ملف `frontend/src/pages/auth/CustomerRegister.jsx` في دالة `handleSubmit` لتحويل البيانات قبل الإرسال:

```javascript
// تحويل البيانات إلى التنسيق المتوقع من الخادم الخلفي
const nameParts = formData.name.trim().split(' ')
const firstName = nameParts[0] || ''
const lastName = nameParts.slice(1).join(' ') || ''

const registrationData = {
  firstName: firstName,
  lastName: lastName,
  email: formData.email,
  phoneNumber: formData.phone || '',
  password: formData.password,
  city: '', // يمكن إضافة حقل منفصل لاحقاً
  neighborhood: '', // يمكن إضافة حقل منفصل لاحقاً
  street: formData.address || '',
  latitude: formData.latitude || null,
  longitude: formData.longitude || null,
  fullAddress: formData.address || ''
}
```

## التحقق من الإصلاح

### قبل الإصلاح:
```
الخطأ: "لا يمكن الاتصال بالخادم"
السبب: تنسيق البيانات غير متطابق
```

### بعد الإصلاح:
- ✅ البيانات تُرسل بالتنسيق الصحيح
- ✅ الخادم الخلفي يستقبل البيانات بشكل صحيح
- ✅ التسجيل يعمل بدون أخطاء

## ملاحظات

1. **تقسيم الاسم**: يتم تقسيم الاسم الكامل إلى `firstName` (الكلمة الأولى) و `lastName` (باقي الكلمات)
2. **العنوان**: يتم استخدام `address` كـ `street` و `fullAddress` لأن الخادم يتوقع حقول منفصلة
3. **الموقع**: `latitude` و `longitude` يُرسلان كـ `null` إذا لم يتم تحديد الموقع
4. **المدينة والحي**: حالياً تُرسلان فارغتين، يمكن إضافة حقول منفصلة لاحقاً

## التطوير المستقبلي

يمكن تحسين النموذج بإضافة:
- حقل منفصل لـ `firstName` و `lastName`
- حقل منفصل لـ `city`
- حقل منفصل لـ `neighborhood`
- تحسين تقسيم العنوان تلقائياً

