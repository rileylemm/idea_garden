import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, ExternalLink } from 'lucide-react';
import { apiService, type RelatedIdea } from '../services/api';
import { getPlantTheme, getStageIcon } from '../utils/themeUtils';

interface RelatedIdeasCardsProps {
  ideaId: number;
  limit?: number;
}

export const RelatedIdeasCards: React.FC<RelatedIdeasCardsProps> = ({ ideaId, limit = 3 }) => {
  const [relatedIdeas, setRelatedIdeas] = useState<RelatedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedIdeas = async () => {
      try {
        setLoading(true);
        const ideas = await apiService.getRelatedIdeas(ideaId, limit);
        setRelatedIdeas(ideas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related ideas');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedIdeas();
  }, [ideaId, limit]);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
          <div className="flex items-center space-x-1 ml-auto">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-500">AI-powered connections</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (relatedIdeas.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-500">No related ideas found yet</p>
          <p className="text-sm text-gray-400 mt-1">Create more ideas to discover connections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        <div className="flex items-center space-x-1 ml-auto">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-500">AI-powered connections</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedIdeas.map((relatedIdea) => {
          const theme = getPlantTheme(relatedIdea.category || 'creative');
          const stageIcon = getStageIcon(relatedIdea.status);
          const similarityPercentage = Math.round(relatedIdea.similarity * 100);

          return (
            <Link
              key={relatedIdea.idea_id}
              to={`/ideas/${relatedIdea.idea_id}`}
              className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{theme.icon}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{stageIcon}</span>
                    <span className="text-xs text-gray-500 capitalize">{relatedIdea.status}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-600">
                    {similarityPercentage}% match
                  </span>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {relatedIdea.title}
              </h4>

              {relatedIdea.description && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {relatedIdea.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${theme.bgColor} ${theme.color} capitalize`}
                  >
                    {relatedIdea.category || 'creative'}
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs">View</span>
                </div>
              </div>

              {/* Similarity progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Similarity</span>
                  <span>{similarityPercentage}%</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                    style={{ width: `${similarityPercentage}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Related ideas are found using AI semantic analysis of your idea's content
        </p>
      </div>
    </div>
  );
}; 