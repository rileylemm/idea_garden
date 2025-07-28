import React from 'react';
import { Check, TrendingUp, Sprout } from 'lucide-react';
import { Idea } from '../services/api';

interface GrowthProgressProps {
  idea: Idea;
}

export const GrowthProgress: React.FC<GrowthProgressProps> = ({ idea }) => {
  const getProgressPercentage = () => {
    switch (idea.status) {
      case 'seedling':
        return 33;
      case 'growing':
        return 66;
      case 'mature':
        return 100;
      default:
        return 33;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'seedling':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'growing':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'mature':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      default:
        return <Check className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'seedling':
        return 'bg-green-500';
      case 'growing':
        return 'bg-blue-500';
      case 'mature':
        return 'bg-emerald-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Growth Progress</span>
        <span className="text-sm text-gray-500 capitalize">{idea.status}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(idea.status)}`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Seedling</span>
          {idea.status === 'seedling' ? (
            getStatusIcon('seedling')
          ) : (
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Growing</span>
          {idea.status === 'growing' ? (
            getStatusIcon('growing')
          ) : (
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Mature</span>
          {idea.status === 'mature' ? (
            getStatusIcon('mature')
          ) : (
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}; 