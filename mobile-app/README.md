# Africa Waste Solutions - Mobile App

React Native mobile application for the Africa Waste Solutions waste management system.

## 📱 Features

- ✅ **Authentication** - Login and registration with JWT tokens
- ✅ **Dashboard** - Real-time stats for users and admins
- ✅ **Data Entry** - Record supply, transfer, and return transactions
- ✅ **Account Management** - View profile and KYC status
- ✅ **Admin Panel** - Manage accounts (admin only)
- ✅ **Offline Storage** - Secure token and session management

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator) OR physical Android device

### Installation

1. **Navigate to the mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npx expo install
   ```

   If you encounter issues, try:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update API Configuration:**
   
   Edit `constants/Config.js` and update the production API URL:
   ```javascript
   export const API_CONFIG = {
     BASE_URL: __DEV__
       ? 'http://10.0.2.2:8080/api'  // Android emulator localhost
       : 'https://YOUR-RAILWAY-APP.railway.app/api', // UPDATE THIS!
   };
   ```

### Running the App

#### Development Mode

```bash
npm start
```

This will start the Expo development server. You can then:

- **Press `a`** to open on Android emulator
- **Scan QR code** with Expo Go app on your physical device

#### Android Emulator

```bash
npm run android
```

#### iOS Simulator (Mac only)

```bash
npm run ios
```

## 🏗️ Project Structure

```
mobile-app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── dashboard.js   # Dashboard with stats
│   │   ├── data-entry.js  # Transaction entry form
│   │   ├── reports.js     # Reports and analytics
│   │   ├── account.js     # User profile
│   │   └── accounts.js    # Admin accounts management
│   ├── _layout.js         # Root navigation layout
│   ├── index.js           # Entry point with auth routing
│   ├── login.js           # Login screen
│   └── register.js        # Registration screen
├── components/            # Reusable UI components
├── services/              # API client and utilities
│   ├── api.js            # Backend API client
│   └── storage.js        # AsyncStorage utilities
├── contexts/              # React contexts
│   └── AuthContext.js    # Authentication state management
├── constants/             # App constants
│   ├── Colors.js         # Design system colors
│   └── Config.js         # API configuration
└── assets/               # Images, fonts, icons
```

## 🔧 Configuration

### Backend API

The app connects to your Go backend. Make sure:

1. **Backend is running** and accessible
2. **CORS is configured** to allow mobile app requests
3. **API URL is correct** in `constants/Config.js`

### Backend CORS Setup

Add this to your `backend/main.go`:

```go
import "github.com/gofiber/fiber/v2/middleware/cors"

app.Use(cors.New(cors.Config{
    AllowOrigins: "*", // Or specific origins
    AllowHeaders: "Origin, Content-Type, Accept, Authorization",
    AllowMethods: "GET, POST, PUT, DELETE",
}))
```

## 📦 Building APK

### Using EAS Build (Recommended)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS Build:**
   ```bash
   eas build:configure
   ```

4. **Build APK:**
   ```bash
   eas build --platform android --profile preview
   ```

   The APK will be available for download after the build completes.

### Local Build (Advanced)

```bash
npx expo run:android --variant release
```

## 🧪 Testing

### Test Accounts

Use the same credentials as your web app:

- **Admin:** admin@example.com / password
- **User:** user@example.com / password

### Testing Checklist

- [ ] Login with existing credentials
- [ ] Register new account
- [ ] View dashboard stats
- [ ] Create supply entry
- [ ] Create transfer entry
- [ ] Create return entry
- [ ] View account profile
- [ ] Logout and login again
- [ ] Admin: View accounts list

## 🐛 Troubleshooting

### "Network Error" when logging in

- Check that backend is running
- Verify API URL in `constants/Config.js`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Check backend CORS configuration

### Dependencies installation fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### App crashes on startup

```bash
# Clear Expo cache
npx expo start -c
```

## 📱 Deployment

### Google Play Store

1. Build production APK with EAS
2. Create Google Play Console account
3. Upload APK and fill in store listing
4. Submit for review

### Direct APK Distribution

1. Build APK using EAS
2. Download APK file
3. Share APK file with users
4. Users need to enable "Install from Unknown Sources"

## 🔐 Security Notes

- Tokens are stored securely using AsyncStorage
- Passwords are never stored locally
- API calls use JWT authentication
- HTTPS should be used in production

## 📝 API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/stats` - User statistics
- `GET /api/accounts` - List accounts (admin)
- `POST /api/entries` - Create transaction entry
- `GET /api/entries` - List entries
- `GET /api/reports/stats` - Report statistics
- `GET /api/products` - List products

## 🤝 Support

For issues or questions:
- Check the troubleshooting section above
- Review backend logs for API errors
- Ensure all environment variables are set correctly

## 📄 License

Copyright © 2026 AddPlux - Africa Waste Solutions
