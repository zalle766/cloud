import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { RealTimeProvider } from './contexts/RealTimeContext'
import { CartProvider } from './pages/Cart'
import { LocationProvider } from './contexts/LocationContext'
import ErrorBoundary from './components/ErrorBoundary'
import LocationModal from './components/LocationModal'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import CustomerLogin from './pages/auth/CustomerLogin'
import CustomerRegister from './pages/auth/CustomerRegister'
import RestaurantLogin from './pages/auth/RestaurantLogin'
import RestaurantRegister from './pages/auth/RestaurantRegister'
import CourierLogin from './pages/auth/CourierLogin'
import CourierRegister from './pages/auth/CourierRegister'
import Restaurants from './pages/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard'
import CourierDashboard from './pages/courier/CourierDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import TestPage from './pages/TestPage'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocationProvider>
          <AuthProvider>
            <RealTimeProvider>
              <CartProvider>
                <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Customer Routes */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              
              {/* Restaurant Routes */}
              <Route path="/restaurant/login" element={<RestaurantLogin />} />
              <Route path="/restaurant/register" element={<RestaurantRegister />} />
              
              {/* Courier Routes */}
              <Route path="/courier/login" element={<CourierLogin />} />
              <Route path="/courier/register" element={<CourierRegister />} />
              
              {/* Protected Routes */}
              <Route path="/test" element={<TestPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="restaurants" element={<Restaurants />} />
                <Route path="restaurants/:id" element={<RestaurantDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Admin Routes */}
                <Route path="admin/*" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Restaurant Routes */}
                <Route path="restaurant/*" element={
                  <ProtectedRoute role="restaurant">
                    <RestaurantDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Courier Routes */}
                <Route path="courier/*" element={
                  <ProtectedRoute role="courier">
                    <CourierDashboard />
                  </ProtectedRoute>
                } />
              </Route>
                </Routes>
                {/* Location Modal */}
                <LocationModal />
              </CartProvider>
            </RealTimeProvider>
          </AuthProvider>
        </LocationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
