import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-gray-600 mb-6">
              عذراً، حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                المحاولة مرة أخرى
              </button>
            </div>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded text-xs text-gray-800 overflow-auto">
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
