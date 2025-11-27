# SimpliPharma - Medicine Supply App

A comprehensive mobile application for medicine supply business built with React Native, Expo, TypeScript, and Firebase.

## 🎯 Features

### 🛒 Retailer Features:
- ✅ Login with email and password (Admin-created accounts)
- ✅ Browse medicines with search and category filters
- ✅ Medicine details with images, dosage, composition, side effects
- ✅ Add medicines to cart and favorites/wishlist
- ✅ Place orders with delivery address (auto-populated from profile)
- ✅ View order history with status tracking and filters
- ✅ Order tracking with real-time location on map
- ✅ Reorder from previous orders
- ✅ Cancel pending orders
- ✅ Search history
- ✅ View and manage profile (read-only, admin updates)
- ✅ Change password functionality
- ✅ Push notifications for order updates

### 👨‍💼 Admin Features:
- ✅ **Order Management:**
  - View all orders from all retailers
  - Update order status (Pending → Dispatched → Delivered)
  - Filter orders by date (Today, Week, Month, Custom range)
  - Export orders to Excel or PDF
  - Track order details with retailer information

- ✅ **User Management:**
  - Create new user accounts with email/password
  - Manage user profiles (display name, shop name, phone, address)
  - Set user roles (Admin/Retailer)
  - View all registered users
  - Edit user information

- ✅ **Product/Inventory Management:**
  - Add new medicines with all details
  - Edit existing medicine information
  - Delete medicines (soft delete)
  - Export inventory to Excel
  - Import products from Excel (bulk update)
  - Stock management

- ✅ **Accounting & Payment Collection:**
  - Financial dashboard (Revenue, Collected, Outstanding)
  - Collect payments from retailers
  - Multiple payment methods (Cash, Card, UPI, Bank Transfer, Cheque)
  - Partial payment support
  - Payment history for each order
  - Retailer-wise account statements
  - Export ledger to Excel
  - Payment status tracking (Paid/Partial/Unpaid)

### 🔧 Technical Features:
- Firebase Authentication with persistent sessions
- Firestore database with offline support
- React Navigation (Stack + Bottom Tabs)
- Zustand for state management
- Role-based access control
- Excel import/export functionality
- PDF generation for reports
- Push notifications
- Location services and maps
- Date/time pickers
- Clean and modern UI

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo SDK 50)
- **Language:** TypeScript
- **Backend:** Firebase (Authentication + Firestore)
- **Navigation:** React Navigation v6
- **State Management:** Zustand
- **Maps:** React Native Maps, Expo Location
- **Notifications:** Expo Notifications
- **File Operations:** Expo File System, Expo Sharing, Expo Document Picker
- **Data Export:** XLSX (Excel), Expo Print (PDF)
- **Icons:** Expo Vector Icons
- **Storage:** AsyncStorage

## 📁 Project Structure

```
SimpliPharma/
├── src/                              # Source code
│   ├── api/
│   │   └── firebase.ts              # Firebase config & all API functions
│   ├── screens/                     # All app screens
│   │   ├── LoginScreen.tsx          # Authentication
│   │   ├── MedicineListScreen.tsx   # Browse medicines
│   │   ├── MedicineDetailsScreen.tsx # Product details
│   │   ├── CartScreen.tsx           # Shopping cart
│   │   ├── OrderConfirmationScreen.tsx # Place order
│   │   ├── OrdersScreen.tsx         # Retailer orders
│   │   ├── OrderTrackingScreen.tsx  # Track with map
│   │   ├── FavoritesScreen.tsx      # Wishlist
│   │   ├── ProfileScreen.tsx        # User profile
│   │   ├── AdminOrdersScreen.tsx    # Admin: All orders + export
│   │   ├── AdminUserManagementScreen.tsx # Admin: User management
│   │   ├── AdminProductsScreen.tsx  # Admin: Inventory + Excel
│   │   └── AdminAccountingScreen.tsx # Admin: Payments & ledger
│   ├── context/                     # State management
│   │   ├── CartContext.tsx          # Cart state (Zustand)
│   │   └── FavoritesContext.tsx     # Favorites state (Zustand)
│   ├── components/                  # Reusable components
│   │   ├── MedicineCard.tsx         # Medicine item
│   │   └── OrderCard.tsx            # Order item
│   ├── types/                       # TypeScript definitions
│   │   └── index.ts                 # TypeScript interfaces
│   └── utils/                       # Utility functions
│       ├── notifications.ts         # Push notifications
│       └── recommendations.ts       # Product recommendations
├── assets/                          # Images and icons
│   ├── icon.png                     # App icon
│   ├── adaptive-icon.png            # Android adaptive icon
│   └── splash.png                   # Splash screen
├── docs/                            # 📚 All documentation
│   ├── README.md                    # Documentation index
│   ├── QUICK_START.md               # Quick start guide
│   ├── FIREBASE_SETUP.md            # Firebase setup
│   ├── BUILD_ANDROID_GUIDE.md       # Build instructions
│   ├── ADMIN_FEATURES_GUIDE.md      # Admin features
│   └── ... (40+ guides)             # Complete documentation
├── scripts/                         # 🔧 Build & utility scripts
│   ├── README.md                    # Scripts documentation
│   ├── build-apk.bat                # Build APK script
│   ├── clear-cache-and-rebuild.bat  # Cache clearing
│   └── ... (more scripts)           # Various utilities
├── templates/                       # 📄 Data templates
│   ├── README.md                    # Template documentation
│   ├── SimpliPharma_Inventory.xlsx  # Product import template
│   └── SimpliPharma_Test_200.xlsx   # Test data
├── App.tsx                          # Main navigation
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── app.json                         # Expo config
├── eas.json                         # EAS Build config
└── README.md                        # This file
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/chankey91/SimpliPharma.git
cd SimpliPharma
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

See [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md) for detailed instructions.

**Quick steps:**
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create Firestore database
4. Update `src/api/firebase.ts` with your config
5. Set Firestore security rules
6. Add sample medicines data

### 4. Run the App

```bash
# Start Metro bundler
npm start

# Or use Expo commands
npx expo start

# Scan QR code with Expo Go app
```

## 📱 Building APK

### Using EAS Build (Recommended):

```bash
# Login to Expo
eas login

# Build APK
eas build -p android --profile preview

# Wait 10-15 minutes
# Download APK from provided link
```

See [docs/BUILD_ANDROID_GUIDE.md](docs/BUILD_ANDROID_GUIDE.md) for detailed instructions.

## 📖 Documentation

All documentation has been organized in the `docs/` folder. See [docs/README.md](docs/README.md) for complete index.

### 🚀 Quick Links:
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Get started quickly
- **[docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** - Firebase configuration
- **[docs/ADMIN_SETUP_GUIDE.txt](docs/ADMIN_SETUP_GUIDE.txt)** - Create first admin user
- **[docs/BUILD_ANDROID_GUIDE.md](docs/BUILD_ANDROID_GUIDE.md)** - Build Android APK

### 📚 Features & Guides:
- **[docs/ADMIN_FEATURES_GUIDE.md](docs/ADMIN_FEATURES_GUIDE.md)** - All admin features
- **[docs/ACCOUNTING_GUIDE.md](docs/ACCOUNTING_GUIDE.md)** - Payment collection system
- **[docs/ORDER_EXPORT_GUIDE.md](docs/ORDER_EXPORT_GUIDE.md)** - Export orders to Excel/PDF
- **[docs/NEW_FEATURES.md](docs/NEW_FEATURES.md)** - Complete feature list

### 🔧 Build & Scripts:
- **[scripts/README.md](scripts/README.md)** - Build scripts documentation
- **[docs/BUILD_TROUBLESHOOTING.md](docs/BUILD_TROUBLESHOOTING.md)** - Common issues

### 📄 Templates:
- **[templates/README.md](templates/README.md)** - Data import templates
- **[docs/EXCEL_TEMPLATE_GUIDE.txt](docs/EXCEL_TEMPLATE_GUIDE.txt)** - Excel import guide

## 💡 Usage

### For Retailers:

1. **Login** (Contact admin for account)
2. **Browse** medicines and add to cart
3. **Place Order** with delivery address
4. **Track Order** status and location
5. **View History** and reorder
6. **Manage** favorites and profile

### For Admins:

1. **Toggle Admin Mode** (Shield icon)
2. **Manage Orders** - View, update status, export
3. **Manage Users** - Create accounts, edit profiles
4. **Manage Products** - Add, edit, import/export
5. **Collect Payments** - Record payments, view ledger
6. **Generate Reports** - Excel/PDF exports

## 🔐 Admin Access

To create the first admin user:

1. Create a user account
2. Go to Firestore Console
3. Find the user in `users` collection
4. Add field: `role: "admin"`
5. Refresh app
6. Shield icon appears!

See [docs/ADMIN_SETUP_GUIDE.txt](docs/ADMIN_SETUP_GUIDE.txt) for details.

## 📊 Key Features Highlights

### Accounting System
- 💰 Track all financial transactions
- 💵 Collect payments with multiple methods
- 📊 View financial dashboard
- 📖 Complete ledger management
- 📥 Export to Excel for accounting

### Order Management
- 📋 Filter by date (Today, Week, Month, Custom)
- 📄 Export to Excel or PDF
- 🚚 Track orders with maps
- 📱 Push notifications
- ❌ Order cancellation

### Product Management
- 📦 Complete inventory system
- 📥 Excel import/export
- ✏️ Easy add/edit/delete
- 📊 Stock tracking

### User Management
- 👥 Admin creates accounts
- 🔐 Role-based access
- 📝 Profile management
- 🔑 Password reset

## 🔧 Configuration

### Firestore Collections:

- `medicines` - Product catalog
- `orders` - All orders with payment info
- `users` - User profiles and roles
- `favorites` - User wishlists

### App Configuration:

- `app.json` - Expo configuration
- `eas.json` - Build configuration
- `tsconfig.json` - TypeScript settings

## 🐛 Troubleshooting

### Common Issues:

1. **Metro bundler not starting**
   ```bash
   npx expo start --clear
   ```

2. **Firebase connection error**
   - Check Firebase configuration
   - Verify Firestore rules
   - Ensure collections exist

3. **Build fails**
   - Update all packages: `npm update`
   - Clear cache: `npm start -- --reset-cache`

4. **Can't see admin features**
   - Ensure `role: "admin"` is set in Firestore
   - Tap shield icon to toggle admin mode

## 📱 Tested On

- ✅ Android (Expo Go + Standalone APK)
- ✅ iOS (Expo Go)
- ✅ Web (Limited features)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Developer

**GitHub:** [@chankey91](https://github.com/chankey91)

## 🙏 Acknowledgments

- React Native & Expo team
- Firebase team
- All open-source contributors

---

**SimpliPharma** - Making medicine supply management simple and efficient! 💊📱✨
