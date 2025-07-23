import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp } from 'lucide-react';
import { apiService, type RelatedIdea } from '../services/api';
import { getPlantTheme, getStageIcon } from '../utils/themeUtils';

interface RelatedIdeasProps {
  ideaId: number;
  limit?: number;
}

export const RelatedIdeas: React.FC<RelatedIdeasProps> = ({ ideaId, limit = 5 }) => {
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Finding connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (relatedIdeas.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-500">No related ideas found yet</p>
          <p className="text-sm text-gray-400 mt-1">Create more ideas to discover connections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Related Ideas</h3>
        <div className="flex items-center space-x-1 ml-auto">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-500">AI-powered connections</span>
        </div>
      </div>

      <div className="space-y-4">
        {relatedIdeas.map((relatedIdea) => {
          const theme = getPlantTheme(relatedIdea.category || 'creative');
          const stageIcon = getStageIcon(relatedIdea.status);
          const similarityPercentage = Math.round(relatedIdea.similarity * 100);

          return (
            <Link
              key={relatedIdea.idea_id}
              to={`/ideas/${relatedIdea.idea_id}`}
              className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{theme.icon}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg">{stageIcon}</span>
                      <span className="text-xs text-gray-500 capitalize">{relatedIdea.status}</span>
                    </div>
                    <div className="flex items-center space-x-1 ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-600">
                        {similarityPercentage}% match
                      </span>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {relatedIdea.title}
                  </h4>

                  {relatedIdea.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedIdea.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${theme.bgColor} ${theme.color} capitalize`}
                      >
                        {relatedIdea.category || 'creative'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${similarityPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Related ideas are found using AI semantic analysis of your idea's content
        </p>
      </div>
    </div>
  );
}; 