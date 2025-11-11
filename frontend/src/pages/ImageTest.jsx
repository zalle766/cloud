import React from 'react'

const ImageTest = () => {
  const testImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">اختبار الصور</h1>
          <p className="mt-2 text-gray-600">تأكد من أن الصور تظهر بشكل صحيح</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testImages.map((image, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={image}
                  alt={`Test Image ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onLoad={() => {
                    console.log(`Image ${index + 1} loaded successfully`)
                  }}
                  onError={(e) => {
                    console.error(`Image ${index + 1} failed to load:`, image)
                    e.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Failed'
                  }}
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  صورة اختبار {index + 1}
                </h3>
                <p className="text-gray-600 text-sm">
                  إذا كانت هذه الصورة تظهر، فالصور تعمل بشكل صحيح
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a 
            href="/restaurants" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            العودة لصفحة المطاعم
          </a>
        </div>
      </div>
    </div>
  )
}

export default ImageTest
