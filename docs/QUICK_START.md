# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config
5. Update `src/api/firebase.ts` with your Firebase credentials

See `FIREBASE_SETUP.md` for detailed instructions.

### 3. Add Sample Data
Add some medicine documents to your Firestore `medicines` collection. Sample data structure:

```json
{
  "name": "Paracetamol 500mg",
  "category": "Pain Relief",
  "price": 50,
  "stock": 100,
  "manufacturer": "ABC Pharma"
}
```

### 4. Run the App
```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Scan QR code with Expo Go app

### 5. Create an Account
1. Open the app
2. Click "Register"
3. Enter email and password
4. Start ordering medicines!

## 📱 App Features

### Retailer Mode (Default)
- **Medicines Tab**: Browse and search medicines
- **Cart Tab**: Manage your cart
- **Orders Tab**: View your order history

### Admin Mode
- Toggle admin mode using the icon in the header
- View all orders from all retailers
- Update order statuses

## 🔧 Troubleshooting

### "Firebase not configured" error
→ Update Firebase config in `src/api/firebase.ts`

### No medicines showing
→ Add sample medicine documents to Firestore

### App not starting
→ Run `expo start -c` to clear cache

### Module not found errors
→ Run `npm install` again

## 📝 Next Steps

1. Customize the UI to match your brand
2. Add more medicine categories
3. Set up proper Firebase security rules
4. Test the complete order flow
5. Deploy to app stores

## 🎨 Customization Tips

- Colors: Search for hex codes like `#2196F3` to change theme
- Fonts: Update fontSize values in StyleSheet
- Layout: Modify padding/margin values
- Icons: Change icon names in navigation config

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript](https://www.typescriptlang.org/)

## 🤝 Support

For issues or questions:
1. Check the README.md
2. Check the FIREBASE_SETUP.md
3. Review Expo documentation
4. Check Firebase console for errors

