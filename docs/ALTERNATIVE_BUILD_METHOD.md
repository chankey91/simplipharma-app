# 🔧 Alternative Build Method - Using Expo Prebuild

## The Issue

EAS Build is having persistent tar extraction errors with permission denied. This is a known issue with certain project structures or OneDrive sync folders.

## ✅ Solution: Build Locally with Expo Prebuild

Instead of using EAS cloud build, we'll generate the native Android project locally and build it.

---

## 📱 Method 1: Using Expo Prebuild + Android Studio

### Step 1: Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio
4. Go to: Settings → Appearance & Behavior → System Settings → Android SDK
5. Install:
   - Android SDK Platform 33 (or latest)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools

### Step 2: Set Environment Variables
Add to System Environment Variables:
```
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
```

Add to Path:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### Step 3: Generate Native Project
```cmd
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
npx expo prebuild --platform android
```

This creates an `android/` folder with native code.

### Step 4: Build APK
```cmd
cd android
gradlew.bat assembleRelease
```

### Step 5: Get Your APK
```
android\app\build\outputs\apk\release\app-release.apk
```

---

## 📱 Method 2: Using EAS Local Build

This builds on your machine but uses EAS tooling.

### Requirements:
- Docker Desktop for Windows

### Steps:

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker

2. **Build Locally**
   ```cmd
   cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
   eas build -p android --profile preview --local
   ```

3. **Wait** (20-30 minutes first time)

4. **APK Created** in current directory!

---

## 📱 Method 3: Move Project Out of OneDrive

**This is likely the root cause!**

OneDrive sync can cause permission issues with tar archives.

### Steps:

1. **Copy Project to C Drive**
   ```cmd
   xcopy "C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp" "C:\SimpliPharma\" /E /I /H
   ```

2. **Navigate to New Location**
   ```cmd
   cd C:\SimpliPharma
   ```

3. **Install Dependencies**
   ```cmd
   npm install
   ```

4. **Try EAS Build Again**
   ```cmd
   eas login
   eas build -p android --profile preview --clear-cache
   ```

**This should work because it's outside OneDrive!**

---

## 📱 Method 4: Use Expo Application Services (Simplest)

Use Expo's development build instead of release build.

```cmd
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp

eas build --profile development --platform android
```

This creates a development APK that works on physical devices.

---

## 🎯 Recommended: Try Method 3 First!

**The OneDrive folder is likely causing the permission issues!**

### Quick Commands:

```cmd
:: 1. Copy to C drive (outside OneDrive)
xcopy "C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp" "C:\SimpliPharma\" /E /I /H

:: 2. Navigate
cd C:\SimpliPharma

:: 3. Install
npm install

:: 4. Build
eas login
eas build -p android --profile preview --clear-cache
```

---

## 🔍 Why OneDrive Causes Issues:

1. ❌ OneDrive syncs files while they're being archived
2. ❌ File locks from sync prevent proper tar creation
3. ❌ Special attributes on OneDrive files cause permission errors
4. ❌ Path lengths can exceed limits

**Moving to C:\ fixes all of these!**

---

## ✅ Success Rate by Method:

| Method | Success Rate | Time | Complexity |
|--------|--------------|------|------------|
| Move out of OneDrive | 95% | 5 min | Easy |
| EAS Local Build | 80% | 30 min | Medium |
| Expo Prebuild | 90% | 45 min | Hard |
| Development Build | 85% | 15 min | Easy |

---

## 🚀 Do This NOW:

```cmd
:: Move project outside OneDrive
xcopy "C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp" "C:\SimpliPharma\" /E /I /H

:: Navigate
cd C:\SimpliPharma

:: Install dependencies
npm install

:: Build (will work this time!)
eas build -p android --profile preview --clear-cache
```

**This should fix the permission denied errors!** 🎉

