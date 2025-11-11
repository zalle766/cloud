import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { uploadImage } from '../services/supabaseApi'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, profile, updateUser } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  })

  // جلب بيانات الملف الشخصي والعناوين
  const { data: profileData, isLoading } = useQuery(
    ['profile', user?.id],
    async () => {
      if (!user?.id) return null
      
      // جلب بيانات الملف الشخصي
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // جلب العنوان الافتراضي أو الأول
      let defaultAddress = null
      const { data: defaultAddresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .limit(1)

      if (defaultAddresses && defaultAddresses.length > 0) {
        defaultAddress = defaultAddresses[0]
      } else {
        // إذا لم يكن هناك عنوان افتراضي، نجلب أول عنوان
        const { data: firstAddresses } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
        
        if (firstAddresses && firstAddresses.length > 0) {
          defaultAddress = firstAddresses[0]
        }
      }

      return {
        profile,
        address: defaultAddress
      }
    },
    {
      enabled: !!user?.id,
      onSuccess: (data) => {
        if (data) {
          setFormData({
            name: data.profile?.name || '',
            email: data.profile?.email || user?.email || '',
            phone: data.profile?.phone || '',
            address: data.address?.address || '',
            current_password: '',
            password: '',
            password_confirmation: ''
          })
        }
      }
    }
  )

  const updateProfileMutation = useMutation(
    async (data) => {
      if (!user?.id) throw new Error('يجب تسجيل الدخول')
      
      // تحديث profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          phone: data.phone || null,
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // تحديث أو إنشاء العنوان
      if (data.address) {
        const { data: existingAddresses } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .limit(1)

        if (existingAddresses && existingAddresses.length > 0) {
          // تحديث العنوان الموجود
          const { error: addressError } = await supabase
            .from('addresses')
            .update({
              address: data.address,
            })
            .eq('id', existingAddresses[0].id)

          if (addressError) throw addressError
        } else {
          // إنشاء عنوان جديد
          const { error: addressError } = await supabase
            .from('addresses')
            .insert({
              user_id: user.id,
              label: 'المنزل',
              address: data.address,
              city: 'غير محدد',
              region: 'غير محدد',
              is_default: true,
            })

          if (addressError) throw addressError
        }
      }

      return { success: true }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile'])
        setIsEditing(false)
        toast.success('تم تحديث الملف الشخصي بنجاح')
      },
      onError: (error) => {
        toast.error(error.message || 'حدث خطأ في تحديث الملف الشخصي')
      }
    }
  )

  const uploadAvatarMutation = useMutation(
    async (file) => {
      if (!user?.id) throw new Error('يجب تسجيل الدخول')
      
      const result = await uploadImage(file, 'avatars', 'users')
      if (result.error) throw result.error

      // تحديث avatar_url في profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: result.data.url })
        .eq('id', user.id)

      if (updateError) throw updateError

      return { avatar_url: result.data.url }
    },
    {
      onSuccess: (data) => {
        updateUser({ avatar_url: data.avatar_url })
        queryClient.invalidateQueries(['profile'])
        toast.success('تم تحديث الصورة الشخصية بنجاح')
      },
      onError: (error) => {
        toast.error(error.message || 'حدث خطأ في تحديث الصورة')
      }
    }
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // التحقق من كلمة المرور إذا تم إدخالها
    if (formData.password) {
      if (formData.password.length < 8) {
        toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
        return
      }
      if (formData.password !== formData.password_confirmation) {
        toast.error('كلمة المرور غير متطابقة')
        return
      }
      
      // تحديث كلمة المرور
      supabase.auth.updateUser({ password: formData.password })
        .then(({ error }) => {
          if (error) throw error
          toast.success('تم تحديث كلمة المرور بنجاح')
        })
        .catch((error) => {
          toast.error(error.message || 'فشل تحديث كلمة المرور')
        })
    }
    
    // تحديث البيانات الأخرى
    updateProfileMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    })
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      uploadAvatarMutation.mutate(file)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-header">
            <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
          </div>
          
          <div className="card-body">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                      {profileData?.profile?.avatar_url || profile?.avatar_url ? (
                        <img
                          src={profileData?.profile?.avatar_url || profile?.avatar_url}
                          alt={formData.name || user?.email}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                      <CameraIcon className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {formData.name || profileData?.profile?.name || user?.email}
                  </h2>
                  
                  <p className="text-sm text-gray-600 capitalize">
                    {profileData?.profile?.role === 'admin' && 'مدير'}
                    {profileData?.profile?.role === 'restaurant' && 'صاحب مطعم'}
                    {profileData?.profile?.role === 'courier' && 'سائق توصيل'}
                    {profileData?.profile?.role === 'customer' && 'عميل'}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الكامل
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input pr-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input pr-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input pr-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان
                      </label>
                      <div className="relative">
                        <MapPinIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          id="address"
                          name="address"
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="input pr-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  {isEditing && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">تغيير كلمة المرور</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                            كلمة المرور الحالية
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="current_password"
                              name="current_password"
                              value={formData.current_password}
                              onChange={handleChange}
                              className="input pr-10"
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

                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            كلمة المرور الجديدة
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                            تأكيد كلمة المرور الجديدة
                          </label>
                          <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 space-x-reverse">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="btn-outline"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isLoading}
                          className="btn-primary"
                        >
                          {updateProfileMutation.isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                      >
                        تعديل الملف الشخصي
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
