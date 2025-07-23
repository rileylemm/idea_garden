import { useContext } from "react"
import { QuickCaptureContext } from "../contexts/QuickCaptureContext.ts"

export const useQuickCapture = () => {
  const context = useContext(QuickCaptureContext)
  if (context === undefined) {
    throw new Error("useQuickCapture must be used within a QuickCaptureProvider")
  }
  return context
} 