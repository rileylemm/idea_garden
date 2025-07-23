"use client"

import React, { useState, ReactNode } from "react"
import { QuickCaptureContext } from "./QuickCaptureContext"

interface QuickCaptureContextType {
  isQuickCaptureOpen: boolean
  openQuickCapture: () => void
  closeQuickCapture: () => void
}

interface QuickCaptureProviderProps {
  children: ReactNode
}

export const QuickCaptureProvider: React.FC<QuickCaptureProviderProps> = ({ children }) => {
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)

  const openQuickCapture = () => {
    setIsQuickCaptureOpen(true)
  }

  const closeQuickCapture = () => {
    setIsQuickCaptureOpen(false)
  }

  const value: QuickCaptureContextType = {
    isQuickCaptureOpen,
    openQuickCapture,
    closeQuickCapture,
  }

  return (
    <QuickCaptureContext.Provider value={value}>
      {children}
    </QuickCaptureContext.Provider>
  )
} 