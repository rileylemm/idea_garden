"use client"

import type React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Tag, Edit, Share2 } from "lucide-react"
import { sampleIdeas, getPlantTheme, getStageIcon } from "../utils/sampleData"

export const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const idea = sampleIdeas.find((i) => i.id === id)

  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Idea not found</h2>
          <p className="text-gray-600 mb-6">This idea might have been moved or doesn't exist.</p>
          <Link
            to="/ideas"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Garden</span>
          </Link>
        </div>
      </div>
    )
  }

  const theme = getPlantTheme(idea.category)
  const stageIcon = getStageIcon(idea.stage)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Garden</span>
      </button>

      {/* Idea Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Header Background */}
        <div className={`h-32 ${theme.bgColor} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="text-8xl absolute top-4 right-8">{theme.icon}</div>
            <div className="text-6xl absolute bottom-4 left-8 opacity-50">{stageIcon}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{theme.icon}</span>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${theme.bgColor} ${theme.color} capitalize`}
                >
                  {idea.category}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{stageIcon}</span>
                  <span className="text-sm text-gray-600 capitalize">{idea.stage}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{idea.title}</h1>

              <p className="text-lg text-gray-600 mb-6">{idea.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-6">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Planted {idea.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Last tended {idea.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Growth Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Growth Progress</span>
              <span className="text-sm text-gray-500 capitalize">{idea.stage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${theme.color.replace("text-", "bg-")}`}
                style={{
                  width: idea.stage === "seedling" ? "33%" : idea.stage === "growing" ? "66%" : "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content */}
      {idea.content && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Notes</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{idea.content}</p>
          </div>
        </div>
      )}

      {/* Growth Actions */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">🌱 Help This Idea Grow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-medium text-gray-900 mb-1">Add Research</h4>
            <p className="text-sm text-gray-600">Gather more information and insights</p>
          </button>
          <button className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left">
            <div className="text-2xl mb-2">🔗</div>
            <h4 className="font-medium text-gray-900 mb-1">Connect Ideas</h4>
            <p className="text-sm text-gray-600">Link to related concepts</p>
          </button>
          <button className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-medium text-gray-900 mb-1">Take Action</h4>
            <p className="text-sm text-gray-600">Create an action plan</p>
          </button>
        </div>
      </div>
    </div>
  )
}
