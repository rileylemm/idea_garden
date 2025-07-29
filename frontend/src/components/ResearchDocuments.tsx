import React from 'react';
import { FileText, Plus, Upload, Eye, Edit, Trash2, Star, Crown } from 'lucide-react';
import { Document } from '../services/api';
import { buttonStyles, cardStyles } from '../utils/designSystem';

interface ResearchDocumentsProps {
  documents: Document[];
  onViewDocument?: (doc: Document) => void;
  onEditDocument?: (doc: Document) => void;
  onDeleteDocument?: (doc: Document) => void;
  onUploadDocument?: () => void;
  onAddDocument?: () => void;
  onSetAsOverview?: (doc: Document) => void;
}

export const ResearchDocuments: React.FC<ResearchDocumentsProps> = ({
  documents,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onUploadDocument,
  onAddDocument,
  onSetAsOverview
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Research & Documents ({documents.length})</span>
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={onUploadDocument}
            className={`${buttonStyles.outline} flex items-center space-x-2`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload .md</span>
          </button>
          <button 
            onClick={onAddDocument}
            className={`${buttonStyles.primary} flex items-center space-x-2`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className={`${cardStyles.base} p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                {doc.is_overview && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    <Crown className="w-3 h-3" />
                    <span>Overview</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-1">
                {onSetAsOverview && !doc.is_overview && (
                  <button 
                    onClick={() => onSetAsOverview(doc)}
                    className="p-1 text-gray-400 hover:text-yellow-600"
                    title="Set as overview document"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => onViewDocument?.(doc)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onEditDocument?.(doc)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDeleteDocument?.(doc)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div 
              className="text-sm text-gray-600 mb-3 line-clamp-3 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => onViewDocument?.(doc)}
              title="Click to view full document"
            >
              {doc.content}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created {new Date(doc.created_at || '').toLocaleDateString()}</span>
              {doc.document_type === 'ai_generated' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">AI Generated</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 