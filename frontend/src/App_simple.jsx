import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocationProvider } from './contexts/LocationContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar_simple'
import LocationModal from './components/LocationModal'
import Home from './pages/Home_simple'
import { RestaurantRegistration, AdminDashboard } from './restaurant'
import { UserRegistration, UserLogin, UserProfile } from './user'
import Restaurants from './pages/RestaurantsSimple'
import UserDashboard from './pages/UserDashboard'
import ImageTest from './pages/ImageTest'

function App() {
  console.log('App component loaded successfully')
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LocationProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/image-test" element={<ImageTest />} />
                <Route path="/restaurant/register" element={<RestaurantRegistration />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/user/register" element={<UserRegistration />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="*" element={<Home />} />
              </Routes>
              
              {/* Location Modal */}
              <LocationModal />
            </div>
          </LocationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
