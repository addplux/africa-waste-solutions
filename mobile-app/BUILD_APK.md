# Building APK for Distribution

## Quick Start (EAS Build - Recommended)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```
Create a free account at https://expo.dev if needed.

### 3. Configure Build
```bash
cd mobile-app
eas build:configure
```

When prompted:
- Select "All" for platforms (or just Android)
- Choose default options

### 4. Build APK
```bash
eas build --platform android --profile preview
```

**What happens:**
- ✅ Uploads your code to Expo servers
- ✅ Builds APK in the cloud (10-15 minutes)
- ✅ Gives you download link
- ✅ No Android Studio needed!

### 5. Download APK
- Check your terminal for the build URL
- Or visit: https://expo.dev/accounts/[your-account]/projects/africa-waste-solutions/builds
- Download the APK file

### 6. Share APK

**Option A: Google Drive**
1. Upload APK to Google Drive
2. Right-click → Share → Get link
3. Share link with users

**Option B: Direct File Share**
- Send APK via WhatsApp, email, Telegram, etc.
- File size: ~50-80 MB

---

## User Installation Instructions

Share these steps with your users:

### For Android Users:

1. **Download the APK**
   - Click the shared link
   - Download the file

2. **Enable Installation**
   - Go to Settings → Security
   - Enable "Install from Unknown Sources"
   - Or enable for your browser/file manager

3. **Install**
   - Open the downloaded APK file
   - Tap "Install"
   - Wait for installation to complete

4. **Open App**
   - Find "Africa Waste Solutions" in your app drawer
   - Open and login!

---

## Build Profiles

### Preview Build (For Testing)
```bash
eas build --platform android --profile preview
```
- Faster build
- Larger file size
- Good for testing

### Production Build (For Release)
```bash
eas build --platform android --profile production
```
- Optimized and minified
- Smaller file size
- Ready for Play Store

---

## Troubleshooting

### Build Failed?
- Check your `app.json` is valid
- Ensure all dependencies are installed
- Check EAS build logs for errors

### APK Won't Install?
- Make sure "Unknown Sources" is enabled
- Check Android version (minimum: Android 5.0)
- Try downloading again

### App Crashes?
- Check backend API is accessible
- Verify API URL in `constants/Config.js`
- Check device logs with `adb logcat`

---

## Alternative: Local Build

If you prefer building locally (requires Android Studio):

### Setup
1. Install Android Studio
2. Install Android SDK
3. Set up environment variables

### Build
```bash
cd mobile-app
npx expo prebuild
npx expo run:android --variant release
```

APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Publishing to Google Play Store

### 1. Create Developer Account
- Go to https://play.google.com/console
- Pay $25 one-time registration fee
- Complete account setup

### 2. Build Production APK
```bash
eas build --platform android --profile production
```

### 3. Create App Listing
- Upload APK
- Add screenshots
- Write description
- Set pricing (free/paid)

### 4. Submit for Review
- Fill in content rating
- Add privacy policy
- Submit for review
- Wait 1-3 days for approval

---

## Cost Summary

| Method | Cost | Time |
|--------|------|------|
| EAS Build (Free tier) | Free | 15 min/build |
| EAS Build (Paid) | $29/month | Faster builds |
| Local Build | Free | Setup time |
| Google Play Store | $25 one-time | 1-3 days review |

---

## Recommended Workflow

1. **Development**: Test with `npm start` and Expo Go
2. **Testing**: Build preview APK with EAS
3. **Share**: Upload to Google Drive, share with testers
4. **Production**: Build production APK
5. **Release**: Upload to Google Play Store

---

## Need Help?

- EAS Build Docs: https://docs.expo.dev/build/setup/
- Expo Forums: https://forums.expo.dev/
- Check build status: https://expo.dev/accounts/[your-account]/builds
