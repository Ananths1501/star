"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const ProductCard = ({ product }) => {
  const [showDetails, setShowDetails] = useState(false)
  const { user } = useContext(AuthContext)
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!user) {
      navigate("/user/login")
      return
    }
    addToCart(product)
    toast.success(`${product.name} added to cart!`)
  }

  const handleOrderNow = (e) => {
    e.stopPropagation()
    if (!user) {
      navigate("/user/login")
      return
    }
    addToCart(product)
    navigate(`/${user._id}/cart`)
  }

  const discountedPrice = product.price - product.price * (product.discount / 100)

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-2xl font-bold text-gray-400">{product.name.substring(0, 1)}</div>
          </div>
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md transform rotate-3 shadow-md">
              {product.discount}% OFF
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow bg-gradient-card">
          <h3 className="text-lg font-semibold text-purple-700 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.brand}</p>

          <div className="mb-4">
            {product.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-pink-500 font-bold text-lg mr-2">₹{discountedPrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">₹{product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-bold text-lg text-purple-700">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-auto">
            {user ? (
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                  onClick={handleAddToCart}
                >
                  <i className="fas fa-cart-plus mr-1"></i> Add
                </button>
                <button
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                  onClick={handleOrderNow}
                >
                  Buy Now
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => navigate("/user/login")}
              >
                Login to Shop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              onClick={() => setShowDetails(false)}
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-6xl font-bold text-gray-400">{product.name.substring(0, 1)}</div>
              </div>

              <div className="p-6 md:w-1/2 bg-gradient-card">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2">
                  Brand: <span className="font-medium">{product.brand}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Type: <span className="font-medium">{product.type}</span>
                </p>

                <div className="mb-4">
                  {product.discount > 0 ? (
                    <div className="flex items-center">
                      <span className="text-pink-500 font-bold text-2xl mr-3">₹{discountedPrice.toFixed(2)}</span>
                      <span className="text-gray-400 line-through text-lg">₹{product.price.toFixed(2)}</span>
                      <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-md">
                        {product.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-2xl text-purple-700">₹{product.price.toFixed(2)}</span>
                  )}
                </div>

                <div className="bg-white/80 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-cyan-50 px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-500">In Stock</p>
                    <p className="font-semibold text-cyan-700">{product.stock} units</p>
                  </div>

                  {product.warranty > 0 && (
                    <div className="bg-purple-50 px-4 py-2 rounded-md">
                      <p className="text-sm text-gray-500">Warranty</p>
                      <p className="font-semibold text-purple-700">{product.warranty} months</p>
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="flex gap-4">
                    <button
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
                      onClick={handleAddToCart}
                    >
                      <i className="fas fa-cart-plus mr-2"></i> Add to Cart
                    </button>
                    <button
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
                      onClick={handleOrderNow}
                    >
                      <i className="fas fa-bolt mr-2"></i> Buy Now
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-md font-medium transition-colors"
                    onClick={() => navigate("/user/login")}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Login to Shop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard
