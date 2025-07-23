import { useEffect } from "react"
import { useQuickCapture } from "./useQuickCapture"

declare global {
  interface Window {
    electronAPI?: {
      onQuickCaptureRequested: (callback: () => void) => void
      removeAllListeners: (channel: string) => void
    }
  }
}

export const useElectronAPI = () => {
  const { openQuickCapture } = useQuickCapture()

  useEffect(() => {
    // Only run in Electron environment
    if (window.electronAPI) {
      // Listen for quick capture requests from Electron
      window.electronAPI.onQuickCaptureRequested(() => {
        console.log("Quick capture requested from Electron")
        openQuickCapture()
      })

      // Cleanup listeners on unmount
      return () => {
        window.electronAPI?.removeAllListeners("open-quick-capture")
      }
    }
  }, [openQuickCapture])
} 