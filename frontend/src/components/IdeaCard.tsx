import type React from "react"
import { Link } from "react-router-dom"
import { Calendar, Tag } from "lucide-react"
import type { Idea } from "../services/api"

interface IdeaCardProps {
  idea: Idea
}

const getPlantTheme = (category?: string) => {
  const themes = {
    technology: {
      icon: "💻",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    business: {
      icon: "💼",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    creative: {
      icon: "🎨",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    personal: {
      icon: "🌱",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    research: {
      icon: "🔬",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    innovation: {
      icon: "🚀",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const defaultTheme = {
    icon: "🌱",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  };

  return category ? themes[category as keyof typeof themes] || defaultTheme : defaultTheme;
};

const getStageIcon = (status?: string) => {
  const icons = {
    seedling: "🌱",
    growing: "🌿",
    mature: "🌳",
  };
  return status ? icons[status as keyof typeof icons] || "🌱" : "🌱";
};

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const theme = getPlantTheme(idea.category)
  const stageIcon = getStageIcon(idea.status)

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

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
              {idea.status}
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
          {idea.category && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme.bgColor} ${theme.color} capitalize`}
            >
              {idea.category}
            </div>
          )}

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-3 w-3 text-gray-400" />
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
            <Calendar className="h-3 w-3" />
            <span>Planted {formatDate(idea.created_at)}</span>
          </div>
        </div>

        {/* Growth indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className={`h-full ${theme.color.replace("text-", "bg-")} transition-all duration-300`}
            style={{
              width: idea.status === "seedling" ? "33%" : idea.status === "growing" ? "66%" : "100%",
            }}
          />
        </div>
      </div>
    </Link>
  )
}
