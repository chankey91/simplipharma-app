# Firebase Configuration Setup

## Environment Variables

Create a `.env` file in the root directory (optional) or directly update `src/api/firebase.ts`.

### Required Firebase Configuration Values:

```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
FIREBASE_APP_ID=your_app_id_here
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Click on the Web icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the configuration object
6. Update `src/api/firebase.ts` with your values

## Firebase Services to Enable

### 1. Authentication
- Go to Authentication > Sign-in method
- Enable "Email/Password" provider
- Click Save

### 2. Firestore Database
- Go to Firestore Database
- Click "Create database"
- Choose "Start in test mode" for development
- Select a location
- Click Enable

### 3. Sample Data for Testing

#### Medicines Collection

Add sample documents to the `medicines` collection:

**Document 1:**
```json
{
  "name": "Paracetamol 500mg",
  "category": "Pain Relief",
  "price": 50,
  "stock": 100,
  "manufacturer": "ABC Pharma"
}
```

**Document 2:**
```json
{
  "name": "Ibuprofen 400mg",
  "category": "Pain Relief",
  "price": 75,
  "stock": 50,
  "manufacturer": "XYZ Pharma"
}
```

**Document 3:**
```json
{
  "name": "Amoxicillin 250mg",
  "category": "Antibiotics",
  "price": 120,
  "stock": 80,
  "manufacturer": "MediCare Ltd"
}
```

**Document 4:**
```json
{
  "name": "Cetirizine 10mg",
  "category": "Allergy",
  "price": 30,
  "stock": 150,
  "manufacturer": "HealthPlus"
}
```

**Document 5:**
```json
{
  "name": "Omeprazole 20mg",
  "category": "Digestive",
  "price": 90,
  "stock": 60,
  "manufacturer": "WellCare Pharma"
}
```

## Firestore Security Rules

Update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Medicines - read only for authenticated users
    match /medicines/{medicineId} {
      allow read: if request.auth != null;
      allow write: if false; // Managed via Firebase Console
    }
    
    // Orders - users can read their own and create new ones
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.retailerId;
      allow update: if request.auth != null;
    }
    
    // Users - users can read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Favorites - users can manage their own favorites
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Test Accounts

Create test accounts using the app's registration feature:

- Retailer: `retailer@test.com` / `password123`
- Admin: Use any account and toggle admin mode in the app

