# Testing Guide

This guide covers testing strategies and implementation for Eat to Eat.

## 🧪 Testing Strategy

### Testing Pyramid
```
        /\
       /  \
      / E2E \     <- End-to-End Tests (Few)
     /______\
    /        \
   /Integration\ <- Integration Tests (Some)
  /____________\
 /              \
/   Unit Tests   \ <- Unit Tests (Many)
/________________\
```

### Test Types
- **Unit Tests:** Test individual components in isolation
- **Integration Tests:** Test component interactions
- **End-to-End Tests:** Test complete user workflows
- **Performance Tests:** Test system performance
- **Security Tests:** Test security vulnerabilities

## 🔧 Backend Testing (Laravel)

### Test Environment Setup

#### PHPUnit Configuration
```xml
<!-- phpunit.xml -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
    </php>
</phpunit>
```

#### Test Database Setup
```php
// tests/TestCase.php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Run migrations
        $this->artisan('migrate');
        
        // Seed test data
        $this->artisan('db:seed');
    }
}
```

### Unit Tests

#### Model Tests
```php
<?php
// tests/Unit/Models/UserTest.php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created()
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com'
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com'
        ]);
    }

    public function test_user_has_restaurant_relationship()
    {
        $user = User::factory()->create(['role' => 'restaurant']);
        $restaurant = $user->restaurant()->create([
            'name' => 'Test Restaurant',
            'address' => '123 Test St'
        ]);

        $this->assertInstanceOf('App\Models\Restaurant', $user->restaurant);
        $this->assertEquals('Test Restaurant', $user->restaurant->name);
    }
}
```

#### Service Tests
```php
<?php
// tests/Unit/Services/OrderServiceTest.php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\OrderService;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $orderService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->orderService = new OrderService();
    }

    public function test_calculate_order_total()
    {
        $product1 = Product::factory()->create(['price' => 25.00]);
        $product2 = Product::factory()->create(['price' => 15.00]);

        $items = [
            ['product_id' => $product1->id, 'quantity' => 2],
            ['product_id' => $product2->id, 'quantity' => 1]
        ];

        $total = $this->orderService->calculateTotal($items);

        $this->assertEquals(65.00, $total);
    }
}
```

### Integration Tests

#### API Tests
```php
<?php
// tests/Feature/Api/AuthTest.php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'customer',
            'phone' => '+1234567890',
            'address' => '123 Test St'
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'user' => ['id', 'name', 'email', 'role'],
                        'token'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'user' => ['id', 'name', 'email', 'role'],
                        'token'
                    ]
                ]);
    }

    public function test_authenticated_user_can_access_protected_route()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/user');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => ['id', 'name', 'email', 'role']
                ]);
    }
}
```

#### Database Tests
```php
<?php
// tests/Feature/Database/OrderTest.php

namespace Tests\Feature\Database;

use Tests\TestCase;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_can_be_created_with_items()
    {
        $user = User::factory()->create();
        $restaurant = Restaurant::factory()->create();
        $product1 = Product::factory()->create(['restaurant_id' => $restaurant->id]);
        $product2 = Product::factory()->create(['restaurant_id' => $restaurant->id]);

        $order = Order::create([
            'user_id' => $user->id,
            'restaurant_id' => $restaurant->id,
            'total_price' => 50.00,
            'status' => 'pending',
            'delivery_address' => '123 Test St'
        ]);

        $order->items()->create([
            'product_id' => $product1->id,
            'quantity' => 2,
            'price' => 25.00
        ]);

        $order->items()->create([
            'product_id' => $product2->id,
            'quantity' => 1,
            'price' => 15.00
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'total_price' => 50.00
        ]);

        $this->assertCount(2, $order->items);
    }
}
```

### Test Data Factories

#### User Factory
```php
<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => $this->faker->randomElement(['customer', 'restaurant', 'courier', 'admin']),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
        ];
    }

    public function customer()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'customer',
            ];
        });
    }

    public function restaurant()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'restaurant',
            ];
        });
    }
}
```

#### Restaurant Factory
```php
<?php
// database/factories/RestaurantFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'name' => $this->faker->company(),
            'description' => $this->faker->paragraph(),
            'address' => $this->faker->address(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->email(),
            'opening_time' => '09:00',
            'closing_time' => '23:00',
            'delivery_fee' => $this->faker->randomFloat(2, 10, 30),
            'delivery_radius' => $this->faker->numberBetween(5, 20),
            'is_active' => true,
        ];
    }
}
```

## ⚛️ Frontend Testing (React)

### Test Environment Setup

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Test Setup
```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });
```

### Component Tests

#### Button Component Test
```javascript
// src/components/__tests__/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Form Component Test
```javascript
// src/components/__tests__/LoginForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  test('renders login form fields', () => {
    renderWithRouter(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithRouter(<LoginForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    const mockLogin = jest.fn();
    renderWithRouter(<LoginForm onLogin={mockLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
    });
  });
});
```

### Hook Tests

#### useAuth Hook Test
```javascript
// src/hooks/__tests__/useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../../contexts/AuthContext';

const wrapper = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('useAuth Hook', () => {
  test('returns initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  test('login updates user state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toBeTruthy();
    expect(result.current.user.email).toBe('test@example.com');
  });
});
```

### Integration Tests

#### API Integration Test
```javascript
// src/services/__tests__/api.test.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { authAPI } from '../api';

const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          user: { id: 1, email: 'test@example.com' },
          token: 'fake-token'
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Service', () => {
  test('login API call', async () => {
    const response = await authAPI.login('test@example.com', 'password');
    
    expect(response.data.success).toBe(true);
    expect(response.data.data.user.email).toBe('test@example.com');
    expect(response.data.data.token).toBe('fake-token');
  });
});
```

## 🎭 End-to-End Testing

### Cypress Setup
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
```

### E2E Test Examples
```javascript
// cypress/e2e/user-registration.cy.js
describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a new user', () => {
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="password-confirmation-input"]').type('password');
    cy.get('[data-testid="phone-input"]').type('+1234567890');
    cy.get('[data-testid="address-input"]').type('123 Test St');
    
    cy.get('[data-testid="register-button"]').click();
    
    cy.url().should('include', '/');
    cy.get('[data-testid="user-menu"]').should('contain', 'Test User');
  });

  it('should show validation errors for invalid data', () => {
    cy.get('[data-testid="register-button"]').click();
    
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });
});
```

## 📊 Test Coverage

### Coverage Configuration
```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## 🚀 Continuous Integration

### GitHub Actions
```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: eattoeat_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql, dom, filter, gd, iconv, json, mbstring, pdo
        
    - name: Install Composer dependencies
      run: composer install --no-progress --prefer-dist --optimize-autoloader
      
    - name: Run tests
      run: php artisan test --coverage
      
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:ci
      
    - name: Upload coverage
      uses: codecov/codecov-action@v1
```

## 🔧 Test Utilities

### Test Helpers
```javascript
// src/test-utils/index.js
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../contexts/AuthContext';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestQueryClient(),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={store}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
```

## 📈 Performance Testing

### Load Testing
```javascript
// tests/performance/load-test.js
import { check } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let response = http.get('http://localhost:8000/api/restaurants');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

**Need help with testing?** Contact our QA team at qa@eattoeat.com

**Last Updated:** 2024-01-01
