# 🪟 Idea Garden Desktop & Tray App

A cross-platform **Electron app** for capturing and cultivating ideas through a beautiful, seamless interface. Includes both a full-featured desktop application and a minimalist system tray app for instant idea capture.

---

## ✨ Features

### 🖥️ Full Desktop App
- Launches like any traditional app (like Obsidian or Cursor)
- Navigate your full Idea Garden UI
- View, edit, grow, and organize all your ideas
- Powerful search, tag filtering, and idea connection system

### 🧭 System Tray / Menu Bar App
- Lives in your system tray (Windows/Linux) or menu bar (Mac)
- Global hotkey (e.g. `Cmd + Shift + I`) opens a quick-capture modal
- Instantly logs idea “seeds” to your Idea Garden backend
- Stays out of your way while capturing flashes of insight

### 🔄 Shared Data & Backend
- Both apps connect to the same Express + SQLite backend
- Data stays local and persistent
- Ideas created in the tray instantly appear in the full UI

---

## 🧱 Architecture

```
idea_garden/
├── frontend/           # React + Tailwind UI (Idea Garden)
│   └── src/pages/tray.tsx  # Tray-specific capture UI
├── backend/            # Express API + SQLite DB
├── tray-app/           # Electron App (desktop + tray)
│   ├── main.js         # Electron main process
│   ├── preload.js      # Context bridge (if needed)
│   └── iconTemplate.png
```

---

## ⚙️ Setup Instructions

### 1. Install and Run Backend
```bash
cd backend
npm install
npm run dev
```
Backend API starts on `http://localhost:4000`

### 2. Run Frontend (Dev Mode)
```bash
cd frontend
npm install
npm run dev
```
Frontend UI runs at `http://localhost:5173`

### 3. Run the Electron App
```bash
cd tray-app
npm install
npm start
```
Starts:
- Full app window (can be hidden)
- Tray icon
- Global shortcut for idea capture

---

## 🔐 Shortcut Configuration

By default:
- `Cmd + Shift + I` (Mac)  
- `Ctrl + Shift + I` (Windows/Linux)

Opens the idea capture modal from anywhere.

---

## 🚀 Roadmap

- [x] Full-featured Electron desktop shell
- [x] System tray icon and global shortcut
- [x] Quick-capture modal for instant ideas
- [ ] Offline mode for capturing without active backend
- [ ] Voice input via Whisper (voice-to-idea)
- [ ] Local-only mode for privacy-first users
- [ ] Auto-launch at system login

---

## 📦 Packaging

For production builds:

```bash
npm run build   # inside frontend
npm run build   # inside backend (if needed)
npm run package # inside tray-app (using electron-packager or electron-builder)
```

---

## 🪴 Philosophy

> 🌱 Ideas should be treated like seeds — easy to plant, lovingly nurtured, and eventually grown into something meaningful.  
> This app exists to help you never lose a great idea again — no matter when or where it strikes.

---

## 📝 License

MIT License (with attribution + non-commercial use). See [`LICENSE`](../LICENSE) for details.

---

## 🧠 Created by Riley Lemm

This project is part of an ongoing series of tools exploring **augmented intelligence** and creative workflows. Contributions are welcome.
