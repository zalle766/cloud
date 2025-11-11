import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { resendConfirmationEmail } from '../../utils/supabaseHelpers'
import toast from 'react-hot-toast'

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [emailResent, setEmailResent] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/')
    } else {
      // معالجة الأخطاء بشكل أفضل
      // Better error handling
      const errorMessage = result.error?.message || result.error || 'حدث خطأ في تسجيل الدخول'
      setError(errorMessage)
    }
    
    setIsLoading(false)
  }

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      toast.error('يرجى إدخال البريد الإلكتروني أولاً')
      return
    }

    setIsResendingEmail(true)
    setEmailResent(false)
    
    const result = await resendConfirmationEmail(formData.email)
    
    if (result.success) {
      setEmailResent(true)
      setTimeout(() => setEmailResent(false), 5000) // إخفاء الرسالة بعد 5 ثواني
    }
    
    setIsResendingEmail(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل دخول العميل
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    خطأ في تسجيل الدخول
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                  {(error.includes('غير مؤكد') || error.includes('Email confirmations') || error.includes('not confirmed')) && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-800 mb-2 font-semibold">
                        💡 نصيحة لحل المشكلة:
                      </p>
                      <div className="space-y-2 mb-3">
                        <p className="text-xs text-yellow-800 font-semibold mb-1">📌 إذا كان "Confirm email" معطّل بالفعل:</p>
                        <ol className="text-xs text-yellow-700 list-decimal list-inside space-y-1 mr-4">
                          <li>افتح <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Supabase Dashboard</a></li>
                          <li><strong>Authentication</strong> → <strong>Users</strong></li>
                          <li>ابحث عن بريدك الإلكتروني واضغط عليه</li>
                          <li>فعّل <strong>"Email Confirmed"</strong> أو اضغط <strong>"Confirm Email"</strong></li>
                          <li>احفظ التغييرات ثم أعد المحاولة</li>
                        </ol>
                        <p className="text-xs text-yellow-800 font-semibold mt-2 mb-1">📌 إذا كان "Confirm email" مفعّل:</p>
                        <ol className="text-xs text-yellow-700 list-decimal list-inside space-y-1 mr-4">
                          <li>افتح <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Supabase Dashboard</a></li>
                          <li><strong>Authentication</strong> → <strong>Providers</strong> → <strong>Settings</strong></li>
                          <li>عطّل <strong>"Confirm email"</strong> ❌</li>
                          <li>احفظ التغييرات ثم أعد المحاولة</li>
                        </ol>
                      </div>
                      <div className="mt-2 pt-2 border-t border-yellow-200">
                        <p className="text-xs text-yellow-800 mb-2">
                          أو أعد إرسال رابط التأكيد:
                        </p>
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={isResendingEmail || !formData.email}
                          className="w-full px-3 py-1.5 text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isResendingEmail ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              جاري الإرسال...
                            </span>
                          ) : emailResent ? (
                            <span className="text-green-700">✓ تم الإرسال بنجاح!</span>
                          ) : (
                            'إعادة إرسال رابط التأكيد'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {error.includes('معطلة') && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-xs text-blue-800 mb-2 font-semibold">
                        🔧 خطوات تفعيل تسجيل الدخول بالبريد:
                      </p>
                      <ol className="text-xs text-blue-700 list-decimal list-inside space-y-1 mr-4">
                        <li>اذهب إلى Supabase Dashboard</li>
                        <li>Authentication → Providers</li>
                        <li>ابحث عن "Email"</li>
                        <li>فعّل "Enable Email provider"</li>
                        <li>احفظ التغييرات</li>
                        <li>أعد المحاولة</li>
                      </ol>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 input"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerLogin
