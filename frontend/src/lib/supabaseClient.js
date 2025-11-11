// Supabase Client Configuration
// إعداد عميل Supabase للاتصال بقاعدة البيانات
import { createClient } from '@supabase/supabase-js'

// Get environment variables
// الحصول على متغيرات البيئة
// Fallback values if .env file is missing (temporary solution)
// قيم احتياطية إذا كان ملف .env مفقوداً (حل مؤقت)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rzwprzrwhcaaqcbponiw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc'

// Validate environment variables (show warning but don't crash)
// التحقق من وجود متغيرات البيئة (إظهار تحذير لكن لا تعطل التطبيق)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Missing Supabase environment variables. Please check your .env file.'
  )
  console.warn('Make sure you have:')
  console.warn('- VITE_SUPABASE_URL')
  console.warn('- VITE_SUPABASE_ANON_KEY')
}

// Create and export Supabase client (use empty strings if not available)
// إنشاء وتصدير عميل Supabase (استخدام قيم فارغة إذا لم تكن متاحة)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Auto refresh session
        // تحديث الجلسة تلقائياً
        autoRefreshToken: true,
        // Persist session in localStorage (مهم جداً!)
        // حفظ الجلسة في localStorage (very important!)
        persistSession: true,
        // Storage key for session
        // Storage key for session
        storageKey: 'sb-auth-token',
        // Storage type (localStorage)
        // Storage type (localStorage)
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        // Detect session from URL (for OAuth callbacks)
        // اكتشاف الجلسة من الرابط (لـ OAuth)
        detectSessionInUrl: true,
        // Flow type (PKCE for better security)
        // Flow type (PKCE for better security)
        flowType: 'pkce',
      },
    })
  : null

// Helper function to get current user
// دالة مساعدة للحصول على المستخدم الحالي
export const getCurrentUser = async () => {
  if (!supabase) {
    console.warn('Supabase client is not initialized')
    return null
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper function to get current session
// دالة مساعدة للحصول على الجلسة الحالية
export const getCurrentSession = async () => {
  if (!supabase) {
    console.warn('Supabase client is not initialized')
    return null
  }
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

