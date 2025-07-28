import type React from "react"
import { Link } from "react-router-dom"
import { navIcons, typography, cardStyles, getCategoryTheme, getStatusTheme } from "../utils/designSystem"
import type { Idea } from "../services/api"

interface IdeaCardProps {
  idea: Idea
}

// Remove the old theme functions - we'll use the design system ones

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const categoryTheme = getCategoryTheme(idea.category)
  const statusTheme = getStatusTheme(idea.status)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Link to={`/ideas/${idea.id}`}>
      <div className={`group relative ${cardStyles.interactive} p-6 overflow-hidden`}>
        {/* Background decoration */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 ${categoryTheme.bgColor} rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity`}
        />

        {/* Category icon and status */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 ${categoryTheme.bgColor} rounded-lg`}>
            <categoryTheme.icon className={`h-6 w-6 ${categoryTheme.color}`} />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`p-1 ${statusTheme.bgColor} rounded-full`}>
              <statusTheme.icon className={`h-4 w-4 ${statusTheme.color}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusTheme.bgColor} ${statusTheme.color} capitalize`}>
              {idea.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className={`${typography.h5} group-hover:text-blue-700 transition-colors line-clamp-2`}>
            {idea.title}
          </h3>

          {idea.description && (
            <p className={`${typography.bodySmall} line-clamp-3`}>{idea.description}</p>
          )}

          {/* Category badge */}
          {idea.category && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryTheme.bgColor} ${categoryTheme.color} capitalize`}
            >
              {idea.category}
            </div>
          )}

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <navIcons.tags className="h-3 w-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {tag.name}
                  </span>
                ))}
                {idea.tags.length > 3 && <span className="text-xs text-gray-400">+{idea.tags.length - 3}</span>}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <navIcons.calendar className="h-3 w-3" />
            <span>Planted {formatDate(idea.created_at)}</span>
          </div>
        </div>

        {/* Growth indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className={`h-full ${statusTheme.color.replace("text-", "bg-")} transition-all duration-300`}
            style={{
              width: idea.status === "seedling" ? "33%" : idea.status === "growing" ? "66%" : "100%",
            }}
          />
        </div>
      </div>
    </Link>
  )
}
