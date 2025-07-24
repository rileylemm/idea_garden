const { app, BrowserWindow, Tray, Menu, globalShortcut, nativeImage, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let quickCaptureWindow;
let tray;
let isQuitting = false;
let shouldKeepMainWindowHidden = false;

// Keep a global reference of the window object
function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    focusable: false, // Start as unfocusable
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
    mainWindow.showInactive(); // Show without taking focus
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
      shouldKeepMainWindowHidden = true;
      mainWindow.setFocusable(false); // Make unfocusable when hidden
      console.log('Main window closed, shouldKeepMainWindowHidden set to true');
    }
  });

  // Track when main window is shown
  mainWindow.on('show', () => {
    shouldKeepMainWindowHidden = false;
    console.log('Main window shown, shouldKeepMainWindowHidden set to false');
  });

  // Set focusable property based on shouldKeepMainWindowHidden
  const updateMainWindowFocusable = () => {
    if (mainWindow) {
      const focusable = !shouldKeepMainWindowHidden;
      mainWindow.setFocusable(focusable);
      console.log('Main window focusable set to:', focusable);
    }
  };


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
    focusable: true,
    parent: null, // No parent window - completely independent
    modal: false, // Not a modal - doesn't block parent
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

  // Allow window to be closed completely
  quickCaptureWindow.on('close', (event) => {
    // Don't prevent default - let it close
    quickCaptureWindow = null;
  });

  // When quick capture window is hidden/closed, don't affect main window focus
  quickCaptureWindow.on('hide', () => {
    console.log('Quick capture window hiding');
  });

  quickCaptureWindow.on('closed', () => {
    console.log('Quick capture window closed');
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
          shouldKeepMainWindowHidden = false;
          mainWindow.setFocusable(true); // Make focusable for user action
          mainWindow.show(); // Use show() + focus() for explicit user action
          mainWindow.focus();
          console.log('Main window opened from tray menu');
        }
      }
    },
    {
      label: 'Quick Capture',
      click: () => {
        console.log('Tray menu quick capture clicked');
        console.log('Creating new quick capture window from tray menu');
        createQuickCaptureWindow();
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
      shouldKeepMainWindowHidden = false;
      mainWindow.setFocusable(true); // Make focusable for user action
      mainWindow.show(); // Use show() + focus() for explicit user action
      mainWindow.focus();
      console.log('Main window opened from tray click');
    }
  });
}

function registerGlobalShortcut() {
  // Register global shortcut for quick capture
  const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
    console.log('Global shortcut triggered');
    // Always create a new quick capture window
    console.log('Creating new quick capture window');
    createQuickCaptureWindow();
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
  console.log('close-quick-capture-window IPC called');
  if (quickCaptureWindow) {
    quickCaptureWindow.close();
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