# 🎵 MusicLab - Focus Music & Study Beats App

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.76.3-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-52.0.11-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

**Your ultimate destination for focus music, study beats, and ambient soundscapes**

[🌐 Live Demo](https://mcstefan.github.io/musiclab-app/) • [📱 Download APK](#download) • [🛠️ Developer Guide](#setup)

</div>

---

## ✨ Features

### 🎧 **Music Experience**
- **High-Quality Streaming** - 128kbps, 320kbps, and Lossless audio
- **Background Playback** - Continue listening while using other apps
- **Offline Downloads** - Save playlists for offline listening
- **Smart Player** - Pomodoro timer, sleep mode, queue management

### 🎨 **Visual Experience**
- **Visual Content** - Videos and images synchronized with playlists
- **Modern UI** - Dark theme, smooth animations, intuitive navigation
- **PWA Support** - Install as native app on any device

### 🔍 **Discovery & Organization**
- **Advanced Filtering** - Genre, mood, purpose, quality, duration
- **Smart Library** - Liked tracks, playlists, visuals, downloads
- **Dislike System** - Auto-skip unwanted tracks
- **Personal Collections** - Create and manage your music library

### 👥 **Social & Sharing**
- **Family Sharing** - Share premium subscription with up to 6 members
- **User Profiles** - Personalized experience and preferences
- **Multi-Platform** - Seamless sync across all devices

---

## 🚀 Quick Start

### 📱 **Try It Now (PWA)**
1. Visit: **https://mcstefan.github.io/musiclab-app/**
2. On mobile: Tap "Add to Home Screen"
3. Enjoy full app experience!

### 📦 **Download APK**
- [Download Android APK](https://github.com/McStefan/musiclab-app/releases) (Coming soon)
- iOS version available through App Store (Coming soon)

---

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/McStefan/musiclab-app.git
cd musiclab-app

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npx expo start
```

### **Build for Production**
```bash
# Web build
npx expo export --platform web

# Android APK
npx eas build --platform android --profile preview

# iOS build
npx eas build --platform ios --profile preview
```

---

## 🏗️ Architecture

### **Tech Stack**
- **Frontend**: React Native + Expo
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand + React Query
- **Navigation**: React Navigation 7
- **Storage**: MMKV (encrypted) + React Native Keychain
- **Audio**: React Native Track Player
- **Analytics**: Amplitude
- **Payments**: Stripe + Google Play Billing

### **Project Structure**
```
src/
├── app/                   # App-level components and navigation
│   ├── components/        # Shared UI components
│   ├── navigation/        # Navigation stacks
│   └── screens/          # Screen components
├── modules/              # Feature-based modules
│   ├── auth/             # Authentication
│   ├── player/           # Music player
│   ├── catalog/          # Music catalog
│   ├── library/          # User library
│   ├── billing/          # Subscriptions
│   ├── analytics/        # Event tracking
│   └── visuals/          # Visual content
├── services/             # External services
├── store/               # Global state
├── theme/               # Design system
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

---

## 🎯 Roadmap

### **Phase 1: Core Features** ✅
- [x] Authentication system
- [x] Music player with offline support
- [x] Library management
- [x] Basic filtering and search
- [x] PWA deployment

### **Phase 2: Enhanced Experience** 🚧
- [x] Visual content integration
- [x] Advanced filtering system
- [x] Dislike system
- [x] Family sharing
- [ ] Real-time synchronization
- [ ] Social features

### **Phase 3: Platform Expansion** 📅
- [ ] iOS App Store release
- [ ] Google Play Store release
- [ ] Desktop applications
- [ ] Smart TV integration
- [ ] Voice control

---

## 📊 Performance

- **Bundle Size**: < 3MB (optimized)
- **Load Time**: < 2s on 4G
- **Offline Ready**: Full functionality without internet
- **PWA Score**: 95+ (Lighthouse)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Native Team** - For the amazing framework
- **Expo Team** - For simplifying mobile development
- **Open Source Community** - For the incredible libraries

---

<div align="center">

**Made with ❤️ for the focus music community**

[🌟 Star this repo](https://github.com/McStefan/musiclab-app) • [🐛 Report Bug](https://github.com/McStefan/musiclab-app/issues) • [💡 Request Feature](https://github.com/McStefan/musiclab-app/issues)

</div>