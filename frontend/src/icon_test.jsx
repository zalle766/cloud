import React from 'react'
import ReactDOM from 'react-dom/client'

// Test all the icons used in the app
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  TruckIcon,
  UsersIcon,
  ShoppingBagIcon,
  GiftIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

function IconTest() {
  const icons = [
    { name: 'MagnifyingGlassIcon', component: MagnifyingGlassIcon },
    { name: 'MapPinIcon', component: MapPinIcon },
    { name: 'StarIcon', component: StarIcon },
    { name: 'ClockIcon', component: ClockIcon },
    { name: 'TruckIcon', component: TruckIcon },
    { name: 'UsersIcon', component: UsersIcon },
    { name: 'ShoppingBagIcon', component: ShoppingBagIcon },
    { name: 'GiftIcon', component: GiftIcon },
    { name: 'CheckCircleIcon', component: CheckCircleIcon },
    { name: 'QuestionMarkCircleIcon', component: QuestionMarkCircleIcon },
    { name: 'HeartIcon', component: HeartIcon },
    { name: 'ShieldCheckIcon', component: ShieldCheckIcon },
    { name: 'XMarkIcon', component: XMarkIcon }
  ]

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Icon Test - All icons loaded successfully ✅</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '20px' }}>
        {icons.map(({ name, component: Icon }) => (
          <div key={name} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <Icon style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

console.log('Icon test loaded successfully')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IconTest />
  </React.StrictMode>,
)
