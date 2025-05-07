"use client"

import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-700 mb-4">The application encountered an error. Please try refreshing the page.</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          {this.props.showDetails && this.state.error && (
            <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-40">
              <p className="font-mono text-sm text-gray-800">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
