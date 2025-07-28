"use client"

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Share2 } from 'lucide-react';
import { Idea, Document } from '../services/api';
import { apiService } from '../services/api';
import { IdeaHeader } from '../components/IdeaHeader';
import { GrowthProgress } from '../components/GrowthProgress';
import { ResearchDocuments } from '../components/ResearchDocuments';
import { ActionSidebar } from '../components/ActionSidebar';

const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await apiService.getIdeaById(parseInt(id || '0'));
        setIdea(response);
        
        // Fetch documents
        const docsResponse = await apiService.getDocumentsByIdeaId(parseInt(id || '0'));
        setDocuments(docsResponse);
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIdea();
    }
  }, [id]);

  const handleAction = (action: string) => {
    console.log('Action triggered:', action);
    // Handle different actions
  };

  const handleViewDocument = (doc: Document) => {
    console.log('View document:', doc);
    // Handle document viewing
  };

  const handleEditDocument = (doc: Document) => {
    console.log('Edit document:', doc);
    // Handle document editing
  };

  const handleDeleteDocument = (doc: Document) => {
    console.log('Delete document:', doc);
    // Handle document deletion
  };

  const handleUploadDocument = () => {
    console.log('Upload document');
    // Handle document upload
  };

  const handleAddDocument = () => {
    console.log('Add document');
    // Handle adding new document
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Idea not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Garden</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{idea.category}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Idea Header */}
          <IdeaHeader idea={idea} />

          {/* Growth Progress - Added above research docs as requested */}
          <GrowthProgress idea={idea} />

          {/* Research Documents */}
          <ResearchDocuments 
            documents={documents}
            onViewDocument={handleViewDocument}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            onUploadDocument={handleUploadDocument}
            onAddDocument={handleAddDocument}
          />
        </div>

        {/* Sidebar Actions */}
        <ActionSidebar idea={idea} onAction={handleAction} />
      </div>
    </div>
  );
};

export default IdeaDetail;
