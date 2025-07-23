"use client"

import type React from "react"
import { useState } from "react"
import { Filter, Grid, List } from "lucide-react"
import { sampleIdeas } from "../utils/sampleData"
import { IdeaCard } from "../components/IdeaCard"
import type { IdeaCategory, GrowthStage } from "../types/idea"

export const IdeasList: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterCategory, setFilterCategory] = useState<IdeaCategory | "all">("all")
  const [filterStage, setFilterStage] = useState<GrowthStage | "all">("all")

  const filteredIdeas = sampleIdeas.filter((idea) => {
    const categoryMatch = filterCategory === "all" || idea.category === filterCategory
    const stageMatch = filterStage === "all" || idea.stage === filterStage
    return categoryMatch && stageMatch
  })

  const categories: (IdeaCategory | "all")[] = [
    "all",
    "technology",
    "business",
    "creative",
    "personal",
    "research",
    "innovation",
  ]
  const stages: (GrowthStage | "all")[] = ["all", "seedling", "growing", "mature"]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Idea Garden</h1>
        <p className="text-gray-600">
          {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"} growing in your garden
        </p>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as IdeaCategory | "all")}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value as GrowthStage | "all")}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage === "all" ? "All Stages" : stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Grid/List */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600">Try adjusting your filters or plant a new idea!</p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  )
}
