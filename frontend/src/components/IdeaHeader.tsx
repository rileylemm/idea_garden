import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Idea } from '../services/api';
import { getCategoryTheme, getStatusTheme } from '../utils/designSystem';

interface IdeaHeaderProps {
  idea: Idea;
}

export const IdeaHeader: React.FC<IdeaHeaderProps> = ({ idea }) => {
  const categoryTheme = getCategoryTheme(idea.category);
  const statusTheme = getStatusTheme(idea.status);
  const StatusIcon = statusTheme.icon;

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryTheme.bgColor} ${categoryTheme.color}`}>
              {idea.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusTheme.bgColor} ${statusTheme.color}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{idea.status}</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{idea.title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{idea.description}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Planted {new Date(idea.created_at || '').toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Last tended {new Date(idea.updated_at || '').toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {idea.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 