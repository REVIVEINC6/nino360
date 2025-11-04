# Nino360 Mobile App

React Native mobile application for Nino360 with comprehensive authentication features.

## Features

- Email/Password Authentication
- Biometric Authentication (Fingerprint/Face ID)
- Multi-Factor Authentication (MFA)
- OAuth Login (Google, Facebook, GitHub)
- Push Notifications for Security Alerts
- Offline Support with Queue Sync
- Secure Token Storage
- Device Fingerprinting

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure environment variables in `.env`:
\`\`\`
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_APP_URL=your_app_url
EXPO_PUBLIC_PROJECT_ID=your_expo_project_id
\`\`\`

3. Run the app:
\`\`\`bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
\`\`\`

## Authentication Flow

1. User opens app
2. Check for stored session
3. If biometric enabled, show biometric prompt
4. Otherwise, show login screen
5. After login, register device
6. Enable biometric authentication (optional)
7. Receive push notifications for security events

## Security Features

- Secure token storage using Expo SecureStore
- Device fingerprinting for trusted device management
- Biometric authentication for quick access
- Offline session caching with expiration
- Push notifications for security alerts
- Automatic session refresh

## Offline Support

The app queues actions when offline and syncs when connection is restored:
- Profile updates
- Security event logging
- Other user actions

## Push Notifications

Security alerts are sent via push notifications:
- New device login
- Password changes
- Suspicious activity
- MFA code delivery
