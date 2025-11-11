// صفحة اختبار بسيطة - Simple Test Page
import React from 'react'
import { supabase } from '../lib/supabaseClient'

const TestPage = () => {
  const hasUrl = !!import.meta.env.VITE_SUPABASE_URL
  const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY
  const isSupabaseReady = supabase !== null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-600 mb-2 flex items-center justify-center gap-3">
            Eat to Eat 🍽️
          </h1>
          <p className="text-gray-600 text-lg">
            أسرع وأكثر تطبيقات توصيل الطعام موثوقية
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-blue-800 font-medium">
            حالة التطبيق: يعمل بشكل طبيعي
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            حالة Supabase:
          </h2>
          
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              hasUrl ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <span className="font-medium text-gray-700">
                Supabase URL:
              </span>
              <span className={`font-bold ${
                hasUrl ? 'text-green-600' : 'text-red-600'
              }`}>
                {hasUrl ? '✅ موجود' : '❌ غير موجود'}
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${
              hasKey ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <span className="font-medium text-gray-700">
                Supabase Key:
              </span>
              <span className={`font-bold ${
                hasKey ? 'text-green-600' : 'text-red-600'
              }`}>
                {hasKey ? '✅ موجود' : '❌ غير موجود'}
              </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${
              isSupabaseReady ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <span className="font-medium text-gray-700">
                Supabase Client:
              </span>
              <span className={`font-bold ${
                isSupabaseReady ? 'text-green-600' : 'text-red-600'
              }`}>
                {isSupabaseReady ? '✅ مهيأ' : '❌ غير مهيأ'}
              </span>
            </div>
          </div>
        </div>

        {isSupabaseReady ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">
              ✅ كل شيء جاهز! يمكنك الآن استخدام التطبيق
            </p>
            <a
              href="/customer/register"
              className="mt-4 inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              جرب التسجيل الآن
            </a>
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">
              ⚠️ Supabase غير مهيأ
            </p>
            <p className="text-red-600 text-sm">
              يرجى التحقق من ملف .env في مجلد frontend
            </p>
            <p className="text-red-600 text-sm mt-2">
              تأكد من وجود: VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
            </p>
          </div>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          إذا كنت ترى هذه الصفحة، فالتطبيق يعمل بشكل صحيح
        </p>
      </div>
    </div>
  )
}

export default TestPage

