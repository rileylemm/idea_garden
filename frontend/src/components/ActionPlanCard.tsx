import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Target, Zap, X } from 'lucide-react';
import { ActionPlan } from '../services/api';

interface ActionPlanCardProps {
  actionPlan: ActionPlan;
  onEdit: (actionPlan: ActionPlan) => void;
  onDelete: (actionPlanId: number) => void;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ actionPlan, onEdit, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return 'text-blue-600 bg-blue-100';
    if (priority <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 3) return 'Low';
    if (priority <= 7) return 'Medium';
    return 'High';
  };

  const truncateContent = (content?: string, maxLength: number = 200) => {
    if (!content) return 'No content';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{actionPlan.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Created {formatDate(actionPlan.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(actionPlan.priority)}`}>
              {getPriorityLabel(actionPlan.priority)} Priority
            </span>
            <button
              onClick={() => onEdit(actionPlan)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit action plan"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(actionPlan.id!)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete action plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Timeline:</span>
              <p className="text-gray-600">{actionPlan.timeline}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Vision:</span>
              <p className="text-gray-600 line-clamp-2">{actionPlan.vision}</p>
            </div>
            {actionPlan.resources && (
              <div>
                <span className="font-medium text-gray-700">Resources:</span>
                <p className="text-gray-600 line-clamp-2">{actionPlan.resources}</p>
              </div>
            )}
            {actionPlan.constraints && (
              <div>
                <span className="font-medium text-gray-700">Constraints:</span>
                <p className="text-gray-600 line-clamp-2">{actionPlan.constraints}</p>
              </div>
            )}
          </div>

          {/* Action Plan Content */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Action Plan</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {truncateContent(actionPlan.content)}
              </p>
              
              {actionPlan.content && actionPlan.content.length > 200 && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-xs text-green-600 font-medium hover:text-green-700 transition-colors mt-2"
                >
                  Click to view full action plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Content Modal */}
      {showFullContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{actionPlan.title}</h2>
                  <p className="text-sm text-gray-500">Created {formatDate(actionPlan.created_at)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullContent(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Timeline</h3>
                    <p className="text-gray-600">{actionPlan.timeline}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Vision</h3>
                    <p className="text-gray-600">{actionPlan.vision}</p>
                  </div>
                  {actionPlan.resources && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Resources</h3>
                      <p className="text-gray-600">{actionPlan.resources}</p>
                    </div>
                  )}
                  {actionPlan.constraints && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Constraints</h3>
                      <p className="text-gray-600">{actionPlan.constraints}</p>
                    </div>
                  )}
                </div>

                {/* Action Plan Content */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-4">Action Plan</h3>
                  <div className="prose prose-gray max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      {actionPlan.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 