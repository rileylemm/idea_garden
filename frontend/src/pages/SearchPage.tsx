"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { sampleIdeas } from "../utils/sampleData"
import { IdeaCard } from "../components/IdeaCard"
import type { IdeaCategory, GrowthStage } from "../types/idea"

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<IdeaCategory[]>([])
  const [selectedStages, setSelectedStages] = useState<GrowthStage[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const categories: IdeaCategory[] = ["technology", "business", "creative", "personal", "research", "innovation"]
  const stages: GrowthStage[] = ["seedling", "growing", "mature"]

  const filteredIdeas = useMemo(() => {
    return sampleIdeas.filter((idea) => {
      // Text search
      const searchMatch =
        searchQuery === "" ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(idea.category)

      // Stage filter
      const stageMatch = selectedStages.length === 0 || selectedStages.includes(idea.stage)

      return searchMatch && categoryMatch && stageMatch
    })
  }, [searchQuery, selectedCategories, selectedStages])

  const toggleCategory = (category: IdeaCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleStage = (stage: GrowthStage) => {
    setSelectedStages((prev) => (prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedStages([])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedStages.length > 0 || searchQuery !== ""

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Your Garden</h1>
        <p className="text-gray-600">Find the perfect idea among your growing collection</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas, descriptions, or tags..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                {selectedCategories.length + selectedStages.length + (searchQuery ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedCategories.includes(category)
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Growth Stages */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Growth Stages</h3>
              <div className="flex flex-wrap gap-2">
                {stages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => toggleStage(stage)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedStages.includes(stage)
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Your garden is waiting for its first idea!"}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-green-600 hover:text-green-700 font-medium">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  )
}
