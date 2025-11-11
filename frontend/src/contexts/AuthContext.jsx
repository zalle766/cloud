import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { signup, login as supabaseLogin } from '../utils/supabaseHelpers'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is initialized
    if (!supabase) {
      console.warn('Supabase is not initialized. Please check your .env file.')
      setLoading(false)
      return
    }

    // Check for existing session
    checkSession()

    // Listen for auth changes
    // الاستماع لتغييرات المصادقة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔵 Auth state changed:', event, session?.user?.email, 'has session:', !!session)
      
      if (session?.user) {
        // حفظ الجلسة دائماً - حتى بدون تأكيد البريد
        // Always save session - even without email confirmation
        console.log('✅ Setting user from auth state change:', session.user.email, 'Event:', event)
        setUser(session.user)
        await fetchUserProfile(session.user.id)
        
        // التأكد من حفظ الجلسة في localStorage
        // Ensure session is saved in localStorage
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('💾 Ensuring session is persisted...')
          // الجلسة تُحفظ تلقائياً بواسطة Supabase، لكننا نتأكد
          // Session is saved automatically by Supabase, but we verify
          const { data: { session: verifySession } } = await supabase.auth.getSession()
          if (verifySession) {
            console.log('✅ Session verified and persisted')
          }
        }
      } else {
        // مسح الحالة فقط عند تسجيل الخروج الفعلي
        // Clear state only on actual logout
        if (event === 'SIGNED_OUT') {
          console.log('🔴 User signed out')
          setUser(null)
          setProfile(null)
        } else if (event === 'TOKEN_REFRESHED') {
          // عند تحديث الـ token، نحاول الحصول على الجلسة مرة أخرى
          // On token refresh, try to get session again
          console.log('🔄 Token refreshed, checking session...')
          const { data: { session: refreshedSession } } = await supabase.auth.getSession()
          if (refreshedSession?.user) {
            console.log('✅ Session refreshed, user still logged in:', refreshedSession.user.email)
            setUser(refreshedSession.user)
            await fetchUserProfile(refreshedSession.user.id)
          } else {
            console.log('⚠️ No session after token refresh')
            setUser(null)
            setProfile(null)
          }
        } else {
          // عند الأحداث الأخرى (مثل INITIAL_SESSION)، نحاول الحصول على الجلسة
          // On other events (like INITIAL_SESSION), try to get session
          if (event === 'INITIAL_SESSION') {
            console.log('ℹ️ Initial session event - checking for saved session...')
            const { data: { session: savedSession } } = await supabase.auth.getSession()
            if (savedSession?.user) {
              console.log('✅ Found saved session on initial load:', savedSession.user.email)
              setUser(savedSession.user)
              await fetchUserProfile(savedSession.user.id)
            } else {
              console.log('⚠️ No saved session found on initial load')
            }
          } else {
            console.log('ℹ️ Auth event:', event, '- keeping current state')
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSession = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      console.log('🔍 Checking for saved session...')
      
      // الحصول على الجلسة المحفوظة من localStorage
      // Get saved session from localStorage
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('❌ Session error:', sessionError)
        // محاولة الحصول على المستخدم مباشرة
        // Try to get user directly
        try {
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          if (currentUser) {
            console.log('✅ Found user via getUser():', currentUser.email)
            setUser(currentUser)
            await fetchUserProfile(currentUser.id)
            setLoading(false)
            return
          }
        } catch (getUserError) {
          console.error('❌ Error getting user:', getUserError)
        }
        setLoading(false)
        return
      }

      if (session?.user) {
        console.log('✅ Session found for user:', session.user.email)
        console.log('📋 Session details:', {
          email: session.user.email,
          id: session.user.id,
          confirmed: !!session.user.email_confirmed_at,
          expires_at: session.expires_at,
          expires_in: session.expires_in
        })
        
        // حفظ المستخدم دائماً - حتى بدون تأكيد البريد
        // Always save user - even without email confirmation
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      } else {
        console.log('⚠️ No session found in localStorage')
        // محاولة الحصول على المستخدم مباشرة
        // Try to get user directly
        try {
          const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser()
          if (currentUser && !getUserError) {
            console.log('✅ Found user via getUser() even without session:', currentUser.email)
            setUser(currentUser)
            await fetchUserProfile(currentUser.id)
            setLoading(false)
            return
          }
        } catch (getUserError) {
          console.error('❌ Error getting user:', getUserError)
        }
        
        // التحقق من localStorage مباشرة
        // Check localStorage directly
        try {
          const allKeys = Object.keys(localStorage)
          const supabaseKeys = allKeys.filter(key => key.includes('supabase') || key.includes('auth') || key.includes('sb-'))
          console.log('📦 Supabase-related keys in localStorage:', supabaseKeys)
          
          if (supabaseKeys.length > 0) {
            console.log('💡 Found Supabase keys but no active session - trying to refresh...')
            // محاولة تحديث الجلسة
            // Try to refresh session
            try {
              const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
              if (refreshedSession?.user && !refreshError) {
                console.log('✅ Session refreshed successfully:', refreshedSession.user.email)
                setUser(refreshedSession.user)
                await fetchUserProfile(refreshedSession.user.id)
                setLoading(false)
                return
              }
            } catch (refreshError) {
              console.error('❌ Error refreshing session:', refreshError)
            }
          }
        } catch (e) {
          console.error('Error checking localStorage:', e)
        }
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error('❌ Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId) => {
    if (!supabase) return

    try {
      // إضافة timeout لتجنب التعليق
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      )
      
      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ])

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.warn('⚠️ Error fetching profile (non-critical):', error.message || error)
      // Profile might not exist yet, that's okay
    }
  }

  const fetchUser = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (currentUser) {
        setUser(currentUser)
        await fetchUserProfile(currentUser.id)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const login = async (email, password) => {
    try {
      const { user: loggedInUser, error } = await supabaseLogin(email, password)

      if (error) {
        return { success: false, error: error.message || 'فشل تسجيل الدخول' }
      }

      if (loggedInUser) {
        setUser(loggedInUser)
        await fetchUserProfile(loggedInUser.id)
        return { success: true }
      }

      return { success: false, error: 'فشل تسجيل الدخول' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'حدث خطأ في تسجيل الدخول' }
    }
  }

  const register = async (userData) => {
    console.log('🚀 Register function called with:', userData)
    try {
      console.log('📝 Registering user with data:', userData)

      // Extract data for Supabase
      const { name, email, password, phone, address, latitude, longitude } = userData

      // التحقق من البيانات المطلوبة
      if (!name || !name.trim()) {
        console.error('❌ Validation error: name is required')
        return { success: false, error: { name: ['الاسم الكامل مطلوب'] } }
      }
      if (!email || !email.trim()) {
        console.error('❌ Validation error: email is required')
        return { success: false, error: { email: ['البريد الإلكتروني مطلوب'] } }
      }
      if (!password || password.length < 8) {
        console.error('❌ Validation error: password too short')
        return { success: false, error: { password: ['كلمة المرور يجب أن تكون 8 أحرف على الأقل'] } }
      }

      console.log('📤 Calling signup function...')
      // Register with Supabase Auth
      // التسجيل مع Supabase Auth
      let signupResult
      try {
        signupResult = await signup(
          email.trim(),
          password,
          name.trim(),
          phone ? phone.trim() : null
        )
      } catch (signupError) {
        console.error('❌ Signup threw an exception:', signupError)
        return { 
          success: false, 
          error: { 
            general: [signupError.message || 'حدث خطأ في إنشاء الحساب'] 
          } 
        }
      }

      console.log('📥 Signup result:', {
        hasResult: !!signupResult,
        resultType: typeof signupResult,
        hasUser: !!signupResult?.user,
        hasError: !!signupResult?.error,
        userId: signupResult?.user?.id,
        userEmail: signupResult?.user?.email,
        errorMessage: signupResult?.error?.message,
        fullResult: JSON.stringify(signupResult, null, 2)
      })

      // التحقق من أن signupResult موجود وصحيح
      if (!signupResult) {
        console.error('❌ Signup returned null or undefined')
        return { 
          success: false, 
          error: { 
            general: ['فشل إنشاء الحساب. يرجى المحاولة مرة أخرى'] 
          } 
        }
      }

      const { user: newUser, error: authError } = signupResult

      if (authError) {
        console.error('🔴 Registration Error:', {
          message: authError.message,
          fullError: authError
        })
        
        // إرجاع الأخطاء بشكل منظم
        const errorObj = {}
        const errorMessage = authError.message || 'فشل إنشاء الحساب'
        
        // تحديد نوع الخطأ
        if (errorMessage.includes('email') || errorMessage.includes('البريد')) {
          errorObj.email = [errorMessage]
        } else if (errorMessage.includes('password') || errorMessage.includes('كلمة المرور')) {
          errorObj.password = [errorMessage]
        } else if (errorMessage.includes('name') || errorMessage.includes('الاسم')) {
          errorObj.name = [errorMessage]
        } else {
          errorObj.general = [errorMessage]
        }
        
        console.error('❌ Returning error object:', errorObj)
        return { success: false, error: errorObj }
      }

      if (!newUser) {
        console.error('❌ No user returned from signup. SignupResult:', signupResult)
        return { success: false, error: { general: ['فشل إنشاء الحساب. يرجى المحاولة مرة أخرى'] } }
      }

      console.log('✅ User created successfully:', {
        id: newUser.id,
        email: newUser.email,
        emailConfirmed: !!newUser.email_confirmed_at
      })

      // حفظ المستخدم مباشرة
      console.log('💾 Saving user to state...')
      setUser(newUser)
      
      // جميع العمليات الثانوية في الخلفية (بدون انتظار)
      // All secondary operations in background (without waiting)
      Promise.resolve().then(async () => {
        try {
          // تحديث profile برقم الهاتف إذا كان موجوداً
          if (phone && supabase) {
            try {
              await supabase
                .from('profiles')
                .update({ phone: phone.trim() })
                .eq('id', newUser.id)
            } catch (updateError) {
              console.warn('⚠️ Phone update error (non-critical):', updateError)
            }
          }

          // إنشاء عنوان إذا كان موجوداً
          if (address && supabase) {
            try {
              const addressData = {
                user_id: newUser.id,
                label: 'المنزل',
                address: address.trim(),
                city: 'غير محدد',
                region: 'غير محدد',
                is_default: true,
              }
              
              if (latitude) addressData.latitude = parseFloat(latitude)
              if (longitude) addressData.longitude = parseFloat(longitude)

              await supabase
                .from('addresses')
                .insert(addressData)
            } catch (addressError) {
              console.warn('⚠️ Address creation error (non-critical):', addressError)
            }
          }

          // جلب profile
          await fetchUserProfile(newUser.id).catch(err => 
            console.warn('⚠️ Profile fetch error (non-critical):', err)
          )
        } catch (err) {
          console.warn('⚠️ Background operations error (non-critical):', err)
        }
      }).catch(err => 
        console.warn('⚠️ Background promise error:', err)
      )

      console.log('✅ Registration completed successfully!')
      console.log('✅ About to return success: true')
      
      // إرسال toast في الخلفية (بدون انتظار)
      Promise.resolve().then(() => {
        toast.success('تم إنشاء الحساب بنجاح!')
      }).catch(err => console.warn('Toast error:', err))
      
      const returnValue = { success: true }
      console.log('✅ Returning:', JSON.stringify(returnValue, null, 2))
      return returnValue
    } catch (error) {
      console.error('❌ Registration error in catch block:', error)
      console.error('❌ Error stack:', error.stack)
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        fullError: error
      })
      const returnValue = {
        success: false,
        error: { general: [error.message || 'حدث خطأ في إنشاء الحساب'] },
      }
      console.error('❌ Returning error:', JSON.stringify(returnValue, null, 2))
      return returnValue
    } finally {
      // التأكد من أن العملية انتهت
      console.log('🏁 Register function completed (finally block)')
    }
  }

  const logout = async () => {
    if (!supabase) {
      setUser(null)
      setProfile(null)
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setProfile(null)
      toast.success('تم تسجيل الخروج بنجاح')
    } catch (error) {
      console.error('Logout error:', error)
      // Clear local state anyway
      setUser(null)
      setProfile(null)
      toast.success('تم تسجيل الخروج')
    }
  }

  const updateUser = async (userData) => {
    if (!user || !supabase) return

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id)

      if (error) throw error

      // Update local state
      setProfile((prev) => ({ ...prev, ...userData }))
      toast.success('تم تحديث البيانات بنجاح')
    } catch (error) {
      console.error('Update user error:', error)
      toast.error('فشل تحديث البيانات')
    }
  }

  const isAuthenticated = () => {
    return !!user
  }

  const hasRole = (role) => {
    return profile?.role === role
  }

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    fetchUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}