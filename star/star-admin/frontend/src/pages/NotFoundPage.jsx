import { Link } from "react-router-dom"
import { Home, AlertTriangle } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-blue dark:bg-gray-900 px-4">
      <div className="text-center bg-white/90 dark:bg-gray-800/90 p-8 rounded-lg shadow-2xl backdrop-blur-sm max-w-md w-full animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle size={40} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 animate-pulse">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn-gradient-blue py-2 px-6 rounded-md text-white flex items-center justify-center mx-auto w-max transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Home size={18} className="mr-2" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
