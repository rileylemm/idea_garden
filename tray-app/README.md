# Idea Garden Desktop & Tray App

The Electron-based desktop application for Idea Garden, featuring both a full desktop interface and a system tray app for quick idea capture.

## Features

- **Full Desktop App**: Complete Idea Garden interface in a native window
- **System Tray**: Always-accessible tray icon with quick actions
- **Global Shortcut**: `Cmd/Ctrl + Shift + I` for instant idea capture
- **Seamless Integration**: Connects to your existing Idea Garden backend

## Development Setup

### Prerequisites
- Node.js (v18+)
- Your Idea Garden backend running on `http://localhost:4000`
- Your Idea Garden frontend running on `http://localhost:5173`

### Installation
```bash
npm install
```

### Running in Development
```bash
npm start
```

This will:
1. Start the Electron app
2. Load your frontend from `http://localhost:5173`
3. Create a system tray icon
4. Register the global shortcut `Cmd/Ctrl + Shift + I`

### Building for Production
```bash
npm run build
```

## Usage

### Desktop Mode
- The app opens in a normal window with your full Idea Garden interface
- Click the X to minimize to tray (app stays running)
- Use all your existing Idea Garden features

### Tray Mode
- **Click tray icon**: Opens the main window
- **Right-click tray icon**: Shows menu with options
- **Global shortcut**: `Cmd/Ctrl + Shift + I` opens quick capture

### Quick Capture
- Use the global shortcut from anywhere on your system
- Instantly capture ideas without opening the full app
- Ideas are saved to your backend and appear in the main interface

## Architecture

```
tray-app/
├── main.js          # Electron main process
├── preload.js       # Secure bridge to renderer
├── assets/          # App icons and resources
└── package.json     # Dependencies and build config
```

## Next Steps

- [ ] Implement quick capture modal
- [ ] Add offline mode support
- [ ] Voice input integration
- [ ] Auto-launch at login
- [ ] Production packaging and distribution 