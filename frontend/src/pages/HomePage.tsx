import type React from "react"
import { Link } from "react-router-dom"
import { Plus, TrendingUp, Lightbulb, Sprout } from "lucide-react"
import { sampleIdeas } from "../utils/sampleData"
import { IdeaCard } from "../components/IdeaCard"

export const HomePage: React.FC = () => {
  const recentIdeas = sampleIdeas.slice(0, 3)
  const totalIdeas = sampleIdeas.length
  const growingIdeas = sampleIdeas.filter((idea) => idea.stage === "growing").length
  const matureIdeas = sampleIdeas.filter((idea) => idea.stage === "mature").length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Idea Garden</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Nurture your thoughts, watch them grow, and cultivate innovation in your personal digital garden.
        </p>
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Plant a New Idea</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalIdeas}</p>
              <p className="text-sm text-gray-600">Total Ideas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Sprout className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {sampleIdeas.filter((i) => i.stage === "seedling").length}
              </p>
              <p className="text-sm text-gray-600">Seedlings</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{growingIdeas}</p>
              <p className="text-sm text-gray-600">Growing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <div className="text-emerald-600 text-xl">🌳</div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{matureIdeas}</p>
              <p className="text-sm text-gray-600">Mature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ideas */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Planted</h2>
          <Link to="/ideas" className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
            <span>View all ideas</span>
            <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>

      {/* Garden Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🌿 Garden Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Nurture Your Seedlings</h4>
            <p className="text-sm text-gray-600">
              New ideas need attention. Add details, research, and connections to help them grow.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Cross-Pollinate</h4>
            <p className="text-sm text-gray-600">
              Connect related ideas with tags and categories to discover new possibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
