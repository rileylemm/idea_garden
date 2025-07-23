import type React from "react"

interface GardenLayoutProps {
  children: React.ReactNode
}

export const GardenLayout: React.FC<GardenLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Garden background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating garden elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">🌿</div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 animate-pulse delay-1000">🌸</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-pulse delay-2000">🌻</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-pulse delay-3000">🌱</div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
