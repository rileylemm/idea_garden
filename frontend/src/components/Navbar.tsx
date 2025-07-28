import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { BarChart3, Settings } from "lucide-react"
import { navIcons, typography } from "../utils/designSystem"

export const Navbar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: "/", icon: navIcons.home, label: "Garden" },
    { path: "/ideas", icon: navIcons.ideas, label: "Ideas" },
    { path: "/create", icon: navIcons.create, label: "Plant" },
    { path: "/search", icon: navIcons.search, label: "Search" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/system", icon: Settings, label: "System" },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <navIcons.home className="h-8 w-8" />
            <span className={typography.h5}>Idea Garden</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
