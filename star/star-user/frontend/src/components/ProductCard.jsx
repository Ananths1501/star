"use client"

const ProductCard = ({ product, user, onAddToCart }) => {
  // Calculate discounted price
  const discountedPrice = product.price - product.price * (product.discount / 100)

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        <div className="mb-3">
          {product.discount > 0 ? (
            <div className="flex items-center">
              <p className="font-bold text-blue-600">₹{discountedPrice.toLocaleString()}</p>
              <p className="text-gray-500 text-sm line-through ml-2">₹{product.price.toLocaleString()}</p>
            </div>
          ) : (
            <p className="font-bold text-blue-600">₹{product.price.toLocaleString()}</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {product.warranty > 0 ? `${product.warranty} months warranty` : "No warranty"}
        </p>

        {user ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <button className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700">Buy Now</button>
          </div>
        ) : (
          <button className="w-full bg-gray-600 text-white py-1 rounded hover:bg-gray-700">Login to Order</button>
        )}
      </div>
    </div>
  )
}

export default ProductCard
