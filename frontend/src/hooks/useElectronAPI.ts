import { useEffect } from "react"
import { useQuickCapture } from "./useQuickCapture"

declare global {
  interface Window {
    electronAPI?: {
      onQuickCaptureRequested: (callback: () => void) => void
      closeQuickCaptureWindow: () => void
      removeAllListeners: (channel: string) => void
    }
  }
}

export const useElectronAPI = () => {
  const { openQuickCapture } = useQuickCapture()

  useEffect(() => {
    console.log("useElectronAPI hook initialized")
    console.log("window.electronAPI available:", !!window.electronAPI)
    
    // Only run in Electron environment
    if (window.electronAPI) {
      console.log("Setting up Electron API listeners")
      
      // Listen for quick capture requests from Electron
      window.electronAPI.onQuickCaptureRequested(() => {
        console.log("Quick capture requested from Electron")
        openQuickCapture()
      })

      // Cleanup listeners on unmount
      return () => {
        console.log("Cleaning up Electron API listeners")
        window.electronAPI?.removeAllListeners("open-quick-capture")
      }
    } else {
      console.log("Not in Electron environment - window.electronAPI not available")
    }
  }, [openQuickCapture])
} 