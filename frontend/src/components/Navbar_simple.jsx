import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useLocation as useLocationContext } from '../contexts/LocationContext'
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserIcon,
  ShoppingCartIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, hasRole } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { userLocation, openLocationModal } = useLocationContext()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (hasRole('admin')) return '/admin'
    if (hasRole('restaurant')) return '/restaurant'
    if (hasRole('courier')) return '/courier'
    return '/dashboard'
  }

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: HomeIcon },
    { name: 'المطاعم', href: '/restaurants', icon: BuildingStorefrontIcon },
  ]

  const userMenu = [
    { name: 'الملف الشخصي', href: '/user/profile', icon: UserIcon },
    { name: 'لوحة التحكم', href: getDashboardLink(), icon: UserIcon },
    { name: 'تسجيل الدخول', href: '/user/login', icon: UserIcon },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gradient">Eat to Eat</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {/* Location Button */}
            <button
              onClick={openLocationModal}
              className="location-button flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium"
            >
              <MapPinIcon className="h-4 w-4 text-primary-600" />
              <span className="text-gray-700">
                {userLocation ? (
                  userLocation.neighborhood && userLocation.neighborhood !== userLocation.city 
                    ? `${userLocation.neighborhood}, ${userLocation.city}`
                    : userLocation.street && userLocation.street !== userLocation.city
                    ? `${userLocation.street}, ${userLocation.city}`
                    : userLocation.district && userLocation.district !== userLocation.city
                    ? `${userLocation.district}, ${userLocation.city}`
                    : userLocation.address
                ) : 'تحديد الموقع'}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Cart - Simplified without useCart */}
            <Link
              to="/cart"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 space-x-reverse p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {userMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4 ml-3" />
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <span className="ml-3">تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link
                  to="/user/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/user/register"
                  className="btn-primary"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {/* Mobile Location Button */}
              <button
                onClick={() => {
                  openLocationModal()
                  setIsMenuOpen(false)
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              >
                <MapPinIcon className="h-5 w-5 ml-3" />
                {userLocation ? (
                  userLocation.neighborhood && userLocation.neighborhood !== userLocation.city 
                    ? `${userLocation.neighborhood}, ${userLocation.city}`
                    : userLocation.street && userLocation.street !== userLocation.city
                    ? `${userLocation.street}, ${userLocation.city}`
                    : userLocation.district && userLocation.district !== userLocation.city
                    ? `${userLocation.district}, ${userLocation.city}`
                    : userLocation.address
                ) : 'تحديد الموقع'}
              </button>
              
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 ml-3" />
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated() && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  {userMenu.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 ml-3" />
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
