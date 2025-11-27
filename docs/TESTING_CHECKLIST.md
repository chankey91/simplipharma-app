# ✅ SimpliPharma - Complete Testing Checklist

## 📱 App Information
- **App Name:** SimpliPharma
- **Version:** 1.0.0
- **Platforms:** Android & iOS
- **Last Updated:** October 2025

---

## 🧪 Testing Overview

### Test Types:
- ✅ Functional Testing
- ✅ UI/UX Testing
- ✅ Integration Testing
- ✅ Role-Based Access Testing
- ✅ Data Export Testing
- ✅ Payment Collection Testing

### User Roles to Test:
1. **Retailer** (Regular User)
2. **Admin** (Administrator)

---

## 🔐 1. AUTHENTICATION & LOGIN

### Test Case 1.1: Login Screen
- [ ] App opens to login screen
- [ ] Email input field visible and functional
- [ ] Password input field visible with hidden text
- [ ] "Login" button visible
- [ ] Info box shows "Contact admin for account creation"
- [ ] App title displays "SimpliPharma"

### Test Case 1.2: Login - Valid Credentials
- [ ] Enter valid email and password
- [ ] Tap "Login" button
- [ ] Login successful
- [ ] Redirects to main screen
- [ ] Bottom navigation visible

### Test Case 1.3: Login - Invalid Credentials
- [ ] Enter invalid email/password
- [ ] Tap "Login"
- [ ] Error message displayed
- [ ] Cannot access app

### Test Case 1.4: Login Persistence
- [ ] Login to app
- [ ] Close app completely
- [ ] Reopen app
- [ ] User still logged in (session persists)

### Test Case 1.5: Logout
- [ ] Tap logout icon (top-right)
- [ ] Confirmation dialog appears
- [ ] Tap "Logout"
- [ ] Redirects to login screen
- [ ] Cannot navigate back to app

---

## 🛒 2. RETAILER FEATURES

### Test Case 2.1: Medicine List Screen
- [ ] Medicines list loads successfully
- [ ] Each medicine card shows:
  - [ ] Medicine name
  - [ ] Category
  - [ ] Price
  - [ ] Manufacturer
  - [ ] Stock status
- [ ] Scroll works smoothly
- [ ] Pull-to-refresh works

### Test Case 2.2: Search Functionality
- [ ] Search bar visible at top
- [ ] Type medicine name
- [ ] Results filter in real-time
- [ ] Correct medicines displayed
- [ ] Clear search shows all medicines

### Test Case 2.3: Category Filter
- [ ] Category filter button visible
- [ ] Tap category filter
- [ ] Categories list appears
- [ ] Select a category
- [ ] Only medicines from that category shown
- [ ] "All" category shows all medicines

### Test Case 2.4: Medicine Details
- [ ] Tap on a medicine card
- [ ] Medicine details screen opens
- [ ] Shows all information:
  - [ ] Name, price, stock
  - [ ] Description
  - [ ] Dosage information
  - [ ] Composition
  - [ ] Side effects
  - [ ] Image (if available)
- [ ] "Add to Cart" button visible
- [ ] Back button works

### Test Case 2.5: Add to Cart
- [ ] From medicine list, tap "Add to Cart"
- [ ] Success message appears
- [ ] Cart badge count increases
- [ ] From medicine details, tap "Add to Cart"
- [ ] Quantity selector works
- [ ] Can increase/decrease quantity

### Test Case 2.6: Favorites/Wishlist
- [ ] Heart icon visible on medicine cards
- [ ] Tap heart to add to favorites
- [ ] Heart fills in/changes color
- [ ] Medicine added to favorites
- [ ] Tap heart again to remove
- [ ] Go to Favorites tab
- [ ] All favorited medicines shown
- [ ] Can remove from favorites

### Test Case 2.7: Shopping Cart
- [ ] Tap Cart tab
- [ ] All added medicines shown
- [ ] Shows quantity for each
- [ ] Shows price per item
- [ ] Shows subtotal
- [ ] Shows total amount
- [ ] Can increase quantity (+)
- [ ] Can decrease quantity (-)
- [ ] Can remove item (X or Remove)
- [ ] Empty cart shows message
- [ ] "Proceed to Checkout" button visible

### Test Case 2.8: Order Confirmation
- [ ] From cart, tap "Proceed to Checkout"
- [ ] Order confirmation screen opens
- [ ] Shows order summary
- [ ] Delivery address field shown
- [ ] Address auto-populated from profile
- [ ] Can edit delivery address
- [ ] Total amount displayed
- [ ] "Place Order" button visible
- [ ] Tap "Place Order"
- [ ] Order placed successfully
- [ ] Success message shown
- [ ] Options: "View Orders" or "Continue Shopping"

### Test Case 2.9: Order History
- [ ] Tap "Orders" or "My Orders" tab
- [ ] All previous orders shown
- [ ] Each order shows:
  - [ ] Order ID
  - [ ] Order date
  - [ ] Total amount
  - [ ] Order status (Pending/Dispatched/Delivered/Cancelled)
  - [ ] Number of items
- [ ] Orders sorted by date (newest first)
- [ ] Tap on an order
- [ ] Order details shown
- [ ] Medicine list in order visible
- [ ] Delivery address shown

### Test Case 2.10: Order Filters
- [ ] Filter button visible on Orders screen
- [ ] Can filter by:
  - [ ] Status (All, Pending, Dispatched, Delivered, Cancelled)
  - [ ] Date range
- [ ] Filters apply correctly
- [ ] Can clear filters

### Test Case 2.11: Order Tracking
- [ ] Open an order with tracking
- [ ] "Track Order" button visible
- [ ] Tap "Track Order"
- [ ] Map screen opens
- [ ] Shows current location (if available)
- [ ] Shows estimated delivery
- [ ] Back button works

### Test Case 2.12: Reorder
- [ ] From order history, tap order
- [ ] "Reorder" button visible
- [ ] Tap "Reorder"
- [ ] Items added to cart
- [ ] Success message shown
- [ ] Cart updated with items

### Test Case 2.13: Cancel Order
- [ ] Open a Pending order
- [ ] "Cancel Order" button visible
- [ ] Tap "Cancel Order"
- [ ] Confirmation dialog appears
- [ ] Enter cancellation reason
- [ ] Confirm cancellation
- [ ] Order status changes to "Cancelled"

### Test Case 2.14: Search History
- [ ] Search for medicines
- [ ] Recent searches saved
- [ ] Can tap recent search to search again
- [ ] Can clear search history

### Test Case 2.15: Profile View (Retailer)
- [ ] Tap profile icon (top-right)
- [ ] Profile screen opens
- [ ] Shows user information (read-only):
  - [ ] Email
  - [ ] Display name (greyed out)
  - [ ] Shop name (greyed out)
  - [ ] Phone number (greyed out)
  - [ ] Address (greyed out)
- [ ] Info text: "Profile managed by admin"
- [ ] Password change section visible
- [ ] Can enter current password
- [ ] Can enter new password
- [ ] Can confirm new password
- [ ] "Change Password" button works
- [ ] Password updated successfully

---

## 👨‍💼 3. ADMIN FEATURES

### Test Case 3.1: Admin Mode Toggle
- [ ] Login as admin user
- [ ] Shield icon visible in header (top-right)
- [ ] Shield icon is grey/outline
- [ ] Tap shield icon
- [ ] Shield turns green (filled)
- [ ] Bottom tabs change to admin tabs
- [ ] New tabs appear:
  - [ ] Orders (all orders)
  - [ ] Users
  - [ ] Products
  - [ ] Accounting

### Test Case 3.2: Admin Orders Screen
- [ ] Tap "Orders" tab (admin mode)
- [ ] All orders from all retailers shown
- [ ] Shows order count in header
- [ ] Each order shows:
  - [ ] Order ID
  - [ ] Retailer email
  - [ ] Order date
  - [ ] Total amount
  - [ ] Status
- [ ] Can tap on order for details
- [ ] Order details show medicines list

### Test Case 3.3: Update Order Status
- [ ] Open an order
- [ ] Status dropdown/buttons visible
- [ ] Can change status:
  - [ ] Pending → Dispatched
  - [ ] Dispatched → Delivered
- [ ] Status updates successfully
- [ ] Confirmation message shown
- [ ] Order list refreshes

### Test Case 3.4: Order Date Filters
- [ ] Date filter buttons visible:
  - [ ] All
  - [ ] Today
  - [ ] This Week
  - [ ] This Month
  - [ ] Custom
- [ ] Tap "Today"
- [ ] Only today's orders shown
- [ ] Tap "This Week"
- [ ] Last 7 days orders shown
- [ ] Tap "This Month"
- [ ] Current month orders shown
- [ ] Tap "Custom"
- [ ] Date picker appears
- [ ] Select start date
- [ ] Select end date
- [ ] Orders between dates shown

### Test Case 3.5: Export Orders to Excel
- [ ] Tap export icon (📥)
- [ ] Export modal opens
- [ ] Shows order count and date range
- [ ] Tap "Excel Format"
- [ ] File generates
- [ ] Share dialog opens
- [ ] Can save to Files/Drive
- [ ] Excel file downloads
- [ ] Open Excel file
- [ ] All order data present:
  - [ ] Sr No, Order ID, Date
  - [ ] Retailer email
  - [ ] Status, Items, Amount
  - [ ] Medicines list
- [ ] Summary row at bottom

### Test Case 3.6: Export Orders to PDF
- [ ] Tap export icon (📥)
- [ ] Tap "PDF Format"
- [ ] PDF generates
- [ ] Share dialog opens
- [ ] Can save/print PDF
- [ ] PDF contains:
  - [ ] Company header (SimpliPharma)
  - [ ] Date range
  - [ ] Summary statistics
  - [ ] Detailed orders table
  - [ ] Color-coded status
  - [ ] Professional layout

### Test Case 3.7: User Management Screen
- [ ] Tap "Users" tab (admin mode)
- [ ] All users listed
- [ ] Each user shows:
  - [ ] Email
  - [ ] Display name
  - [ ] Shop name
  - [ ] Phone number
  - [ ] Admin badge (if admin)
- [ ] "Create User" button visible

### Test Case 3.8: Create New User
- [ ] Tap "Create User" button
- [ ] Modal opens with form
- [ ] Fill in all fields:
  - [ ] Email
  - [ ] Password
  - [ ] Display name
  - [ ] Shop name
  - [ ] Phone number
  - [ ] Address
  - [ ] Admin toggle switch
- [ ] Tap "Create User"
- [ ] User created successfully
- [ ] User appears in list
- [ ] Can login with new credentials

### Test Case 3.9: Edit User Profile
- [ ] Tap on a user card
- [ ] Edit modal opens
- [ ] All fields pre-filled
- [ ] Can modify:
  - [ ] Display name
  - [ ] Shop name
  - [ ] Phone
  - [ ] Address
  - [ ] Admin role (toggle)
- [ ] Tap "Update"
- [ ] Profile updated successfully
- [ ] Changes reflected immediately

### Test Case 3.10: Product Management Screen
- [ ] Tap "Products" tab (admin mode)
- [ ] All medicines listed
- [ ] Each product shows details
- [ ] "Add Product" button visible
- [ ] Export (📥) and Import (📤) icons visible

### Test Case 3.11: Add New Product
- [ ] Tap "Add Product"
- [ ] Modal with form opens
- [ ] Fill in all fields:
  - [ ] Name
  - [ ] Category
  - [ ] Price
  - [ ] Stock
  - [ ] Manufacturer
  - [ ] Description
  - [ ] Dosage
  - [ ] Composition
  - [ ] Side effects
  - [ ] Image URL
- [ ] Tap "Add Product"
- [ ] Product added successfully
- [ ] Appears in product list
- [ ] Visible to retailers

### Test Case 3.12: Edit Product
- [ ] Tap on a product card
- [ ] Edit modal opens
- [ ] All fields editable
- [ ] Modify any field
- [ ] Tap "Update"
- [ ] Product updated successfully
- [ ] Changes visible immediately

### Test Case 3.13: Delete Product
- [ ] Tap on a product
- [ ] "Delete" button visible
- [ ] Tap "Delete"
- [ ] Confirmation dialog
- [ ] Confirm deletion
- [ ] Product removed from list
- [ ] Not visible to retailers

### Test Case 3.14: Export Inventory to Excel
- [ ] Tap export icon (📥)
- [ ] Confirmation dialog
- [ ] Tap "Export"
- [ ] Excel generates
- [ ] Share dialog opens
- [ ] Save Excel file
- [ ] Open file
- [ ] All product data present:
  - [ ] ID, Name, Category
  - [ ] Price, Stock, Manufacturer
  - [ ] Description, Dosage, etc.
- [ ] Proper column formatting

### Test Case 3.15: Import Inventory from Excel
- [ ] Create/modify Excel file with products
- [ ] Tap import icon (📤)
- [ ] File picker opens
- [ ] Select Excel file
- [ ] File uploads
- [ ] Processing message shown
- [ ] Success summary displayed:
  - [ ] Products added
  - [ ] Products updated
  - [ ] Rows skipped
- [ ] Inventory updated correctly

### Test Case 3.16: Accounting Dashboard
- [ ] Tap "Accounting" tab (admin mode)
- [ ] Financial dashboard loads
- [ ] Summary cards show:
  - [ ] Total Revenue
  - [ ] Total Collected
  - [ ] Outstanding Amount
- [ ] Payment status breakdown:
  - [ ] Paid orders count
  - [ ] Partial payment count
  - [ ] Unpaid orders count
- [ ] Outstanding payments section visible
- [ ] Retailer accounts section visible

### Test Case 3.17: Collect Payment
- [ ] Find order with outstanding payment
- [ ] Tap "Collect" button
- [ ] Payment modal opens
- [ ] Shows:
  - [ ] Order ID
  - [ ] Total amount
  - [ ] Already paid
  - [ ] Due amount
- [ ] Enter payment amount
- [ ] Select payment method:
  - [ ] Cash
  - [ ] Card
  - [ ] UPI
  - [ ] Bank Transfer
  - [ ] Cheque
- [ ] Add notes (optional)
- [ ] Tap "Record Payment"
- [ ] Payment recorded successfully
- [ ] Order payment status updates
- [ ] Due amount decreases

### Test Case 3.18: Payment History
- [ ] Tap "History" button on order
- [ ] Payment history modal opens
- [ ] All payments for order shown
- [ ] Each payment shows:
  - [ ] Amount
  - [ ] Payment method
  - [ ] Date and time
  - [ ] Notes
  - [ ] Checkmark icon
- [ ] Can close modal

### Test Case 3.19: Retailer Account Statement
- [ ] Scroll to "Retailer Accounts"
- [ ] Tap on a retailer card
- [ ] Full statement screen opens
- [ ] Shows:
  - [ ] Retailer name and email
  - [ ] Total ordered amount
  - [ ] Total paid amount
  - [ ] Outstanding dues
- [ ] Order history section shows all orders
- [ ] Each order shows payment status
- [ ] Can scroll through orders
- [ ] Back button works

### Test Case 3.20: Export Accounting Ledger
- [ ] Tap export icon (📥) in accounting
- [ ] Confirmation dialog
- [ ] Tap "Export"
- [ ] Excel generates
- [ ] Save file
- [ ] Open ledger Excel
- [ ] Contains:
  - [ ] All orders with payment details
  - [ ] Order amount, paid, due
  - [ ] Payment status
  - [ ] Summary totals row
- [ ] Data accurate

### Test Case 3.21: Toggle Back to User Mode
- [ ] In admin mode, tap shield icon
- [ ] Shield turns grey (outline)
- [ ] Tabs change back to retailer tabs
- [ ] Can browse as regular user
- [ ] Tap shield again
- [ ] Back to admin mode

---

## 🔔 4. NOTIFICATIONS

### Test Case 4.1: Push Notification Setup
- [ ] App requests notification permission
- [ ] Can allow or deny
- [ ] Permission saved

### Test Case 4.2: Order Status Notifications
- [ ] Place an order (as retailer)
- [ ] Admin updates order status
- [ ] Notification received on retailer device
- [ ] Notification shows order update
- [ ] Tap notification
- [ ] Opens order details

---

## 📤 5. DATA EXPORT FEATURES

### Test Case 5.1: Excel Export Quality
- [ ] Export any Excel file
- [ ] Open in Microsoft Excel
- [ ] Open in Google Sheets
- [ ] Data readable
- [ ] Columns properly formatted
- [ ] No corrupted data

### Test Case 5.2: PDF Export Quality
- [ ] Export any PDF
- [ ] Open on device
- [ ] Print PDF
- [ ] Professional appearance
- [ ] All data visible
- [ ] Colors display correctly

---

## 🗺️ 6. MAPS & TRACKING

### Test Case 6.1: Location Permission
- [ ] App requests location permission
- [ ] Can allow or deny
- [ ] Permission saves

### Test Case 6.2: Order Tracking Map
- [ ] Open order with tracking
- [ ] Map loads
- [ ] Shows markers
- [ ] Can zoom in/out
- [ ] Can pan map
- [ ] Location updates (if available)

---

## 🎨 7. UI/UX TESTING

### Test Case 7.1: Visual Consistency
- [ ] All screens follow same design
- [ ] Colors consistent throughout
- [ ] Fonts consistent
- [ ] Button styles consistent
- [ ] Icons appropriate

### Test Case 7.2: Responsiveness
- [ ] All screens fit properly
- [ ] No text cutoff
- [ ] No overlapping elements
- [ ] Scrolling smooth
- [ ] Proper spacing

### Test Case 7.3: Loading States
- [ ] Loading indicators shown when fetching data
- [ ] Spinners appropriate
- [ ] User knows app is working
- [ ] No frozen screens

### Test Case 7.4: Error Handling
- [ ] Error messages clear and helpful
- [ ] No app crashes
- [ ] Can recover from errors
- [ ] Network errors handled

### Test Case 7.5: Navigation
- [ ] Bottom tabs work correctly
- [ ] Back buttons work
- [ ] Navigation logical
- [ ] No navigation dead ends

---

## 📱 8. PLATFORM-SPECIFIC TESTING

### Test Case 8.1: Android Specific
- [ ] Back button behavior correct
- [ ] Hardware back button works
- [ ] Notifications appear correctly
- [ ] Share functionality works
- [ ] File downloads work

### Test Case 8.2: iOS Specific
- [ ] Swipe gestures work
- [ ] iOS navigation correct
- [ ] Notifications appear correctly
- [ ] Share sheet works
- [ ] File saving works

---

## 🔒 9. SECURITY TESTING

### Test Case 9.1: Authentication Security
- [ ] Cannot access app without login
- [ ] Session expires appropriately
- [ ] Password hidden when typing
- [ ] Logout works completely

### Test Case 9.2: Role-Based Access
- [ ] Retailers cannot access admin features
- [ ] Admin features hidden for retailers
- [ ] Shield icon only visible for admins
- [ ] Cannot bypass role restrictions

### Test Case 9.3: Data Security
- [ ] User data private
- [ ] Cannot see other users' orders (retailer)
- [ ] Admin can see all data (appropriate)
- [ ] Payment data secure

---

## 🔄 10. INTEGRATION TESTING

### Test Case 10.1: Firebase Integration
- [ ] Data saves to Firestore
- [ ] Data loads from Firestore
- [ ] Real-time updates work
- [ ] Authentication works
- [ ] No data loss

### Test Case 10.2: Offline Functionality
- [ ] Turn off internet
- [ ] App shows cached data
- [ ] Can browse previously loaded data
- [ ] Appropriate offline message
- [ ] Turn on internet
- [ ] Data syncs

---

## 📊 11. PERFORMANCE TESTING

### Test Case 11.1: Load Times
- [ ] App launches quickly (<3 seconds)
- [ ] Screens load quickly
- [ ] Images load appropriately
- [ ] No long wait times

### Test Case 11.2: Memory Usage
- [ ] App doesn't consume excessive memory
- [ ] No memory leaks
- [ ] Scrolling smooth
- [ ] No lag

### Test Case 11.3: Battery Usage
- [ ] Reasonable battery consumption
- [ ] Not draining battery quickly
- [ ] Background usage appropriate

---

## 🎯 12. CRITICAL USER FLOWS

### Test Case 12.1: Complete Purchase Flow
1. [ ] Login as retailer
2. [ ] Search for medicine
3. [ ] Add to cart
4. [ ] Go to cart
5. [ ] Proceed to checkout
6. [ ] Confirm delivery address
7. [ ] Place order
8. [ ] View in orders
9. [ ] Admin updates status
10. [ ] Check order tracking
11. [ ] Order delivered
12. [ ] Payment collected
**Result:** [ ] PASS / [ ] FAIL

### Test Case 12.2: Complete Admin Flow
1. [ ] Login as admin
2. [ ] Toggle admin mode
3. [ ] View all orders
4. [ ] Update order status
5. [ ] Export orders to Excel
6. [ ] Go to Users tab
7. [ ] Create new user
8. [ ] Go to Products tab
9. [ ] Add new product
10. [ ] Export inventory
11. [ ] Go to Accounting
12. [ ] Collect payment
13. [ ] View ledger
**Result:** [ ] PASS / [ ] FAIL

---

## 🐛 13. BUG TRACKING

### Found Bugs:

| # | Feature | Issue | Severity | Status |
|---|---------|-------|----------|--------|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

**Severity Levels:**
- **Critical:** App crashes or major feature broken
- **High:** Feature doesn't work correctly
- **Medium:** Minor issue, workaround available
- **Low:** Cosmetic issue

---

## ✅ 14. FINAL CHECKS

### Pre-Release Checklist:
- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] App stable (no crashes)
- [ ] Performance acceptable
- [ ] UI/UX polished
- [ ] All major features working
- [ ] Both platforms tested
- [ ] Test with real data
- [ ] Test with multiple users
- [ ] Firebase properly configured
- [ ] All documentation updated

---

## 📝 15. TEST SUMMARY

### Test Statistics:
- **Total Test Cases:** 150+
- **Passed:** ___
- **Failed:** ___
- **Skipped:** ___
- **Pass Rate:** ___%

### Testing Team:
- **Tester Name:** _______________
- **Date Tested:** _______________
- **Platform:** Android / iOS
- **Device:** _______________
- **OS Version:** _______________

### Overall Assessment:
- [ ] **Ready for Production**
- [ ] **Needs Minor Fixes**
- [ ] **Needs Major Fixes**
- [ ] **Not Ready**

### Notes:
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🎉 Testing Complete!

**SimpliPharma is ready when all critical tests pass!**

Good luck with your testing! 🚀✨

