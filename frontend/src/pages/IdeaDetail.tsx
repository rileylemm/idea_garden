"use client"

import type React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Tag, Edit, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { apiService, type Idea, type Document } from "../services/api"
import { getPlantTheme, getStageIcon } from "../utils/themeUtils"
import { RelatedIdeas } from "../components/RelatedIdeas"
import { DocumentsSection } from "../components/DocumentsSection"
import { ActionPlanSection } from "../components/ActionPlanSection"
import { EditIdeaModal } from "../components/EditIdeaModal"
import { ProjectOverviewChat } from "../components/ProjectOverviewChat"

export const IdeaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showActionPlan, setShowActionPlan] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProjectOverview, setShowProjectOverview] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const fetchedIdea = await apiService.getIdeaById(parseInt(id))
        setIdea(fetchedIdea)
        
        // Fetch documents for the idea
        try {
          const fetchedDocuments = await apiService.getDocumentsByIdeaId(parseInt(id))
          setDocuments(fetchedDocuments)
        } catch {
          console.log('No documents found for this idea')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch idea')
      } finally {
        setLoading(false)
      }
    }

    fetchIdea()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading idea...</h2>
        </div>
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Idea not found</h2>
          <p className="text-gray-600 mb-6">{error || "This idea might have been moved or doesn't exist."}</p>
          <Link
            to="/ideas"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Garden</span>
          </Link>
        </div>
      </div>
    )
  }

  const theme = getPlantTheme(idea.category || 'creative')
  const stageIcon = getStageIcon(idea.status)
  const createdAt = idea.created_at ? new Date(idea.created_at) : new Date()
  const updatedAt = idea.updated_at ? new Date(idea.updated_at) : new Date()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Garden</span>
      </button>

      {/* Idea Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Header Background */}
        <div className={`h-32 ${theme.bgColor} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="text-8xl absolute top-4 right-8">{theme.icon}</div>
            <div className="text-6xl absolute bottom-4 left-8 opacity-50">{stageIcon}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{theme.icon}</span>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${theme.bgColor} ${theme.color} capitalize`}
                >
                  {idea.category || 'creative'}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{stageIcon}</span>
                  <span className="text-sm text-gray-600 capitalize">{idea.status}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{idea.title}</h1>

              <p className="text-lg text-gray-600 mb-6">{idea.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-6">
              <button 
                onClick={() => setShowEditModal(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit idea"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Planted {createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Last tended {updatedAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Growth Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Growth Progress</span>
              <span className="text-sm text-gray-500 capitalize">{idea.status}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${theme.color.replace("text-", "bg-")}`}
                style={{
                  width: idea.status === "seedling" ? "33%" : idea.status === "growing" ? "66%" : "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Growth Actions */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">🌱 Help This Idea Grow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowDocuments(!showDocuments)}
            className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left"
          >
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-medium text-gray-900 mb-1">Add Research</h4>
            <p className="text-sm text-gray-600">
              {showDocuments ? 'Hide documents' : 'Gather more information and insights'}
            </p>
          </button>
          <button className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left">
            <div className="text-2xl mb-2">🔗</div>
            <h4 className="font-medium text-gray-900 mb-1">Connect Ideas</h4>
            <p className="text-sm text-gray-600">Link to related concepts</p>
          </button>
          <button 
            onClick={() => setShowProjectOverview(true)}
            className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-medium text-gray-900 mb-1">Generate Overview</h4>
            <p className="text-sm text-gray-600">Create project overview through AI chat</p>
          </button>
          <button 
            onClick={() => setShowActionPlan(!showActionPlan)}
            className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-medium text-gray-900 mb-1">Take Action</h4>
            <p className="text-sm text-gray-600">
              {showActionPlan ? 'Hide action plan' : 'Create an AI-powered action plan'}
            </p>
          </button>
        </div>
      </div>

      {/* Documents Section */}
      {showDocuments && idea.id && (
        <div className="mt-8">
          <DocumentsSection 
            ideaId={idea.id} 
            onContinueChat={(conversationId) => {
              // Open the project overview chat with the conversation
              setShowProjectOverview(true);
              // TODO: Load the conversation in the chat using conversationId
              console.log('Continue chat with conversation:', conversationId);
            }}
          />
        </div>
      )}

      {/* Action Plan Section */}
      {showActionPlan && idea.id && (
        <div className="mt-8">
          <ActionPlanSection 
            ideaId={idea.id}
            ideaTitle={idea.title}
            ideaDescription={idea.description}
            ideaCategory={idea.category}
            ideaContent={idea.content}
          />
        </div>
      )}

      {/* Detailed Content */}
      {idea.content && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Notes</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{idea.content}</p>
          </div>
        </div>
      )}

      {/* Related Ideas */}
      {idea.id && (
        <div className="mb-8">
          <RelatedIdeas ideaId={idea.id} limit={5} />
        </div>
      )}

      {/* Edit Modal */}
      <EditIdeaModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(updatedIdea) => {
          setIdea(updatedIdea);
          setShowEditModal(false);
        }}
        idea={idea}
      />

      {/* Project Overview Chat */}
      <ProjectOverviewChat
        isOpen={showProjectOverview}
        onClose={() => setShowProjectOverview(false)}
        idea={idea}
        documents={documents}
        onGenerateDocument={async (content, title) => {
          try {
            await apiService.createDocument(idea.id!, {
              title,
              content
            });
            // Refresh documents
            const updatedDocuments = await apiService.getDocumentsByIdeaId(idea.id!);
            setDocuments(updatedDocuments);
            setShowProjectOverview(false);
          } catch (error) {
            console.error('Failed to save project overview:', error);
          }
        }}
        conversationId={undefined} // TODO: Pass conversationId when continuing chat
      />
    </div>
  )
}
