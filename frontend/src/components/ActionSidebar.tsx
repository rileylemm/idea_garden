import React from 'react';
import { Lightbulb, Link as LinkIcon, FileText, Zap, Check, TrendingUp, Sprout } from 'lucide-react';
import { Idea } from '../services/api';
import { cardStyles } from '../utils/designSystem';

interface ActionSidebarProps {
  idea: Idea;
  onAction: (action: string) => void;
}

export const ActionSidebar: React.FC<ActionSidebarProps> = ({ idea, onAction }) => {
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

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <div className="sticky top-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="space-y-4">
          <button 
            onClick={() => onAction('research')}
            className={`${cardStyles.interactive} p-4 w-full text-left`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Add Research</h4>
                <p className="text-sm text-gray-600">Upload documents and notes</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onAction('connect')}
            className={`${cardStyles.interactive} p-4 w-full text-left`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <LinkIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Connect Ideas</h4>
                <p className="text-sm text-gray-600">Link to related concepts</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onAction('overview')}
            className={`${cardStyles.interactive} p-4 w-full text-left`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Generate Overview</h4>
                <p className="text-sm text-gray-600">Create project overview via AI</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onAction('action')}
            className={`${cardStyles.interactive} p-4 w-full text-left`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Take Action</h4>
                <p className="text-sm text-gray-600">Create AI-powered action plan</p>
              </div>
            </div>
          </button>
        </div>

        {/* Growth Progress */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-3">Growth Progress</h4>
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
      </div>
    </div>
  );
}; 