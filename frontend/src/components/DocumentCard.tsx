import React, { useState } from 'react';
import { FileText, Edit, Trash2, Calendar, X } from 'lucide-react';
import { Document } from '../services/api';

interface DocumentCardProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (documentId: number) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onEdit, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

  const truncateContent = (content?: string, maxLength: number = 150) => {
    if (!content) return 'No content';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const handleViewFullContent = () => {
    setShowFullContent(true);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{document.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(document.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(document)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit document"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(document.id!)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          {truncateContent(document.content)}
        </p>
        
        {document.content && document.content.length > 150 && (
          <button
            onClick={handleViewFullContent}
            className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            Click to view full content
          </button>
        )}
      </div>

      {/* Full Content Modal */}
      {showFullContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
                  <p className="text-sm text-gray-500">Created {formatDate(document.created_at)}</p>
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
              <div className="prose prose-gray max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {document.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 