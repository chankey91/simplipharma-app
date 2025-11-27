# Project Structure

## 📁 Directory Layout

```
SimpliPharma/
│
├── src/                       # Source code
│   ├── api/
│   │   └── firebase.ts       # Firebase configuration and API functions
│   │
│   ├── components/           # Reusable UI components
│   │   ├── MedicineCard.tsx  # Medicine item display
│   │   └── OrderCard.tsx     # Order item display
│   │
│   ├── context/              # State management (Zustand)
│   │   ├── CartContext.tsx   # Shopping cart state
│   │   └── FavoritesContext.tsx # Favorites/wishlist state
│   │
│   ├── screens/              # App screens
│   │   ├── LoginScreen.tsx           # Authentication
│   │   ├── HomeScreen.tsx            # Home with banners
│   │   ├── MedicineListScreen.tsx    # Browse medicines
│   │   ├── MedicineDetailsScreen.tsx # Medicine details
│   │   ├── CartScreen.tsx            # Shopping cart
│   │   ├── OrderConfirmationScreen.tsx # Place order
│   │   ├── OrdersScreen.tsx          # Order history
│   │   ├── OrderTrackingScreen.tsx   # Track order with map
│   │   ├── FavoritesScreen.tsx       # Wishlist
│   │   ├── ProfileScreen.tsx         # User profile
│   │   ├── AdminOrdersScreen.tsx     # Admin: Order management
│   │   ├── AdminProductsScreen.tsx   # Admin: Inventory management
│   │   ├── AdminUserManagementScreen.tsx # Admin: User management
│   │   ├── AdminAccountingScreen.tsx # Admin: Payment collection
│   │   └── AdminBannersScreen.tsx    # Admin: Banner management
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # All interfaces and types
│   │
│   └── utils/                # Utility functions
│       ├── notifications.ts  # Push notification helpers
│       └── recommendations.ts # Product recommendation system
│
├── assets/                   # App assets (icons, images)
│   ├── icon.png             # Main app icon (1024x1024)
│   ├── adaptive-icon.png    # Android adaptive icon
│   ├── splash.png           # Splash screen
│   └── GENERATE_ICON.html   # Icon generator tool
│
├── docs/                     # 📚 All documentation (40+ guides)
│   ├── README.md            # Documentation index
│   ├── QUICK_START.md       # Quick start guide
│   ├── FIREBASE_SETUP.md    # Firebase setup
│   ├── BUILD_ANDROID_GUIDE.md # Build instructions
│   ├── ADMIN_FEATURES_GUIDE.md # Admin features
│   ├── ACCOUNTING_GUIDE.md  # Payment collection
│   ├── TESTING_CHECKLIST.md # Testing guide
│   ├── PROJECT_STRUCTURE.md # This file
│   └── ... (35+ more guides)
│
├── scripts/                  # 🔧 Build & utility scripts
│   ├── README.md            # Scripts documentation
│   ├── build-apk.bat        # Main build script
│   ├── clear-cache-and-rebuild.bat # Clean build
│   ├── diagnose-build.bat   # Build diagnostics
│   └── ... (more scripts)
│
├── templates/                # 📄 Data import templates
│   ├── README.md            # Template documentation
│   ├── SimpliPharma_Inventory.xlsx # Product template
│   └── SimpliPharma_Test_200.xlsx  # Test data
│
├── App.tsx                   # App entry point & navigation
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript configuration
├── babel.config.js          # Babel configuration
├── .gitignore               # Git ignore rules
├── .easignore               # EAS Build ignore rules
└── README.md                 # Main project README
```

## 📄 File Descriptions

### Root Files

#### `App.tsx`
Main application entry point containing:
- Navigation setup (Stack & Tab navigators)
- Authentication state management
- Admin mode toggle
- Logout functionality

#### `app.json`
Expo configuration including:
- App name and version
- Platform-specific settings
- Asset paths
- Bundle identifiers

#### `package.json`
Dependencies and scripts:
- React Native & Expo
- Firebase SDK
- Navigation libraries
- Zustand for state management

#### `tsconfig.json`
TypeScript compiler options and path mappings

#### `babel.config.js`
Babel preset for Expo

---

### `src/api/firebase.ts`
Firebase initialization and helper functions:
- **Configuration**: Firebase app initialization
- **Auth**: Login, register, logout
- **Firestore**: CRUD operations for medicines and orders
- **Offline**: Persistence enabled for offline support

**Key Functions:**
- `loginWithEmail()` - User authentication
- `registerWithEmail()` - User registration
- `fetchMedicines()` - Get all medicines
- `createOrder()` - Place new order
- `fetchRetailerOrders()` - Get user's orders
- `fetchAllOrders()` - Admin: get all orders
- `updateOrderStatus()` - Update order status

---

### `src/types/index.ts`
TypeScript interfaces and types:
- `Medicine` - Medicine data structure
- `CartItem` - Cart item with quantity
- `Order` - Order structure
- `OrderMedicine` - Order item details
- `OrderStatus` - Order status enum
- Navigation param lists

---

### `src/context/CartContext.tsx`
Global cart state management using Zustand:
- `items` - Array of cart items
- `addToCart()` - Add item to cart
- `removeFromCart()` - Remove item
- `updateQuantity()` - Update item quantity
- `clearCart()` - Empty cart
- `getTotalAmount()` - Calculate total
- `getTotalItems()` - Count items

---

### Components

#### `src/components/MedicineCard.tsx`
Displays medicine information:
- Name, price, manufacturer
- Category and stock status
- "Add to Cart" button
- Stock availability indicator

#### `src/components/OrderCard.tsx`
Displays order information:
- Order ID and status
- Order items and quantities
- Total amount
- Retailer email (admin view)
- Status update button (admin)

---

### Screens

#### `src/screens/LoginScreen.tsx`
Authentication screen:
- Email/password login
- Registration form
- Form validation
- Error handling

#### `src/screens/MedicineListScreen.tsx`
Main shopping screen:
- Medicine list with cards
- Search functionality
- Category filtering
- Pull-to-refresh
- Loading states

#### `src/screens/CartScreen.tsx`
Shopping cart management:
- Display cart items
- Quantity controls (+/-)
- Remove items
- Total calculation
- Checkout navigation
- Empty cart state

#### `src/screens/OrderConfirmationScreen.tsx`
Order placement:
- Review order items
- Delivery address input
- Total amount display
- Place order action
- Success feedback

#### `src/screens/OrdersScreen.tsx`
User's order history:
- List of user's orders
- Order status badges
- Order details
- Pull-to-refresh
- Empty state

#### `src/screens/AdminOrdersScreen.tsx`
Admin panel:
- All orders from all retailers
- Retailer information
- Status update controls
- Order management
- Pull-to-refresh

---

## 🔄 Data Flow

### Order Placement Flow
1. User browses medicines (`MedicineListScreen`)
2. Adds items to cart (Zustand store)
3. Reviews cart (`CartScreen`)
4. Proceeds to checkout
5. Enters delivery address (`OrderConfirmationScreen`)
6. Order saved to Firestore
7. Cart cleared
8. Redirected to main screen

### Order Status Update Flow (Admin)
1. Admin toggles admin mode
2. Views all orders (`AdminOrdersScreen`)
3. Clicks status update button
4. Firestore order document updated
5. UI refreshes with new status

### Authentication Flow
1. User enters credentials (`LoginScreen`)
2. Firebase Authentication validates
3. On success, user object stored
4. Navigation to main tabs
5. User ID used for orders

---

## 🎨 UI/UX Patterns

### Color Scheme
- Primary: `#2196F3` (Blue)
- Success: `#4CAF50` (Green)
- Warning: `#FF9800` (Orange)
- Error: `#F44336` (Red)
- Background: `#f5f5f5` (Light Gray)

### Typography
- Title: 24-32px, bold
- Heading: 18-20px, semi-bold
- Body: 14-16px, regular
- Caption: 12px, regular

### Common UI Elements
- Rounded corners: 12px
- Padding: 16px
- Card elevation: 3
- Shadow opacity: 0.1

---

## 🔒 Security Considerations

### Current Implementation (Development)
- Basic Firestore rules
- Email/password authentication
- Client-side validation

### Production Recommendations
- Implement proper Firestore security rules
- Add server-side validation
- Use Firebase Admin SDK for sensitive operations
- Implement rate limiting
- Add user role management
- Encrypt sensitive data
- Set up audit logs

---

## 🚀 Performance Optimizations

### Implemented
- Firestore offline persistence
- Component memoization with functional components
- Efficient state management with Zustand
- List virtualization with FlatList

### Future Improvements
- Image lazy loading
- Pagination for large datasets
- Response caching
- Code splitting
- Bundle size optimization

---

## 📱 Platform-Specific Notes

### iOS
- Safe area handling in place
- Keyboard avoiding view implemented
- Tab bar icons configured

### Android
- Adaptive icons supported
- Back button handling
- Material design principles

### Web
- Responsive design
- Web-specific navigation
- Favicon support

---

## 🧪 Testing Approach

### Manual Testing Checklist
See `TESTING_CHECKLIST.md`

### Recommended Testing Tools
- Jest for unit tests
- React Native Testing Library
- Detox for E2E testing
- Firebase Emulator Suite

---

## 📦 Dependencies Overview

### Core
- `react-native` - Mobile framework
- `expo` - Development platform
- `typescript` - Type safety

### Navigation
- `@react-navigation/native` - Navigation core
- `@react-navigation/native-stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Tab navigator

### State Management
- `zustand` - Lightweight state management

### Backend
- `firebase` - Authentication and database

### UI
- `@expo/vector-icons` - Icon library

---

## 🔄 State Management Strategy

### Local State
- Component-specific data
- Form inputs
- Loading states

### Global State (Zustand)
- Shopping cart
- Cart operations

### Server State (Firebase)
- User authentication
- Medicine catalog
- Orders
- Real-time updates

---

## 📝 Code Style Guidelines

### TypeScript
- Use interfaces for object shapes
- Explicit return types for functions
- Avoid `any` type

### React
- Functional components only
- React Hooks for state
- Props destructuring
- Memo for expensive renders

### Naming Conventions
- PascalCase for components
- camelCase for functions/variables
- UPPER_CASE for constants
- Descriptive names

---

## 🔮 Future Enhancements

### Features
- [ ] Push notifications
- [ ] Payment integration
- [ ] Invoice generation
- [ ] Order tracking map
- [ ] Chat support
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Medicine images
- [ ] Barcode scanning
- [ ] Analytics dashboard

### Technical
- [ ] Unit tests
- [ ] E2E tests
- [ ] CI/CD pipeline
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] A/B testing
- [ ] Cloud Functions
- [ ] Advanced security rules

