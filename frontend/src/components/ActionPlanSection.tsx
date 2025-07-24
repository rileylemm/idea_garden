import React, { useState, useEffect } from 'react';
import { Plus, Target, Loader2 } from 'lucide-react';
import { ActionPlan, apiService, CreateActionPlanRequest } from '../services/api';
import { ActionPlanCard } from './ActionPlanCard';
import { ActionPlanModal } from './ActionPlanModal';

interface ActionPlanSectionProps {
  ideaId: number;
  ideaTitle: string;
  ideaDescription?: string;
  ideaCategory?: string;
  ideaContent?: string;
}

export const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({
  ideaId,
  ideaTitle,
  ideaDescription,
  ideaCategory,
  ideaContent
}) => {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [documents, setDocuments] = useState<Array<{ title: string; content?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchActionPlan();
    fetchDocuments();
  }, [ideaId]);

  const fetchActionPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const plan = await apiService.getActionPlanByIdeaId(ideaId);
      setActionPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch action plan');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const docs = await apiService.getDocumentsByIdeaId(ideaId);
      setDocuments(docs.map(doc => ({
        title: doc.title,
        content: doc.content
      })));
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleCreateActionPlan = async (actionPlanData: CreateActionPlanRequest) => {
    const newActionPlan = await apiService.createActionPlan(ideaId, actionPlanData);
    setActionPlan(newActionPlan);
    setIsModalOpen(false);
  };

  const handleEditActionPlan = async (actionPlanData: CreateActionPlanRequest) => {
    if (!actionPlan?.id) return;
    
    const updatedActionPlan = await apiService.updateActionPlan(ideaId, actionPlan.id, actionPlanData);
    setActionPlan(updatedActionPlan);
    setIsModalOpen(false);
  };

  const handleDeleteActionPlan = async (actionPlanId: number) => {
    try {
      await apiService.deleteActionPlan(ideaId, actionPlanId);
      setActionPlan(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete action plan');
    }
  };

  const handleSave = async (actionPlanData: CreateActionPlanRequest) => {
    if (actionPlan) {
      await handleEditActionPlan(actionPlanData);
    } else {
      await handleCreateActionPlan(actionPlanData);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading action plan...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Action Plan</h3>
            {actionPlan && (
              <span className="text-sm text-gray-500">(Generated)</span>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{actionPlan ? 'Regenerate Plan' : 'Create Action Plan'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {!actionPlan ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No action plan yet</h4>
            <p className="text-gray-600 mb-6">
              Create an AI-powered action plan to help you grow this idea into reality
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Target className="h-4 w-4" />
              <span>Create Your First Action Plan</span>
            </button>
          </div>
        ) : (
          <ActionPlanCard
            actionPlan={actionPlan}
            onEdit={() => setIsModalOpen(true)}
            onDelete={handleDeleteActionPlan}
          />
        )}
      </div>

      <ActionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        ideaId={ideaId}
        ideaTitle={ideaTitle}
        ideaDescription={ideaDescription}
        ideaCategory={ideaCategory}
        ideaContent={ideaContent}
        documents={documents}
      />
    </>
  );
}; 