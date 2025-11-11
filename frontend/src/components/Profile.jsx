// Profile Component - Upload avatar and update user metadata
// مكون الملف الشخصي - رفع الصورة وتحديث بيانات المستخدم
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })

  // Load user and profile data
  // تحميل بيانات المستخدم والملف الشخصي
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        toast.error('يجب تسجيل الدخول')
        return
      }

      setUser(currentUser)

      // Load profile from profiles table
      // تحميل الملف الشخصي من جدول profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        name: data?.name || '',
        phone: data?.phone || '',
        email: data?.email || currentUser.email || '',
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('فشل تحميل بيانات المستخدم')
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  // التعامل مع تغييرات نموذج الإدخال
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle avatar upload
  // التعامل مع رفع الصورة الشخصية
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type and size
    // التحقق من نوع الملف والحجم
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error('حجم الملف يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    setUploading(true)

    try {
      // Create unique filename
      // إنشاء اسم ملف فريد
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      // رفع إلى Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      // الحصول على الرابط العام
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      // Update profile with new avatar URL
      // تحديث الملف الشخصي برابط الصورة الجديد
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast.success('تم رفع الصورة بنجاح!')
      loadUserData() // Reload to show new avatar
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('فشل رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  // Handle profile update
  // التعامل مع تحديث الملف الشخصي
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Update profile in Supabase
      // تحديث الملف الشخصي في Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      // Update email in auth if changed
      // تحديث البريد الإلكتروني في المصادقة إذا تغير
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        })

        if (emailError) {
          console.error('Email update error:', emailError)
          // Don't throw - profile is updated, email can be updated separately
        }
      }

      toast.success('تم تحديث الملف الشخصي بنجاح!')
      loadUserData()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('فشل تحديث الملف الشخصي')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Avatar Section */}
        {/* قسم الصورة الشخصية */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                profile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  formData.name || 'User'
                )}&background=random`
              }
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
          {uploading && (
            <p className="mt-2 text-sm text-gray-600">جاري رفع الصورة...</p>
          )}
        </div>

        {/* Profile Form */}
        {/* نموذج الملف الشخصي */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile

