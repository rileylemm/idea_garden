import { createContext } from "react"

interface QuickCaptureContextType {
  isQuickCaptureOpen: boolean
  openQuickCapture: () => void
  closeQuickCapture: () => void
}

export const QuickCaptureContext = createContext<QuickCaptureContextType | undefined>(undefined) 