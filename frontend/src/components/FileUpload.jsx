import React, { useState, useRef } from 'react'
import { useMutation } from 'react-query'
import { authAPI } from '../services/api'
import { 
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const FileUpload = ({ 
  onUpload, 
  accept = 'image/*', 
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const uploadMutation = useMutation(authAPI.uploadAvatar, {
    onSuccess: (response) => {
      toast.success('تم رفع الملف بنجاح')
      if (onUpload) {
        onUpload(response.data.data)
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'حدث خطأ في رفع الملف')
    }
  })

  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      toast.error('نوع الملف غير مدعوم')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`حجم الملف كبير جداً. الحد الأقصى ${maxSize / (1024 * 1024)}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload file
    const formData = new FormData()
    formData.append('file', file)
    uploadMutation.mutate(formData)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveFile = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveFile()
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {accept.includes('image') ? (
                <PhotoIcon className="h-full w-full" />
              ) : (
                <CloudArrowUpIcon className="h-full w-full" />
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragging ? 'أفلت الملف هنا' : 'اسحب الملف هنا أو انقر للاختيار'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF حتى {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        )}

        {uploadMutation.isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload
