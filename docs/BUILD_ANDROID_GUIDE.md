# 📱 Build Android APK - Step by Step Guide

## Method 1: EAS Build (Recommended - Cloud Build)

### Step 1: Login to Expo Account

Open a **new terminal/command prompt** and run:

```bash
eas login
```

**If you don't have an Expo account:**
```bash
eas register
```

Follow the prompts to:
- Enter email
- Create password
- Verify email

### Step 2: Configure Project

```bash
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
eas build:configure
```

This will:
- Create/update `eas.json` ✓ (Already created)
- Link your project to EAS
- Generate a project ID

### Step 3: Build APK

```bash
eas build -p android --profile preview
```

**This will:**
- Upload your code to Expo servers
- Build the APK in the cloud
- Takes ~10-15 minutes
- Gives you a download link

### Step 4: Download APK

Once build completes:
- You'll get a download URL
- Download the `.apk` file
- Install on any Android device!

---

## Method 2: Local Build (Without Expo Account)

### Option A: Using Expo's Local Build

1. **Install Android Studio** (if not already installed)
   - Download from: https://developer.android.com/studio
   - Install Android SDK
   - Setup environment variables

2. **Generate Android Project**
   ```bash
   npx expo prebuild --platform android
   ```

3. **Build APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **APK Location**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Option B: Using Expo Export + APK Tool

This creates a smaller build without native code compilation:

1. **Export Web Bundle**
   ```bash
   npx expo export --platform android
   ```

2. **Use Online APK Builder**
   - Go to: https://appmaker.xyz/apk-builder
   - Upload your exported bundle
   - Generate APK

---

## Method 3: Quick APK (Simplest - No Login Required)

### Using EAS Local Build:

```bash
# Install dependencies
npm install -g @expo/ngrok

# Create local build
npx eas build --platform android --local
```

**Requirements:**
- Docker Desktop (for Windows)
- OR Android Studio + SDK

---

## 🎯 Recommended Approach for You

Since you're testing, here's the **FASTEST** way:

### Quick Method - Direct APK:

**Step 1: Open New Terminal**

**Step 2: Login to Expo**
```bash
eas login
```
- Enter your email/username
- Enter password
- (Or create account with `eas register`)

**Step 3: Build**
```bash
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
eas build -p android --profile preview
```

**Step 4: Wait (~10 mins)**
- Build happens in cloud
- No Android Studio needed
- No setup required

**Step 5: Download**
- Terminal shows: "Build finished: https://expo.dev/artifacts/..."
- Click link
- Download `.apk`
- Install on phone!

---

## 📦 What Each Method Produces

### EAS Build (Method 1):
```
✓ Standalone APK
✓ Works on any Android phone
✓ No Expo Go needed
✓ Professional build
✓ ~40-50 MB file size
```

### Local Build (Method 2):
```
✓ Full native build
✓ More control
✓ Larger file size
✓ Requires Android Studio
✓ ~60-80 MB file size
```

### Quick Export (Method 3):
```
✓ Fastest
✓ Smaller size
✓ Limited native features
✓ ~20-30 MB
```

---

## 🚀 Start Building NOW

### Easiest Steps (Do this now):

1. **Open NEW Command Prompt** (keep current one running)

2. **Run:**
   ```cmd
   eas login
   ```

3. **If asked to create account:**
   - Choose a username
   - Enter email
   - Create password
   - Verify email

4. **Then run:**
   ```cmd
   cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
   eas build -p android --profile preview
   ```

5. **Wait for build** (coffee break ☕)

6. **Download APK** from link provided

7. **Install on phone!** 📱

---

## 📱 Installing APK on Phone

Once you have the `.apk` file:

### Method 1: Direct Transfer
1. Copy APK to phone via USB
2. Open file on phone
3. Tap "Install"
4. Allow installation from unknown sources (if asked)
5. Done! ✓

### Method 2: Via Link
1. Open build URL on phone browser
2. Download APK
3. Tap notification
4. Install
5. Done! ✓

### Method 3: QR Code
1. EAS provides QR code
2. Scan with phone camera
3. Download opens
4. Install
5. Done! ✓

---

## ⚠️ Common Issues

### "Installation blocked"
**Solution:** Enable "Install from Unknown Sources" in phone settings

### "App not installed"
**Solution:** Uninstall old version first (if any)

### "Parse error"
**Solution:** Download APK again, might be corrupted

### Build fails
**Solution:** Check internet connection, try again

---

## 🎯 Build Command Summary

```bash
# Login first (one time)
eas login

# Build APK (every time you want new version)
eas build -p android --profile preview

# Check build status
eas build:list

# Download specific build
eas build:download --platform android
```

---

## 📊 Build Types

### Preview Profile (Recommended for Testing):
- Creates APK file
- Easy to install
- Good for testing
- Not for Play Store

### Production Profile (For Release):
- Creates AAB file
- For Play Store upload
- Optimized size
- Signed properly

---

## ✅ Next Steps

1. Open new terminal
2. Run: `eas login`
3. Run: `eas build -p android --profile preview`
4. Wait for build
5. Download APK
6. Install on phone
7. Test all features!
8. Share APK with team!

---

**Your SimpliPharma APK will be ready in ~10-15 minutes!** 📱✨

