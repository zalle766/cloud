import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
function TestApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f97316, #0ea5e9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#f97316', marginBottom: '20px', fontSize: '2.5rem' }}>
          🍽️ Eat to Eat
        </h1>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '30px' }}>
          تطبيق توصيل الطعام الأسرع والأكثر موثوقية
        </p>
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f0f9ff',
          borderRadius: '10px',
          borderLeft: '4px solid #0ea5e9'
        }}>
          <strong>حالة التطبيق:</strong> يعمل بشكل طبيعي ✅
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#888' }}>
          إذا كنت ترى هذه الصفحة، فالتطبيق يعمل بشكل صحيح.
        </p>
      </div>
    </div>
  )
}

console.log('Test App loaded successfully')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)