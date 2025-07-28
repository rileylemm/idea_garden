import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { navIcons, typography, cardStyles, buttonStyles } from "../utils/designSystem"
import { IdeaCard } from "../components/IdeaCard"
import { apiService, type Idea } from "../services/api"

export const HomePage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true)
        const fetchedIdeas = await apiService.getAllIdeas()
        setIdeas(fetchedIdeas)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ideas')
        console.error('Error fetching ideas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  const recentIdeas = ideas.slice(0, 3)
  const totalIdeas = ideas.length
  const seedlingIdeas = ideas.filter((idea) => idea.status === "seedling").length
  const growingIdeas = ideas.filter((idea) => idea.status === "growing").length
  const matureIdeas = ideas.filter((idea) => idea.status === "mature").length

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <navIcons.home className="h-16 w-16 text-blue-600 animate-pulse" />
          </div>
          <h1 className={typography.h1 + " mb-4"}>Loading Your Garden...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 text-red-500 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h1 className={typography.h1 + " mb-4"}>Connection Error</h1>
          <p className={typography.body + " mb-8 max-w-2xl mx-auto"}>
            {error}
          </p>
          <p className={typography.caption}>
            Make sure the backend server is running on http://localhost:4000
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <navIcons.home className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className={typography.h1 + " mb-4"}>Welcome to Your Idea Garden</h1>
        <p className={typography.body + " mb-8 max-w-2xl mx-auto"}>
          Nurture your thoughts, watch them grow, and cultivate innovation in your personal digital garden.
        </p>
        <Link
          to="/create"
          className={buttonStyles.primary + " inline-flex items-center space-x-2"}
        >
          <navIcons.create className="h-5 w-5" />
          <span>Plant a New Idea</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className={cardStyles.base + " p-6"}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <navIcons.ideas className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className={typography.h2}>{totalIdeas}</p>
              <p className={typography.bodySmall}>Total Ideas</p>
            </div>
          </div>
        </div>

        <div className={cardStyles.base + " p-6"}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <navIcons.home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className={typography.h2}>{seedlingIdeas}</p>
              <p className={typography.bodySmall}>Seedlings</p>
            </div>
          </div>
        </div>

        <div className={cardStyles.base + " p-6"}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <navIcons.trendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className={typography.h2}>{growingIdeas}</p>
              <p className={typography.bodySmall}>Growing</p>
            </div>
          </div>
        </div>

        <div className={cardStyles.base + " p-6"}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <navIcons.treePine className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className={typography.h2}>{matureIdeas}</p>
              <p className={typography.bodySmall}>Mature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ideas */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className={typography.h3}>Recently Planted</h2>
          <Link to="/ideas" className={typography.link + " flex items-center space-x-1"}>
            <span>View all ideas</span>
            <span>→</span>
          </Link>
        </div>
        {recentIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <navIcons.home className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className={typography.h4 + " mb-2"}>No ideas yet</h3>
            <p className={typography.bodySmall + " mb-4"}>Start planting your first idea to see it here!</p>
            <Link
              to="/create"
              className={buttonStyles.primary + " inline-flex items-center space-x-2"}
            >
              <navIcons.create className="h-4 w-4" />
              <span>Create Your First Idea</span>
            </Link>
          </div>
        )}
      </div>

      {/* Garden Tips */}
      <div className={cardStyles.accent + " p-8"}>
        <h3 className={typography.h4 + " mb-4 flex items-center space-x-2"}>
          <navIcons.home className="h-5 w-5" />
          <span>Garden Tips</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className={typography.h5}>Nurture Your Seedlings</h4>
            <p className={typography.bodySmall}>
              New ideas need attention. Add details, research, and connections to help them grow.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className={typography.h5}>Cross-Pollinate</h4>
            <p className={typography.bodySmall}>
              Connect related ideas with tags and categories to discover new possibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
