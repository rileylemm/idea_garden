const { app, BrowserWindow, Tray, Menu, globalShortcut, nativeImage, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let quickCaptureWindow;
let tray;
let isQuitting = false;

// Keep a global reference of the window object
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false // Don't show until ready
  });

  // Load the frontend app
  mainWindow.loadURL('http://localhost:3000');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent window from being closed when user clicks X
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createQuickCaptureWindow() {
  // Create a small, always-on-top window for quick capture
  quickCaptureWindow = new BrowserWindow({
    width: 500,
    height: 400,
    alwaysOnTop: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hidden',
    frame: false,
    transparent: true
  });

  // Load the quick capture page
  quickCaptureWindow.loadURL('http://localhost:3000/quick-capture');

  // Show window when ready
  quickCaptureWindow.once('ready-to-show', () => {
    quickCaptureWindow.show();
    quickCaptureWindow.focus();
  });

  // Handle window closed
  quickCaptureWindow.on('closed', () => {
    quickCaptureWindow = null;
  });

  // Prevent window from being closed when user clicks X
  quickCaptureWindow.on('close', (event) => {
    event.preventDefault();
    quickCaptureWindow.hide();
  });
}

function createTray() {
  // Create tray icon
  const iconPath = path.join(__dirname, 'assets/icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(icon);
  tray.setToolTip('Idea Garden');

  // Create tray menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Idea Garden',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Quick Capture',
      click: () => {
        console.log('Tray menu quick capture clicked');
        if (quickCaptureWindow) {
          console.log('Showing quick capture window from tray menu');
          quickCaptureWindow.show();
          quickCaptureWindow.focus();
        } else {
          console.log('Creating new quick capture window from tray menu');
          createQuickCaptureWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  // Handle tray click
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function registerGlobalShortcut() {
  // Register global shortcut for quick capture
  const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
    console.log('Global shortcut triggered');
    // Show the quick capture window
    if (quickCaptureWindow) {
      console.log('Showing quick capture window');
      quickCaptureWindow.show();
      quickCaptureWindow.focus();
    } else {
      console.log('Creating new quick capture window');
      createQuickCaptureWindow();
    }
  });

  if (!ret) {
    console.log('Global shortcut registration failed');
  }
}

// IPC handlers
ipcMain.handle('open-quick-capture', () => {
  if (mainWindow) {
    mainWindow.webContents.send('open-quick-capture');
  }
});

ipcMain.handle('close-quick-capture-window', () => {
  if (quickCaptureWindow) {
    quickCaptureWindow.hide();
  }
});

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcut();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
} 