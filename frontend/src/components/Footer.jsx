import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="mr-3 text-xl font-bold">Eat to Eat</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              تطبيق توصيل الطعام الأسرع والأكثر موثوقية في مصر. 
              نحن نربط بين أفضل المطاعم والعملاء مع خدمة توصيل سريعة وآمنة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-white transition-colors">
                  المطاعم
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  عن التطبيق
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">معلومات الاتصال</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-primary-400 ml-2" />
                <span className="text-gray-300">القاهرة، مصر</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-primary-400 ml-2" />
                <span className="text-gray-300">+20 123 456 7890</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-primary-400 ml-2" />
                <span className="text-gray-300">info@eattoeat.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Eat to Eat. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
              صُنع بـ <HeartIcon className="h-4 w-4 text-red-500 mx-1" /> في مصر
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
