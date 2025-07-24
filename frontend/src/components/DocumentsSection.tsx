import React, { useState, useEffect, useRef } from 'react';
import { Plus, FileText, Loader2, Upload } from 'lucide-react';
import { Document, apiService, CreateDocumentRequest, UpdateDocumentRequest } from '../services/api';
import { DocumentCard } from './DocumentCard';
import { DocumentEditor } from './DocumentEditor';
import { DocumentVersionModal } from './DocumentVersionModal';

interface DocumentsSectionProps {
  ideaId: number;
  onContinueChat?: (conversationId: string) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ ideaId, onContinueChat }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [ideaId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedDocuments = await apiService.getDocumentsByIdeaId(ideaId);
      setDocuments(fetchedDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = () => {
    setEditingDocument(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await apiService.deleteDocument(ideaId, documentId);
      await fetchDocuments(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleSaveDocument = async (documentData: CreateDocumentRequest | UpdateDocumentRequest) => {
    if (editorMode === 'create') {
      await apiService.createDocument(ideaId, documentData as CreateDocumentRequest);
    } else {
      if (!editingDocument?.id) throw new Error('Document ID is required for editing');
      await apiService.updateDocument(ideaId, editingDocument.id, documentData as UpdateDocumentRequest);
    }
    await fetchDocuments(); // Refresh the list
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingDocument(null);
  };

  const handleViewVersions = (documentId: number) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      setSelectedDocumentId(documentId);
      setSelectedDocumentTitle(document.title);
      setShowVersionModal(true);
    }
  };

  const handleCloseVersionModal = () => {
    setShowVersionModal(false);
    setSelectedDocumentId(null);
    setSelectedDocumentTitle('');
  };

  const handleQuickUpload = async (file: File) => {
    if (!file.name.endsWith('.md')) {
      setError('Please upload a .md file');
      return;
    }

    try {
      const content = await file.text();
      const title = file.name.replace('.md', '');
      
      await apiService.createDocument(ideaId, {
        title: title,
        content: content
      });
      
      await fetchDocuments(); // Refresh the list
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleQuickUpload(file);
    }
  };

  const handleQuickUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleQuickUpload(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Research & Documents</h3>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-500">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Research & Documents</h3>
            <span className="text-sm text-gray-500">({documents.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleQuickUploadClick}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Quick upload .md file"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload .md</span>
            </button>
            <button
              onClick={handleCreateDocument}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Document</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {documents.length === 0 ? (
          <div 
            className={`text-center py-12 border-2 border-dashed rounded-lg transition-colors ${
              isDragOver 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-4xl mb-4">📄</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h4>
            <p className="text-gray-600 mb-6">
              Add research, insights, and notes to help your idea grow
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCreateDocument}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Your First Document</span>
              </button>
              <div className="text-gray-400">or</div>
              <button
                onClick={handleQuickUploadClick}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload .md File</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              You can also drag and drop .md files here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onEdit={handleEditDocument}
                onDelete={handleDeleteDocument}
                onContinueChat={onContinueChat}
                onViewVersions={handleViewVersions}
              />
            ))}
          </div>
        )}
      </div>

              <DocumentEditor
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSave={handleSaveDocument}
          document={editingDocument}
          mode={editorMode}
        />
        
        {/* Hidden file input for quick upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Document Version Modal */}
        {selectedDocumentId && (
          <DocumentVersionModal
            isOpen={showVersionModal}
            onClose={handleCloseVersionModal}
            documentId={selectedDocumentId}
            documentTitle={selectedDocumentTitle}
          />
        )}
    </>
  );
}; 