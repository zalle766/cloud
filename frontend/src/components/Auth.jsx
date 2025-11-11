// Auth Component - Signup and Login using Supabase Auth
// مكون المصادقة - التسجيل وتسجيل الدخول باستخدام Supabase Auth
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const Auth = ({ mode = 'login' }) => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  })

  // Handle form input changes
  // التعامل مع تغييرات نموذج الإدخال
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle login
  // التعامل مع تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      // Update user metadata if needed
      // تحديث بيانات المستخدم إذا لزم الأمر
      if (data.user) {
        toast.success('تم تسجيل الدخول بنجاح!')
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  // Handle signup
  // التعامل مع التسجيل
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sign up with Supabase Auth
      // التسجيل باستخدام Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Additional user metadata
          // بيانات المستخدم الإضافية
          data: {
            name: formData.name,
            phone: formData.phone,
            role: 'customer', // Default role
          },
        },
      })

      if (error) throw error

      // After signup, update the profiles table
      // بعد التسجيل، تحديث جدول الملفات الشخصية
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            role: 'customer',
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw - user is created, profile can be updated later
        }

        toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.')
        navigate('/auth/login')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.message || 'فشل إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  // Handle password reset
  // التعامل مع إعادة تعيين كلمة المرور
  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('يرجى إدخال البريد الإلكتروني')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      )

      if (error) throw error

      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني')
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error(error.message || 'فشل إرسال رابط إعادة التعيين')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={isLogin ? handleLogin : handleSignup}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <>
                {/* Name field for signup */}
                {/* حقل الاسم للتسجيل */}
                <div>
                  <label htmlFor="name" className="sr-only">
                    الاسم
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="الاسم الكامل"
                  />
                </div>

                {/* Phone field for signup */}
                {/* حقل الهاتف للتسجيل */}
                <div>
                  <label htmlFor="phone" className="sr-only">
                    الهاتف
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="رقم الهاتف (اختياري)"
                  />
                </div>
              </>
            )}

            {/* Email field */}
            {/* حقل البريد الإلكتروني */}
            <div>
              <label htmlFor="email" className="sr-only">
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  !isLogin ? '' : 'rounded-t-md'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="البريد الإلكتروني"
              />
            </div>

            {/* Password field */}
            {/* حقل كلمة المرور */}
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                minLength={6}
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? 'جاري المعالجة...'
                : isLogin
                ? 'تسجيل الدخول'
                : 'إنشاء الحساب'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin
                ? 'ليس لديك حساب؟ سجل الآن'
                : 'لديك حساب بالفعل؟ سجل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth

