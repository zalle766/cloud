import React, { useState, useContext, createContext } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('cartRestaurant')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const addItem = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        localStorage.setItem('cartItems', JSON.stringify(updatedItems))
        return updatedItems
      } else {
        const newItems = [...prevItems, { ...product, quantity }]
        localStorage.setItem('cartItems', JSON.stringify(newItems))
        return newItems
      }
    })
  }

  const removeItem = (productId) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId)
      localStorage.setItem('cartItems', JSON.stringify(updatedItems))
      return updatedItems
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
      localStorage.setItem('cartItems', JSON.stringify(updatedItems))
      return updatedItems
    })
  }

  const clearCart = () => {
    setItems([])
    setRestaurant(null)
    localStorage.removeItem('cartItems')
    localStorage.removeItem('cartRestaurant')
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    items,
    restaurant,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    setRestaurant
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
