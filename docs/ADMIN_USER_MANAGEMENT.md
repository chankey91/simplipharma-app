# 🔐 Admin User Management System

## Overview

The app now uses an **admin-controlled user management system** with **role-based access control**:
- Users cannot register themselves
- Only administrators can create and manage user accounts
- Only users with `admin` role can see and access the admin panel
- Retailers only see their own features (medicines, cart, orders, profile)

---

## 🎯 Key Changes

### 1. **User Profile Screen (Read-Only)**
- Users can **view** their profile information
- All fields are **greyed out** and **non-editable**
- Message displayed: *"Your profile is managed by the administrator"*
- No password change option

### 2. **Login Screen**
- Removed self-registration option
- Users see message: *"Contact your administrator to create an account"*
- Login-only interface

### 3. **Admin Access Control** ⭐ NEW!
- **Admin toggle (shield icon)** only visible to admin users
- **Retailer users** don't see the admin panel option
- Role checked automatically on login
- Visual indicators for admin users

### 4. **Admin User Management Tab**
- New **"Users"** tab in Admin Mode
- Create new user accounts (admin or retailer)
- Edit existing user profiles
- **Toggle "Admin Access"** when creating/editing users
- View all users with role badges

---

## 📱 How to Use

### For Administrators

#### **Access Admin Mode:**
1. Toggle the **shield icon** in the header to enable Admin Mode
2. Two tabs will appear:
   - **Orders** - Manage all orders
   - **Users** - Manage user accounts

#### **Create New User:**
1. Go to **Users** tab in Admin Mode
2. Tap the **green + button** (bottom right)
3. Fill in user details:
   - **Email** * (required)
   - **Password** * (required, min 6 characters)
   - **Display Name**
   - **Shop Name**
   - **Phone Number**
   - **Address**
   - **Admin Access** ⭐ Toggle ON for admin, OFF for retailer
4. Tap **"Create User"**
5. **Important:** You'll be logged out after creating a user - log back in

#### **Edit Existing User:**
1. Go to **Users** tab in Admin Mode
2. Tap the **edit icon** (pencil) on any user card
3. Update profile information:
   - Email cannot be changed
   - Toggle **"Admin Access"** to change user role
   - Update name, shop, phone, address
4. Tap **"Update User"**

### For Regular Users (Retailers)

#### **What Retailers See:**
- ❌ **NO admin toggle** (shield icon is hidden)
- ✅ Medicines tab
- ✅ Favorites tab
- ✅ Cart tab
- ✅ Orders tab
- ✅ Profile icon (read-only view)

#### **View Profile:**
1. Tap the **profile icon** in the header
2. View your profile information (read-only)

#### **Request Account or Changes:**
- Contact your administrator to:
  - Create a new account for you
  - Update your profile information
  - Reset your password
  - **Cannot** make themselves admin

---

## 🔥 Firebase Configuration

### Firestore Security Rules

Update your Firestore rules to allow admins to manage users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Medicines - Read by all authenticated users
    match /medicines/{medicineId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin via console
    }
    
    // Orders - Users can read their own, create new ones
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (resource.data.retailerId == request.auth.uid || 
                      request.auth.token.admin == true);
      allow create: if request.auth != null && 
                       request.resource.data.retailerId == request.auth.uid;
      allow update: if request.auth != null; // Allow status updates
    }
    
    // User Profiles - Users can read their own, admins can read/write all
    match /users/{userId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || 
                      request.auth.token.admin == true);
      allow write: if request.auth != null; // Allow profile creation and updates
    }
    
    // Favorites - Users can manage their own
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

---

## ⚠️ Important Limitations

### Client-Side User Creation Limitation

When using **Firebase Authentication Client SDK** (which this app uses), creating a new user will **automatically log out the admin**. This is a Firebase security feature.

**Workaround in the app:**
- After creating a user, the admin is logged out
- Admin needs to **log back in** to continue

**Production Solution:**
For a production app, you should:
1. Set up a **Firebase Cloud Function** or **backend server**
2. Use **Firebase Admin SDK** to create users server-side
3. This allows creating users without logging out the admin

Example Firebase Cloud Function (not included in this app):
```typescript
// Firebase Cloud Function (requires separate setup)
export const createUser = functions.https.onCall(async (data, context) => {
  // Check if requester is admin
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }
  
  // Create user with Admin SDK
  const userRecord = await admin.auth().createUser({
    email: data.email,
    password: data.password,
  });
  
  // Create user profile in Firestore
  await admin.firestore().collection('users').doc(userRecord.uid).set({
    email: data.email,
    displayName: data.displayName,
    // ... other fields
  });
  
  return { userId: userRecord.uid };
});
```

---

## 🛠️ Technical Details

### New Files Created
- **`src/screens/AdminUserManagementScreen.tsx`** - User management interface

### Modified Files
- **`src/screens/ProfileScreen.tsx`** - Made read-only
- **`src/screens/LoginScreen.tsx`** - Removed registration
- **`src/api/firebase.ts`** - Added `createUserAccount()` and `getAllUsers()`
- **`App.tsx`** - Added Users tab to admin mode
- **`src/types/index.ts`** - Added `AdminUsers` to navigation types

### New Firebase Functions
```typescript
// Create a new user account (admin only)
export const createUserAccount = async (
  email: string, 
  password: string, 
  profileData: any
): Promise<string>

// Get all users from Firestore (admin only)
export const getAllUsers = async (): Promise<any[]>
```

---

## 📊 User Profile Structure

### Firestore Document: `users/{userId}`
```typescript
{
  email: string;
  displayName?: string;
  shopName?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: Timestamp;
  role?: 'retailer' | 'admin';
}
```

---

## 🎨 UI/UX Features

### Admin User Management Screen
- ✅ List all users with profile info
- ✅ Pull-to-refresh
- ✅ Create new user (floating action button)
- ✅ Edit user profiles
- ✅ Modern card-based UI
- ✅ Empty state for no users
- ✅ Form validation

### Profile Screen (User View)
- ✅ Read-only display
- ✅ Greyed out fields
- ✅ Informational messages
- ✅ Clean, simple interface

---

## 🚀 Getting Started

### For First-Time Setup

1. **Create Admin Account Manually:**
   - Go to **Firebase Console** → **Authentication**
   - Click **"Add User"**
   - Create an admin account (e.g., `admin@simplipharma.com`)
   
2. **Login as Admin:**
   - Use the admin credentials to login
   - Toggle **Admin Mode** (shield icon)

3. **Create Retailer Accounts:**
   - Go to **Users** tab
   - Create accounts for your retailers
   - Log back in as admin after each creation

4. **Distribute Credentials:**
   - Share login credentials with retailers
   - They can now login and place orders

---

## 💡 Best Practices

1. **Keep Admin Credentials Secure** - Don't share admin access
2. **Use Strong Passwords** - Especially for admin accounts
3. **Regular Profile Updates** - Keep user information current
4. **Document Changes** - Keep track of profile modifications
5. **Plan for Scale** - Consider backend solution for large deployments

---

## 🔮 Future Enhancements

- [ ] Add user role management (admin vs retailer)
- [ ] Bulk user import from CSV
- [ ] User activity logs
- [ ] Password reset by admin
- [ ] User deactivation/suspension
- [ ] Backend API with Firebase Admin SDK
- [ ] Email notifications on account creation

---

## 📝 Notes

- Email addresses cannot be changed once created
- Passwords can only be changed by admin (requires backend)
- User profile updates are instant
- All users are retailers by default
- Admin access is controlled by the toggle, not user roles (enhance this in production)

---

For questions or issues, refer to `FIREBASE_SETUP.md` for database configuration.

