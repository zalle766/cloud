import React from 'react'

const LoadingSpinner = ({ message = 'جاري التحميل...', size = 'large' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
