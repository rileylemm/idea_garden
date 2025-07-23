import type React from "react"
import { Link } from "react-router-dom"
import { Calendar, Tag } from "lucide-react"
import type { Idea } from "../types/idea"
import { getPlantTheme, getStageIcon } from "../utils/sampleData"

interface IdeaCardProps {
  idea: Idea
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const theme = getPlantTheme(idea.category)
  const stageIcon = getStageIcon(idea.stage)

  return (
    <Link to={`/ideas/${idea.id}`}>
      <div
        className={`group relative bg-white rounded-2xl p-6 shadow-sm border-2 ${theme.borderColor} hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden`}
      >
        {/* Background decoration */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 ${theme.bgColor} rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity`}
        />

        {/* Plant icon and stage */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{theme.icon}</div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{stageIcon}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${theme.bgColor} ${theme.color} capitalize`}>
              {idea.stage}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
            {idea.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3">{idea.description}</p>

          {/* Category badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme.bgColor} ${theme.color} capitalize`}
          >
            {idea.category}
          </div>

          {/* Tags */}
          {idea.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-3 w-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
                {idea.tags.length > 3 && <span className="text-xs text-gray-400">+{idea.tags.length - 3}</span>}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>Planted {idea.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Growth indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className={`h-full ${theme.color.replace("text-", "bg-")} transition-all duration-300`}
            style={{
              width: idea.stage === "seedling" ? "33%" : idea.stage === "growing" ? "66%" : "100%",
            }}
          />
        </div>
      </div>
    </Link>
  )
}
