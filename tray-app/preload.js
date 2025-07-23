const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Quick capture functionality
  openQuickCapture: () => ipcRenderer.invoke('open-quick-capture'),
  
  // Window management
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // App lifecycle
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // Listen for events from main process
  onQuickCaptureRequested: (callback) => {
    ipcRenderer.on('open-quick-capture', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
}); 