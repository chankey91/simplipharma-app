# 🔒 Admin Access Control

## Overview

The SimpliPharma app now has **role-based access control**. Only users with the `admin` role can see and access the admin panel. Regular retailers cannot see the admin toggle.

---

## 🎯 Key Features

### ✅ Role-Based Access
- **Admin users**: See shield icon, can toggle admin mode
- **Retailer users**: No admin toggle, only see their own features
- Role is stored in Firestore `users` collection

### ✅ Automatic Detection
- On login, app checks user's role from Firestore
- Admin status is cached during the session
- Refreshes on logout/login

### ✅ Visual Indicators
- Admin users have a **green ADMIN badge** in user management
- Admin users have a **shield icon** instead of person icon
- Clear visual distinction between user types

---

## 🚀 How to Set Up Admin Users

### **Step 1: Create Your First Admin Account**

#### Option A: Firebase Console (Recommended)
1. Go to **Firebase Console** → **Authentication**
2. Click **"Add User"**
3. Create admin account: `admin@simplipharma.com` (or your email)
4. Set a password

#### Option B: Use Existing Account
- If you already have an account, skip to Step 2

### **Step 2: Set Admin Role in Firestore**

Since your first admin doesn't exist yet, manually set the role:

1. Go to **Firebase Console** → **Firestore Database**
2. Find or create the `users` collection
3. Create a document with ID = your admin's UID:
   ```
   users/{admin-user-uid}
   ├─ email: "admin@simplipharma.com"
   ├─ role: "admin"  ← Important!
   ├─ displayName: "Admin User"
   └─ createdAt: [current timestamp]
   ```

**How to find UID:**
- Go to **Firebase Console** → **Authentication**
- Find your admin user
- Copy the **User UID** from the table

### **Step 3: Login and Test**

1. Open the app
2. Login with admin credentials
3. You should see the **shield icon** in the header
4. Tap it to toggle Admin Mode
5. You'll see **Orders** and **Users** tabs

---

## 👥 Creating Additional Users

Once you're logged in as admin:

### **Create Retailer Account:**
1. Toggle **Admin Mode** (shield icon)
2. Go to **Users** tab
3. Tap the green **+** button
4. Fill in user details
5. **Leave "Admin Access" toggle OFF** for retailers
6. Tap **"Create User"**

### **Create Another Admin:**
1. Follow same steps as above
2. **Turn ON the "Admin Access" toggle**
3. Tap **"Create User"**
4. The new user will have admin privileges

---

## 🔧 Technical Implementation

### Firestore Structure

```javascript
users/{userId}
{
  email: "user@example.com",
  displayName: "John Doe",
  shopName: "Doe Pharmacy",
  phoneNumber: "+1234567890",
  address: "123 Main St",
  role: "admin" | "retailer",  // ← Determines access
  createdAt: Timestamp
}
```

### Admin Check Function

```typescript
// src/api/firebase.ts
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
```

### App.tsx Implementation

```typescript
// Check admin status on login
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setUser(user);
    
    if (user) {
      const adminStatus = await isUserAdmin(user.uid);
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
    
    setLoading(false);
  });

  return unsubscribe;
}, []);

// Conditionally show admin toggle
{isAdmin && (
  <TouchableOpacity onPress={() => setIsAdminMode(!isAdminMode)}>
    <Ionicons name="shield" />
  </TouchableOpacity>
)}
```

---

## 🎨 Visual Features

### Admin User Card
- **Green shield icon** instead of person icon
- **"ADMIN" badge** next to name
- Clear visual indicator of admin status

### Retailer User Card
- **Blue person icon**
- No special badge
- Standard user display

### Admin Toggle
- **Only visible to admins**
- Green when active
- Grey when inactive
- Retailers never see this button

---

## 🔒 Security Considerations

### Current Implementation (Client-Side)
- ✅ Admin toggle is hidden from non-admins
- ✅ Role is checked on login
- ⚠️ Client-side checks can be bypassed by skilled users

### Recommended Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Medicines - Read by all, write by admin only
    match /medicines/{medicineId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Orders - Users can read their own, admins can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (resource.data.retailerId == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin(); // Only admins can update status
    }
    
    // User Profiles - Users can read their own, admins can manage all
    match /users/{userId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin(); // Only admins can create/update users
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

### Production Recommendation
For production apps:
1. Use **Firebase Admin SDK** on a backend server
2. Implement **Cloud Functions** for sensitive operations
3. Add **custom claims** to Firebase Auth tokens
4. Validate all operations server-side

Example with custom claims:
```typescript
// Set admin claim (Cloud Function)
admin.auth().setCustomUserClaims(uid, { admin: true });

// Check in security rules
allow read: if request.auth.token.admin == true;
```

---

## 📋 Admin Checklist

### Initial Setup
- [ ] Create first admin account in Firebase Console
- [ ] Set `role: "admin"` in Firestore users collection
- [ ] Login and verify shield icon appears
- [ ] Test toggling admin mode
- [ ] Verify you can see Users tab

### Creating Users
- [ ] Create test retailer account (admin toggle OFF)
- [ ] Logout and login as retailer
- [ ] Verify NO shield icon for retailer
- [ ] Verify retailer can only see their features
- [ ] Login back as admin

### User Management
- [ ] Test editing user profiles
- [ ] Test toggling admin access for users
- [ ] Verify admin badges display correctly
- [ ] Test creating another admin user

### Security
- [ ] Update Firestore security rules
- [ ] Test that retailers can't access admin features
- [ ] Verify role-based access works
- [ ] Document admin credentials securely

---

## 🆘 Troubleshooting

### "I don't see the shield icon"
**Solution:**
1. Check Firestore: Does your user document have `role: "admin"`?
2. Check console logs: What is the admin status on login?
3. Try logging out and back in
4. Verify UID matches the document ID in Firestore

### "Created an admin but they can't access admin panel"
**Solution:**
1. Check the `role` field in their Firestore document
2. Make sure it's exactly `"admin"` (lowercase, no typos)
3. Have them logout and login again
4. Check console logs for admin status

### "How do I find my UID?"
**Solution:**
1. **Firebase Console** → **Authentication** → Find your user → Copy UID
2. OR in app console: `console.log(auth.currentUser.uid)`

### "Accidentally made everyone admin"
**Solution:**
1. Go to Firestore → `users` collection
2. For each user that should be retailer:
   - Edit document
   - Change `role: "admin"` to `role: "retailer"`
3. Have them logout and login

---

## 🔄 Updating Existing Users

If you already have users without the `role` field:

### Option 1: Manually in Firestore
1. Go to Firestore → `users` collection
2. For each user document:
   - Add field: `role`
   - Value: `"admin"` or `"retailer"`
3. Have users logout/login

### Option 2: One-Time Script
Use Firebase Admin SDK or Cloud Function:
```typescript
// One-time migration (Cloud Function or script)
const usersSnapshot = await admin.firestore().collection('users').get();

usersSnapshot.forEach(async (doc) => {
  // Set default role to retailer
  await doc.ref.update({ 
    role: 'retailer'  // or check email to set admin
  });
});

// Manually set specific users as admin
await admin.firestore().collection('users').doc('specific-uid').update({
  role: 'admin'
});
```

---

## 📖 Related Documentation

- **ADMIN_USER_MANAGEMENT.md** - How to create and manage users
- **FIREBASE_SETUP.md** - Initial Firebase configuration
- **IMPORTANT_NOTE.txt** - Logout limitation when creating users

---

## 🎉 Summary

✅ **Role-based access control** implemented  
✅ **Only admins** see the admin panel toggle  
✅ **Visual indicators** for admin users  
✅ **Toggle switch** to set admin access when creating/editing users  
✅ **Security rules** recommended for production  

Your app now has proper admin access control! 🔐

