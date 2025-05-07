"use client"

import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (err) {
        console.error("Error parsing cart from localStorage:", err)
      }
    }
  }, [])

  useEffect(() => {
    // Calculate total whenever cart changes
    const newTotal = cart.reduce((sum, item) => {
      const discountedPrice = item.price - item.price * (item.discount / 100)
      return sum + discountedPrice * item.quantity
    }, 0)

    setTotal(newTotal)

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item._id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
