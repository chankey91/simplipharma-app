# Setup Checklist

Use this checklist to ensure your app is properly configured.

## ✅ Installation

- [ ] Run `npm install`
- [ ] Verify all dependencies installed without errors

## ✅ Firebase Configuration

- [ ] Created Firebase project
- [ ] Enabled Email/Password Authentication
- [ ] Created Firestore database
- [ ] Updated Firebase config in `src/api/firebase.ts`
- [ ] Added sample medicine documents to Firestore
- [ ] Updated Firestore security rules (optional for development)

## ✅ Testing

- [ ] Run `npm start` successfully
- [ ] App loads without crashes
- [ ] Can register new account
- [ ] Can login with created account
- [ ] Medicines list loads and displays
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Can add items to cart
- [ ] Cart badge shows item count
- [ ] Can update quantities in cart
- [ ] Can remove items from cart
- [ ] Can proceed to checkout
- [ ] Can place order with delivery address
- [ ] Order appears in "My Orders" tab
- [ ] Can toggle to Admin mode
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Can logout successfully

## ✅ Production Readiness (Optional)

- [ ] Updated Firestore security rules for production
- [ ] Added app icons (assets folder)
- [ ] Added splash screen
- [ ] Tested on physical device
- [ ] Tested offline functionality
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure app.json with proper bundle identifiers
- [ ] Test on both iOS and Android

## 🐛 Common Issues

### Issue: Firebase connection error
**Solution**: Check if Firebase config is correctly set in `src/api/firebase.ts`

### Issue: "No medicines found"
**Solution**: Add sample medicine documents to Firestore `medicines` collection

### Issue: Authentication fails
**Solution**: Verify Email/Password is enabled in Firebase Authentication

### Issue: Orders not saving
**Solution**: Check Firestore permissions and security rules

### Issue: App crashes on start
**Solution**: Clear cache with `expo start -c` and reinstall dependencies

## 📞 Need Help?

1. Review README.md for general information
2. Check FIREBASE_SETUP.md for Firebase-specific issues
3. See QUICK_START.md for getting started guide
4. Check Expo logs for error messages
5. Verify all checklist items are completed

