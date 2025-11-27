# 🔧 Android Build Troubleshooting Guide

## Common Build Issues & Solutions

### Issue 1: "Input is required but stdin is not readable"

**Problem:** EAS Build commands need interactive input

**Solution:**
Open a **NEW Command Prompt** window (separate from Metro bundler) and run:

```bash
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
eas login
eas build -p android --profile preview
```

---

### Issue 2: Not Logged Into Expo Account

**Error:**
```
An Expo user account is required to proceed.
```

**Solution:**

#### Option A: Login
```bash
eas login
# Enter your Expo email/username and password
```

#### Option B: Create Account
```bash
eas register
# Follow prompts to create account
```

---

### Issue 3: No Project ID

**Error:**
```
No project ID found
```

**Solution:**

1. **Login first:**
   ```bash
   eas login
   ```

2. **Configure project interactively:**
   - Open NEW terminal
   - Run: `eas build:configure`
   - Select: `Android`
   - It will create project ID automatically

3. **Or manually add to app.json:**
   ```json
   {
     "expo": {
       ...
       "extra": {
         "eas": {
           "projectId": "your-project-id-here"
         }
       }
     }
   }
   ```

---

### Issue 4: Build Fails During Compilation

**Common Causes:**

#### A. Package Version Conflicts

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rmdir /s /q node_modules

# Reinstall
npm install

# Try build again
eas build -p android --profile preview
```

#### B. Missing Dependencies

**Solution:**
```bash
# Install all Expo dependencies properly
npx expo install --fix

# Then build
eas build -p android --profile preview
```

---

### Issue 5: "Invalid credentials"

**Solution:**
```bash
# Clear credentials
eas credentials:clear -p android

# Build again (will prompt for new credentials)
eas build -p android --profile preview
```

---

### Issue 6: Build Stuck or Taking Too Long

**Solutions:**

1. **Check Build Status:**
   ```bash
   eas build:list
   ```

2. **View Build Details:**
   ```bash
   eas build:view [BUILD_ID]
   ```

3. **Cancel and Retry:**
   ```bash
   eas build:cancel [BUILD_ID]
   eas build -p android --profile preview
   ```

---

## ✅ Step-by-Step Build Process (Working Method)

### Step 1: Ensure Metro is Running
Keep your current terminal with `npx expo start` running.

### Step 2: Open NEW Terminal
- Press `Win + R`
- Type: `cmd`
- Press Enter

### Step 3: Navigate to Project
```bash
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
```

### Step 4: Login to Expo
```bash
eas login
```

Enter your credentials:
- Email or Username
- Password

If no account, run:
```bash
eas register
```

### Step 5: Build APK
```bash
eas build -p android --profile preview
```

### Step 6: Wait for Build
- Build uploads to cloud (~1-2 mins)
- Compilation happens remotely (~8-12 mins)
- You'll get a download link

### Step 7: Download APK
- Click the link provided
- Or visit: https://expo.dev/accounts/[your-account]/projects/simplipharma/builds
- Download the `.apk` file

---

## 🚨 Alternative Methods

### Method 1: Using Batch Script

```bash
# In NEW terminal
cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
build-apk.bat
```

This script will:
1. Check EAS CLI
2. Prompt for login
3. Start build
4. Show progress

### Method 2: Local Build (No Cloud)

**Requirements:**
- Android Studio
- Android SDK
- JDK 17

**Steps:**
```bash
# Install Android Studio first
# Then run:
npx expo prebuild --platform android
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### Method 3: Expo Development Build

```bash
# Create development build
eas build --profile development --platform android

# This creates a development client APK
```

---

## 🔍 Checking Build Configuration

### Check eas.json:
```bash
type eas.json
```

Should contain:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Check app.json:
```bash
type app.json
```

Should have:
```json
{
  "expo": {
    "android": {
      "package": "com.simplipharma.app",
      "versionCode": 1
    }
  }
}
```

---

## 📱 Test Current Setup

### Test 1: Check EAS CLI
```bash
eas --version
```

Should show version number. If not:
```bash
npm install -g eas-cli
```

### Test 2: Check Login Status
```bash
eas whoami
```

Shows your username if logged in. If not:
```bash
eas login
```

### Test 3: Check Project
```bash
eas project:info
```

Shows project details. If error, need to configure.

---

## 🎯 Most Common Issue: Interactive Terminal Needed

### The Problem:
EAS commands need user input, but can't get it from background terminals.

### The Fix:
**ALWAYS use a NEW, separate Command Prompt for EAS commands!**

```
Terminal 1 (KEEP RUNNING):
> npx expo start
[Metro bundler running...]

Terminal 2 (NEW - For Build):
> cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp
> eas login
[Enter credentials]
> eas build -p android --profile preview
[Build starts...]
```

---

## 💡 Quick Fixes

### Fix 1: Permission Denied
```bash
# Run as Administrator
# Right-click Command Prompt > Run as Administrator
```

### Fix 2: Network Issues
```bash
# Check internet connection
# Disable VPN if using
# Try different network
```

### Fix 3: Expo Account Issues
```bash
# Create new account
eas register

# Or reset password at:
# https://expo.dev/forgot-password
```

### Fix 4: Package Name Conflict
```bash
# Change package name in app.json:
"package": "com.yourname.simplipharma"

# Then rebuild
```

---

## 📋 Pre-Build Checklist

Before running build, ensure:

- [ ] Expo account created
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into Expo (`eas login`)
- [ ] Internet connection stable
- [ ] Using NEW terminal (not Metro terminal)
- [ ] In correct directory
- [ ] package.json has all dependencies
- [ ] app.json configured correctly
- [ ] eas.json exists

---

## 🔧 Debug Commands

### View Build Logs:
```bash
eas build:list
eas build:view [BUILD_ID]
```

### Cancel Build:
```bash
eas build:cancel [BUILD_ID]
```

### Clear Credentials:
```bash
eas credentials
```

### Project Status:
```bash
eas project:info
```

---

## 📞 Getting Help

### View Build on Dashboard:
Visit: https://expo.dev/accounts/[your-username]/projects/simplipharma/builds

### Check Build Logs:
Click on build → View logs → See detailed error

### Common Error Messages:

#### "EACCES: permission denied"
- Run as administrator
- Check file permissions

#### "Network request failed"
- Check internet connection
- Try again later
- Check firewall

#### "Invalid project"
- Run `eas build:configure`
- Check app.json configuration

---

## ✅ Verified Working Steps

1. **Keep Metro running** in original terminal
2. **Open NEW Command Prompt**
3. **Navigate:** `cd C:\Users\Chetan\OneDrive\Desktop\WEP\MedicineSupplyApp`
4. **Login:** `eas login`
5. **Build:** `eas build -p android --profile preview`
6. **Wait:** ~10-15 minutes
7. **Download:** Click link in terminal
8. **Install:** Transfer APK to phone and install

---

## 🎉 Success Indicators

When build is successful, you'll see:
```
✔ Build finished
🚀 Artifact URL: https://expo.dev/artifacts/eas/...
```

Download the APK from that URL!

---

## 📱 After Successful Build

1. **Download APK** from link
2. **Transfer to phone** (USB/Email/Drive)
3. **Install on phone**:
   - Tap APK file
   - Allow "Install from Unknown Sources"
   - Tap "Install"
   - Open SimpliPharma app
4. **Test all features!**

---

## 🔄 If Still Failing

Share the specific error message you're getting:

1. Run build command in NEW terminal
2. Copy the complete error message
3. Check which of these errors it matches:
   - Login/Authentication error
   - Network error
   - Configuration error
   - Build/Compilation error
   - Upload error

Then follow the specific solution above!

---

**Remember:** Always use a NEW terminal for EAS commands, separate from Metro bundler! 🎯

