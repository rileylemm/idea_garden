"use client"

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Share2, Trash2 } from 'lucide-react';
import { Idea, Document } from '../services/api';
import { apiService } from '../services/api';
import { IdeaHeader } from '../components/IdeaHeader';
import { GrowthProgress } from '../components/GrowthProgress';
import { ResearchDocuments } from '../components/ResearchDocuments';
import { ActionSidebar } from '../components/ActionSidebar';

const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  const handleAction = async (action: string) => {
    if (!idea) return;

    try {
      switch (action) {
        case 'research':
          // This would typically open a document upload modal
          console.log('Research action - would open document upload');
          break;
        
        case 'connect':
          // This would show related ideas
          console.log('Connect action - would show related ideas');
          break;
        
        case 'overview':
          // Generate AI summary
          try {
            const summary = await apiService.generateSummary(idea.id!);
            console.log('AI Summary generated:', summary);
            // You could show this in a modal or update the UI
          } catch (error) {
            console.error('Error generating summary:', error);
          }
          break;
        
        case 'action':
          // This would open the action plan modal
          console.log('Action plan action - would open action plan modal');
          break;
        
        case 'suggest-tags':
          // Suggest tags using AI
          try {
            const tagSuggestions = await apiService.suggestTags(idea.id!);
            console.log('Tag suggestions:', tagSuggestions);
            // You could show this in a modal for user to accept/reject
          } catch (error) {
            console.error('Error suggesting tags:', error);
          }
          break;
        
        case 'improve-content':
          // Improve content using AI
          try {
            const improvements = await apiService.improveContent(idea.id!);
            console.log('Content improvements:', improvements);
            // You could show this in a modal for user to accept/reject
          } catch (error) {
            console.error('Error improving content:', error);
          }
          break;
        
        case 'research-suggestions':
          // Get research suggestions
          try {
            const suggestions = await apiService.getResearchSuggestions(idea.id!);
            console.log('Research suggestions:', suggestions);
            // You could show this in a modal or sidebar
          } catch (error) {
            console.error('Error getting research suggestions:', error);
          }
          break;
        
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
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

  const handleDeleteIdea = async () => {
    if (!idea || deleting) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this idea? This action cannot be undone.');
    if (!confirmed) return;
    
    setDeleting(true);
    try {
      await apiService.deleteIdea(idea.id!);
      navigate('/');
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('Failed to delete idea. Please try again.');
    } finally {
      setDeleting(false);
    }
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
            <button 
              onClick={handleDeleteIdea}
              disabled={deleting}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete idea"
            >
              <Trash2 className="w-4 h-4" />
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
