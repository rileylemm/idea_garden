import React, { useState, useEffect } from 'react';
import { FileText, Save, Edit, Eye } from 'lucide-react';
import { Document } from '../services/api';

interface DocumentViewerProps {
  document: Document;
  onSave: (content: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(document.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(document.content || '');
    setHasChanges(false);
  }, [document]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(e.target.value !== document.content);
  };

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setContent(document.content || '');
    setIsEditing(false);
    setHasChanges(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
            <p className="text-sm text-gray-500">
              Created {formatDate(document.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Content
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full min-h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                placeholder="Enter document content..."
                rows={20}
              />
            </div>
            {hasChanges && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  You have unsaved changes. Click Save to update the document.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {content ? (
              <div className="prose prose-gray max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {content}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No content available</p>
                <p className="text-sm text-gray-400 mt-2">Click Edit to add content</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 