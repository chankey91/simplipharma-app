# 📱 SimpliPharma App Icon Setup Guide

## Quick Options to Get Your Icon

### Option 1: Use an Online Icon Generator (Recommended - 5 minutes)
1. **Visit**: https://icon.kitchen/
2. **Choose**: "Simple" or "Gradient" style
3. **Settings**:
   - **Icon**: Choose medical/pharmacy symbol (💊, ⚕️, or 🏥)
   - **Background**: #2196F3 (SimpliPharma blue)
   - **Shape**: Circle or Rounded Square
4. **Download**: Click "Download" → Get the full package
5. **Extract** and copy `icon.png` to your project's `assets/` folder

### Option 2: Use Figma Icon Generator (Professional)
1. **Visit**: https://www.figma.com/community/plugin/842476969997970799/App-Icon-Generator
2. Create a 1024×1024 icon with medical theme
3. Export as PNG
4. Save as `assets/icon.png`

### Option 3: Use Expo's Icon Generator
1. **Visit**: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload a medical symbol or use text "SP"
3. Choose background color: #2196F3
4. Download and rename to `icon.png`
5. Place in `assets/` folder

### Option 4: Quick Emoji Icon (Fastest - 1 minute)
I've provided a simple setup that uses an emoji as a temporary icon. See instructions below.

---

## Icon Specifications

### Requirements:
- **Format**: PNG (with transparency)
- **Size**: 1024×1024 pixels (minimum)
- **Background**: Can be transparent or colored
- **Theme**: Medical/Pharmacy (💊 pill, ⚕️ medical symbol, + cross)

### Recommended Design:
```
┌─────────────────────┐
│                     │
│      💊 or ⚕️      │
│                     │
│   SimpliPharma      │
│                     │
└─────────────────────┘
Blue gradient background (#2196F3 → #1976D2)
```

---

## Colors for Your Icon

Use SimpliPharma's brand colors:
- **Primary Blue**: `#2196F3`
- **Dark Blue**: `#1976D2`
- **White**: `#FFFFFF`
- **Green (accent)**: `#4CAF50`

---

## Where to Place the Icon

After creating/downloading your icon:

```
MedicineSupplyApp/
  └── assets/
      ├── icon.png          ← Place your 1024×1024 icon here
      ├── adaptive-icon.png ← (Optional) Android adaptive icon
      └── splash.png        ← (Optional) Splash screen image
```

---

## Testing Your Icon

### In Expo Go:
- Icons don't show in Expo Go (limitation)
- You'll see the default Expo icon

### In Built App (APK/IPA):
```bash
# Build Android
eas build --platform android --profile preview

# Build iOS  
eas build --platform ios --profile preview
```

The icon will appear on the home screen after installation.

---

## Free Icon Resources

### Stock Icons:
1. **Flaticon**: https://www.flaticon.com/search?word=pharmacy
2. **Icons8**: https://icons8.com/icons/set/pharmacy
3. **Noun Project**: https://thenounproject.com/search/?q=medicine

### Icon Creation Tools:
1. **Canva**: https://www.canva.com/create/app-icons/
2. **Photopea** (Free Photoshop): https://www.photopea.com/
3. **Remove.bg**: Remove backgrounds from images

---

## Quick DIY Icon in Canva (3 minutes)

1. Go to Canva.com (free account)
2. Create custom size: **1024 × 1024 px**
3. Add background: Gradient (#2196F3 → #1976D2)
4. Add element: Search "pill" or "medical cross"
5. Add text: "SP" or "SimpliPharma" (optional)
6. Download as PNG
7. Save to `assets/icon.png`

---

## After Adding the Icon

1. **Reload Metro Bundler**:
   ```bash
   npx expo start --clear
   ```

2. **Build the app** to see the icon:
   ```bash
   eas build --platform android --profile preview
   ```

3. **Install on device** to verify

---

## Troubleshooting

### Icon not showing?
- ✅ Check file is named `icon.png` (lowercase)
- ✅ Check file is in `assets/` folder
- ✅ Verify size is 1024×1024 pixels
- ✅ Rebuild the app (icons don't update in Expo Go)

### Icon looks blurry?
- ✅ Use higher resolution (1024×1024 minimum)
- ✅ Save as PNG, not JPG
- ✅ Don't use low-quality source images

### Android adaptive icon issues?
- ✅ Create separate `adaptive-icon.png`
- ✅ Should be 1024×1024 with transparent background
- ✅ Keep important content in center 66% of canvas

---

## Need Help?

If you want a custom icon designed, let me know your preferences:
- Style (modern, minimal, professional, colorful)
- Symbol (pill, cross, heart, caduceus)
- Text (include "SP" or "SimpliPharma"?)

I can guide you through creating exactly what you want! 🎨

