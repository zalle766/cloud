// مكون مصادقة بسيط جداً - جاهز للاستخدام مباشرة
// Very Simple Auth Component - Ready to use directly
import { useState } from 'react'
import { login, signup } from '../utils/supabaseHelpers'
import { useNavigate } from 'react-router-dom'

const SimpleAuth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // تسجيل الدخول
  // Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { user, error } = await login(email, password)

    if (user) {
      // نجح تسجيل الدخول - انتقل للصفحة الرئيسية
      // Login successful - navigate to home
      navigate('/')
    }

    setLoading(false)
  }

  // التسجيل (إنشاء حساب)
  // Sign Up (Create account)
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { user, error } = await signup(email, password, name)

    if (user) {
      // نجح التسجيل - انتقل للصفحة الرئيسية
      // Signup successful - navigate to home
      navigate('/')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h2>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {/* الاسم (فقط عند التسجيل) */}
          {/* Name (only for signup) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
                placeholder="أدخل اسمك"
              />
            </div>
          )}

          {/* البريد الإلكتروني */}
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="example@email.com"
            />
          </div>

          {/* كلمة المرور */}
          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="أدخل كلمة المرور"
              minLength={6}
            />
          </div>

          {/* زر الإرسال */}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
          >
            {loading
              ? 'جاري المعالجة...'
              : isLogin
              ? 'تسجيل الدخول'
              : 'إنشاء الحساب'}
          </button>
        </form>

        {/* التبديل بين تسجيل الدخول والتسجيل */}
        {/* Toggle between login and signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700"
          >
            {isLogin
              ? 'ليس لديك حساب؟ سجل الآن'
              : 'لديك حساب بالفعل؟ سجل الدخول'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimpleAuth

