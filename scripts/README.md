# SimpliPharma Scripts

This folder contains utility scripts for building and managing the SimpliPharma app.

## Build Scripts

### `build-apk.bat`
Main script to build the Android APK using EAS Build.

**Usage:**
```bash
.\scripts\build-apk.bat
```

### `FINAL_BUILD_FIX.bat`
Script to fix build issues and create a clean production build.

**Usage:**
```bash
.\scripts\FINAL_BUILD_FIX.bat
```

## Debugging Scripts

### `diagnose-build.bat`
Diagnoses common build issues and provides recommendations.

**Usage:**
```bash
.\scripts\diagnose-build.bat
```

### `build-fix.bat`
Quick fix for common build errors.

**Usage:**
```bash
.\scripts\build-fix.bat
```

### `fix-build-tar-error.bat`
Specifically fixes tar-related build errors.

**Usage:**
```bash
.\scripts\fix-build-tar-error.bat
```

## Maintenance Scripts

### `clear-cache-and-rebuild.bat`
Clears all caches (npm, expo, eas) and rebuilds the project from scratch.

**Usage:**
```bash
.\scripts\clear-cache-and-rebuild.bat
```

### `MOVE_OUT_OF_ONEDRIVE.bat`
Moves the project out of OneDrive to avoid sync-related build issues.

**Usage:**
```bash
.\scripts\MOVE_OUT_OF_ONEDRIVE.bat
```

---

## Notes

- All scripts are designed for Windows environments
- Run scripts from the project root directory: `.\scripts\<script-name>.bat`
- Make sure you have EAS CLI installed: `npm install -g eas-cli`
- Login to Expo before running build scripts: `eas login`

## Common Workflow

1. **First time setup:**
   ```bash
   npm install
   eas login
   ```

2. **Clean build:**
   ```bash
   .\scripts\clear-cache-and-rebuild.bat
   ```

3. **Build APK:**
   ```bash
   .\scripts\build-apk.bat
   ```

4. **If build fails:**
   ```bash
   .\scripts\diagnose-build.bat
   .\scripts\build-fix.bat
   ```

