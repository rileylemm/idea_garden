import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Lightbulb, Plus, Search, Leaf } from "lucide-react"

export const Navbar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: "/", icon: Home, label: "Garden" },
    { path: "/ideas", icon: Lightbulb, label: "Ideas" },
    { path: "/create", icon: Plus, label: "Plant" },
    { path: "/search", icon: Search, label: "Search" },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-green-700 hover:text-green-800 transition-colors">
            <Leaf className="h-8 w-8" />
            <span className="text-xl font-bold">Idea Garden</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? "bg-green-100 text-green-700 shadow-sm"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50"
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
