# Firebase كحل سحابي

## المميزات:
- ✅ قاعدة بيانات سحابية
- ✅ مصادقة جاهزة
- ✅ تخزين الملفات
- ✅ إشعارات فورية
- ✅ مجاني للاستخدام المحدود

## التطبيق:
```javascript
// إعداد Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "eattoeat.firebaseapp.com",
  projectId: "eattoeat",
  storageBucket: "eattoeat.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// حفظ بيانات المستخدم
import { collection, addDoc } from 'firebase/firestore';

const saveUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      city: userData.city,
      neighborhood: userData.neighborhood,
      createdAt: new Date()
    });
    console.log('User saved with ID: ', docRef.id);
  } catch (error) {
    console.error('Error saving user: ', error);
  }
};
```
