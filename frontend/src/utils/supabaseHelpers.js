// دوال مساعدة لاستخدام Supabase بسهولة
// Helper functions for easy Supabase usage
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

/**
 * ============================================
 * دوال المصادقة (Authentication)
 * ============================================
 */

/**
 * تسجيل الدخول
 * Login
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export const login = async (email, password) => {
  if (!supabase) {
    const errorMsg = 'Supabase غير مهيأ. يرجى إنشاء ملف .env في مجلد frontend وإعادة تشغيل الخادم'
    toast.error(errorMsg, { duration: 6000 })
    console.error('❌ Supabase Error:', errorMsg)
    console.error('📝 الحل: أنشئ ملف .env في frontend/ يحتوي على VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY')
    return { user: null, error: { message: 'Supabase not initialized' } }
  }

  try {
    // تنظيف البريد الإلكتروني
    const cleanEmail = email.trim().toLowerCase()
    
    console.log('📤 Attempting login for:', cleanEmail)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    })

    if (error) {
      console.error('🔴 Login error:', error)
      
      // معالجة خطأ "Email not confirmed"
      // Handle "Email not confirmed" error
      if (error.message?.includes('Email not confirmed') || 
          error.message?.includes('email_not_confirmed') ||
          error.message?.includes('not confirmed')) {
        
        console.warn('⚠️ Email not confirmed, attempting alternative methods...')
        
        // محاولة إعادة إرسال رابط التأكيد
        // Try to resend confirmation link
        try {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: cleanEmail,
          })
          
          if (!resendError) {
            console.log('✅ Confirmation email resent successfully')
            const errorMessage = 'البريد الإلكتروني غير مؤكد. تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك وتأكيد الحساب ثم المحاولة مرة أخرى.'
            toast.error(errorMessage, { duration: 7000 })
            return { user: null, error: { message: errorMessage, originalError: error, needsConfirmation: true } }
          }
        } catch (resendErr) {
          console.error('Error resending confirmation:', resendErr)
        }
        
        // رسالة خطأ محسّنة مع تعليمات
        // Improved error message with instructions
        const errorMessage = 'البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني أو تعطيل تأكيد البريد في Supabase Dashboard (Authentication → Settings → عطّل "Enable email confirmations")'
        toast.error(errorMessage, { duration: 8000 })
        return { user: null, error: { message: errorMessage, originalError: error, needsConfirmation: true } }
      }
      
      // معالجة أخطاء أخرى
      // Handle other errors
      let errorMessage = error.message || 'فشل تسجيل الدخول'
      
      // معالجة خطأ "Email logins are disabled"
      // Handle "Email logins are disabled" error
      if (error.message?.includes('Email logins are disabled') || 
          error.message?.includes('email logins disabled') ||
          error.message?.includes('disabled')) {
        errorMessage = 'تسجيلات الدخول بالبريد الإلكتروني معطلة. يرجى تفعيل Email Provider في Supabase Dashboard (Authentication → Providers → Email → Enable)'
        toast.error(errorMessage, { duration: 8000 })
        return { user: null, error: { message: errorMessage, originalError: error, needsConfig: true } }
      }
      
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('invalid') ||
          error.status === 400) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'المستخدم غير موجود. يرجى إنشاء حساب جديد'
      }
      
      toast.error(errorMessage)
      return { user: null, error: { message: errorMessage, originalError: error } }
    }

    // تأكد من أن المستخدم موجود
    // Make sure user exists
    if (!data.user) {
      const errorMessage = 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى'
      toast.error(errorMessage)
      return { user: null, error: { message: errorMessage } }
    }

    // تأكد من أن الجلسة محفوظة
    // Make sure session is saved
    if (data.session) {
      console.log('✅ Login successful, session saved:', data.user.email)
      
      // التأكد من حفظ الجلسة في localStorage
      // Ensure session is saved in localStorage
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    } else {
      console.warn('⚠️ No session after login, trying to get session...')
      const { data: { session: savedSession } } = await supabase.auth.getSession()
      if (savedSession) {
        console.log('✅ Session retrieved:', savedSession.user.email)
      }
    }

    toast.success('تم تسجيل الدخول بنجاح!')
    return { user: data.user, error: null }
  } catch (err) {
    console.error('Login error:', err)
    toast.error('حدث خطأ أثناء تسجيل الدخول')
    return { user: null, error: { message: err.message || 'حدث خطأ أثناء تسجيل الدخول', originalError: err } }
  }
}

/**
 * إعادة إرسال رابط تأكيد البريد الإلكتروني
 * Resend email confirmation link
 * @param {string} email - البريد الإلكتروني
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export const resendConfirmationEmail = async (email) => {
  if (!supabase) {
    const errorMsg = 'Supabase غير مهيأ. يرجى إنشاء ملف .env في مجلد frontend وإعادة تشغيل الخادم'
    toast.error(errorMsg)
    return { success: false, error: { message: errorMsg } }
  }

  try {
    const cleanEmail = email.trim().toLowerCase()
    
    console.log('📧 Resending confirmation email to:', cleanEmail)
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
    })

    if (error) {
      console.error('🔴 Resend confirmation error:', error)
      let errorMessage = error.message || 'فشل إرسال رابط التأكيد'
      
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        errorMessage = 'تم إرسال الكثير من الطلبات. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى'
      } else if (error.message?.includes('not found') || error.message?.includes('user not found')) {
        errorMessage = 'المستخدم غير موجود. يرجى إنشاء حساب جديد'
      }
      
      toast.error(errorMessage)
      return { success: false, error: { message: errorMessage, originalError: error } }
    }

    console.log('✅ Confirmation email resent successfully')
    toast.success('تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك')
    return { success: true, error: null }
  } catch (err) {
    console.error('Resend confirmation error:', err)
    toast.error('حدث خطأ أثناء إرسال رابط التأكيد')
    return { success: false, error: { message: err.message || 'حدث خطأ أثناء إرسال رابط التأكيد', originalError: err } }
  }
}

/**
 * التسجيل (إنشاء حساب جديد)
 * Sign Up (Create new account)
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 * @param {string} name - الاسم
 * @param {string} phone - رقم الهاتف (اختياري)
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export const signup = async (email, password, name, phone = null) => {
  console.log('🚀 signup function called')
  
  if (!supabase) {
    const errorMsg = 'Supabase غير مهيأ. يرجى إنشاء ملف .env في مجلد frontend وإعادة تشغيل الخادم'
    toast.error(errorMsg, { duration: 6000 })
    console.error('❌ Supabase Error:', errorMsg)
    console.error('📝 الحل: أنشئ ملف .env في frontend/ يحتوي على VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY')
    console.error('💡 أو شغّل FIX_ENV_NOW.bat في مجلد frontend')
    return { user: null, error: { message: 'Supabase not initialized' } }
  }

  console.log('✅ Supabase is initialized, proceeding with signup...')

  try {
    // التحقق من صحة البيانات
    if (!email || !email.trim()) {
      return { user: null, error: { message: 'البريد الإلكتروني مطلوب' } }
    }
    if (!password || password.length < 8) {
      return { user: null, error: { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' } }
    }
    if (!name || !name.trim()) {
      return { user: null, error: { message: 'الاسم مطلوب' } }
    }

    // تنظيف البيانات قبل الإرسال
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()
    const cleanPhone = phone ? phone.trim() : null
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return { user: null, error: { message: 'البريد الإلكتروني غير صحيح' } }
    }
    
    // تسجيل المستخدم في Supabase Auth
    console.log('📤 Sending signup request to Supabase:', {
      email: cleanEmail,
      passwordLength: password.length,
      name: cleanName,
      hasPhone: !!cleanPhone
    })
    
    const signUpOptions = {
      email: cleanEmail,
      password: password,
    }
    
    // إضافة metadata فقط إذا كان هناك بيانات
    if (cleanName || cleanPhone) {
      signUpOptions.options = {
        data: {}
      }
      if (cleanName) {
        signUpOptions.options.data.name = cleanName
      }
      if (cleanPhone) {
        signUpOptions.options.data.phone = cleanPhone
      }
    }
    
    console.log('📤 Calling supabase.auth.signUp with options:', {
      email: signUpOptions.email,
      hasOptions: !!signUpOptions.options,
      hasMetadata: !!(signUpOptions.options?.data)
    })
    
    console.log('📤 Calling supabase.auth.signUp now...')
    let data, error
    try {
      const response = await supabase.auth.signUp(signUpOptions)
      data = response.data
      error = response.error
      console.log('✅ supabase.auth.signUp completed')
    } catch (signUpException) {
      console.error('❌ supabase.auth.signUp threw exception:', signUpException)
      return {
        user: null,
        error: {
          message: signUpException.message || 'حدث خطأ في الاتصال بخادم Supabase'
        }
      }
    }
    
    console.log('📥 Supabase signUp response:', {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      hasError: !!error,
      errorMessage: error?.message,
      errorStatus: error?.status,
      errorCode: error?.code
    })

    if (error) {
      // تحسين رسائل الخطأ
      let errorMessage = error.message || 'فشل إنشاء الحساب'
      
      console.error('🔴 Supabase Signup Error Details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        email: cleanEmail,
        name: cleanName,
        hasPhone: !!cleanPhone,
        fullError: JSON.stringify(error, null, 2)
      })
      
      // تحويل رسائل Supabase إلى رسائل واضحة
      const errorMsgLower = error.message?.toLowerCase() || ''
      
      if (error.status === 400) {
        // خطأ 400 - بيانات غير صحيحة
        if (errorMsgLower.includes('email') || errorMsgLower.includes('invalid')) {
          errorMessage = 'البريد الإلكتروني غير صحيح أو مستخدم بالفعل'
        } else if (errorMsgLower.includes('password') || errorMsgLower.includes('weak')) {
          errorMessage = 'كلمة المرور ضعيفة. يجب أن تكون 8 أحرف على الأقل وتحتوي على أحرف وأرقام'
        } else if (errorMsgLower.includes('already') || errorMsgLower.includes('exists') || errorMsgLower.includes('registered')) {
          errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول'
        } else {
          // محاولة استخراج رسالة أوضح من الخطأ
          errorMessage = error.message || 'البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول'
        }
      } else if (error.status === 422) {
        errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد آخر'
      } else if (errorMsgLower.includes('user already registered') || 
                 errorMsgLower.includes('already registered') ||
                 errorMsgLower.includes('already exists') ||
                 error.code === '23505') {
        errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول'
      } else if (errorMsgLower.includes('invalid email') || 
                 errorMsgLower.includes('email address')) {
        errorMessage = 'البريد الإلكتروني غير صحيح. يرجى التحقق من البريد'
      } else if (errorMsgLower.includes('password') || errorMsgLower.includes('weak')) {
        errorMessage = 'كلمة المرور ضعيفة. يجب أن تكون 8 أحرف على الأقل'
      }
      
      return { user: null, error: { message: errorMessage, originalError: error } }
    }

    if (!data.user) {
      console.error('❌ No user returned from signUp. Data:', data)
      return { user: null, error: { message: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى' } }
    }

    console.log('✅ User created in Supabase Auth:', {
      id: data.user.id,
      email: data.user.email,
      emailConfirmed: !!data.user.email_confirmed_at,
      hasSession: !!data.session
    })

    // تحديث profile في الخلفية (بدون انتظار)
    // Update profile in background (without waiting)
    console.log('⏳ Starting profile update in background...')
    Promise.resolve().then(async () => {
      try {
        // انتظار قليل لضمان أن trigger إنشاء profile قد تم تنفيذه
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const profileData = {
          email: cleanEmail,
          name: cleanName,
          role: 'customer',
        }
        
        if (cleanPhone) {
          profileData.phone = cleanPhone
        }

        // محاولة تحديث profile أولاً
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', data.user.id)

        if (updateError) {
          console.log('⚠️ Profile update failed, trying to insert...', updateError.message)
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              ...profileData,
            })

          if (insertError && !insertError.message.includes('duplicate') && insertError.code !== '23505') {
            console.warn('⚠️ Profile creation/update error (non-critical):', insertError)
          } else {
            console.log('✅ Profile handled successfully')
          }
        } else {
          console.log('✅ Profile updated successfully')
        }
      } catch (profileError) {
        console.warn('⚠️ Profile error (non-critical):', profileError)
      }
    }).catch(err => console.warn('⚠️ Background profile update error:', err))

    // حفظ الجلسة في الخلفية (بدون انتظار)
    // Save session in background (without waiting)
    if (data.session) {
      console.log('✅ Session created after signup, saving in background...')
      Promise.resolve().then(async () => {
        try {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          })
          if (setSessionError) {
            console.warn('⚠️ Error setting session (non-critical):', setSessionError)
          } else {
            console.log('✅ Session saved successfully')
          }
        } catch (sessionError) {
          console.warn('⚠️ Exception setting session (non-critical):', sessionError)
        }
      }).catch(err => console.warn('⚠️ Background session save error:', err))
    } else {
      console.warn('⚠️ No session in signup response (this is okay if email confirmation is disabled)')
    }

    console.log('✅ Signup completed successfully. Returning user:', {
      id: data.user.id,
      email: data.user.email
    })
    
    const returnValue = { user: data.user, error: null }
    console.log('✅ Signup returning:', {
      hasUser: !!returnValue.user,
      userEmail: returnValue.user?.email,
      hasError: !!returnValue.error,
      returnValue: JSON.stringify(returnValue, null, 2)
    })
    
    return returnValue
  } catch (err) {
    console.error('❌ Signup error in catch block:', err)
    console.error('❌ Error stack:', err.stack)
    console.error('❌ Error details:', {
      message: err.message,
      name: err.name,
      fullError: err
    })
    
    const returnValue = { 
      user: null, 
      error: { 
        message: err.message || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى' 
      } 
    }
    console.error('❌ Signup returning error:', returnValue)
    return returnValue
  } finally {
    console.log('🏁 Signup function completed (finally block)')
  }
}

/**
 * تسجيل الخروج
 * Logout
 */
export const logout = async () => {
  if (!supabase) {
    console.warn('Supabase not initialized')
    return
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    toast.success('تم تسجيل الخروج بنجاح')
  } catch (err) {
    console.error('Logout error:', err)
    toast.error('فشل تسجيل الخروج')
  }
}

/**
 * الحصول على المستخدم الحالي
 * Get current user
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    return user
  } catch (err) {
    console.error('Get user error:', err)
    return null
  }
}

/**
 * ============================================
 * دوال قاعدة البيانات (Database)
 * ============================================
 */

/**
 * جلب جميع السجلات من جدول
 * Get all records from a table
 * @param {string} tableName - اسم الجدول
 * @param {object} filters - المرشحات (اختياري)
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const getAll = async (tableName, filters = {}) => {
  if (!supabase) {
    console.warn('Supabase not initialized')
    return { data: [], error: { message: 'Supabase not initialized' } }
  }

  try {
    let query = supabase.from(tableName).select('*')

    // تطبيق المرشحات
    // Apply filters
    if (filters.eq) {
      Object.entries(filters.eq).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (filters.orderBy) {
      query = query.order(filters.orderBy, { ascending: filters.ascending ?? true })
    }

    const { data, error } = await query

    if (error) throw error
    return { data: data || [], error: null }
  } catch (err) {
    console.error(`Get all ${tableName} error:`, err)
    return { data: [], error: err }
  }
}

/**
 * جلب سجل واحد بالمعرف
 * Get one record by ID
 * @param {string} tableName - اسم الجدول
 * @param {string} id - المعرف
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getById = async (tableName, id) => {
  if (!supabase) {
    console.warn('Supabase not initialized')
    return { data: null, error: { message: 'Supabase not initialized' } }
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error(`Get ${tableName} by id error:`, err)
    return { data: null, error: err }
  }
}

/**
 * إضافة سجل جديد
 * Add new record
 * @param {string} tableName - اسم الجدول
 * @param {object} record - البيانات
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const add = async (tableName, record) => {
  if (!supabase) {
    toast.error('Supabase غير مهيأ')
    return { data: null, error: { message: 'Supabase not initialized' } }
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([record])
      .select()
      .single()

    if (error) throw error
    toast.success('تمت الإضافة بنجاح!')
    return { data, error: null }
  } catch (err) {
    console.error(`Add ${tableName} error:`, err)
    toast.error('فشلت الإضافة')
    return { data: null, error: err }
  }
}

/**
 * تحديث سجل
 * Update record
 * @param {string} tableName - اسم الجدول
 * @param {string} id - المعرف
 * @param {object} updates - التحديثات
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const update = async (tableName, id, updates) => {
  if (!supabase) {
    toast.error('Supabase غير مهيأ')
    return { data: null, error: { message: 'Supabase not initialized' } }
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    toast.success('تم التحديث بنجاح!')
    return { data, error: null }
  } catch (err) {
    console.error(`Update ${tableName} error:`, err)
    toast.error('فشل التحديث')
    return { data: null, error: err }
  }
}

/**
 * حذف سجل
 * Delete record
 * @param {string} tableName - اسم الجدول
 * @param {string} id - المعرف
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export const remove = async (tableName, id) => {
  if (!supabase) {
    toast.error('Supabase غير مهيأ')
    return { success: false, error: { message: 'Supabase not initialized' } }
  }

  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) throw error
    toast.success('تم الحذف بنجاح!')
    return { success: true, error: null }
  } catch (err) {
    console.error(`Delete ${tableName} error:`, err)
    toast.error('فشل الحذف')
    return { success: false, error: err }
  }
}

/**
 * ============================================
 * دوال التخزين (Storage)
 * ============================================
 */

/**
 * رفع ملف
 * Upload file
 * @param {File} file - الملف
 * @param {string} bucket - اسم الـ bucket
 * @param {string} folder - المجلد (اختياري)
 * @returns {Promise<{url: string|null, error: object|null}>}
 */
export const uploadFile = async (file, bucket = 'images', folder = '') => {
  if (!supabase) {
    toast.error('Supabase غير مهيأ')
    return { url: null, error: { message: 'Supabase not initialized' } }
  }

  try {
    // إنشاء اسم فريد
    // Create unique name
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // رفع الملف
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // الحصول على الرابط
    // Get URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    toast.success('تم رفع الملف بنجاح!')
    return { url: publicUrl, error: null }
  } catch (err) {
    console.error('Upload file error:', err)
    toast.error('فشل رفع الملف')
    return { url: null, error: err }
  }
}

/**
 * حذف ملف
 * Delete file
 * @param {string} bucket - اسم الـ bucket
 * @param {string} filePath - مسار الملف
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export const deleteFile = async (bucket, filePath) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) throw error
    toast.success('تم حذف الملف بنجاح!')
    return { success: true, error: null }
  } catch (err) {
    console.error('Delete file error:', err)
    toast.error('فشل حذف الملف')
    return { success: false, error: err }
  }
}

/**
 * ============================================
 * دوال مساعدة أخرى
 * ============================================
 */

/**
 * التحقق من تسجيل الدخول
 * Check if user is logged in
 * @returns {Promise<boolean>}
 */
export const isLoggedIn = async () => {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * جلب الملف الشخصي
 * Get user profile
 * @param {string} userId - معرف المستخدم
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getProfile = async (userId) => {
  return await getById('profiles', userId)
}

/**
 * تحديث الملف الشخصي
 * Update user profile
 * @param {string} userId - معرف المستخدم
 * @param {object} updates - التحديثات
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const updateProfile = async (userId, updates) => {
  return await update('profiles', userId, updates)
}

