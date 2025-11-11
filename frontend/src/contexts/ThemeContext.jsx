import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // التحقق من localStorage أولاً
    const saved = localStorage.getItem('theme')
    if (saved) {
      return saved === 'dark'
    }
    // إذا لم يكن هناك تفضيل محفوظ، استخدم تفضيل النظام
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // تطبيق الوضع الداكن عند التحميل الأولي
  useEffect(() => {
    const root = document.documentElement
    const saved = localStorage.getItem('theme')
    const shouldBeDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (shouldBeDark) {
      root.classList.add('dark')
      console.log('🌙 Dark mode enabled on mount')
    } else {
      root.classList.remove('dark')
      console.log('☀️ Light mode enabled on mount')
    }
  }, []) // فقط عند التحميل الأولي

  // تحديث الوضع عند تغيير isDark
  useEffect(() => {
    const root = document.documentElement
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    if (isDark) {
      root.classList.add('dark')
      console.log('🌙 Dark mode applied')
    } else {
      root.classList.remove('dark')
      console.log('☀️ Light mode applied')
    }
  }, [isDark])

  const toggleTheme = () => {
    console.log('🔄 Toggling theme from', isDark ? 'dark' : 'light', 'to', isDark ? 'light' : 'dark')
    setIsDark(prev => {
      const newValue = !prev
      console.log('✅ Theme changed to:', newValue ? 'dark' : 'light')
      return newValue
    })
  }

  const value = {
    isDark,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
