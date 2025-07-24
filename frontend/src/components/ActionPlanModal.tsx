import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles } from 'lucide-react';
import { CreateActionPlanRequest } from '../services/api';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (actionPlanData: CreateActionPlanRequest) => Promise<void>;
  ideaId: number;
  ideaTitle: string;
  ideaDescription?: string;
  ideaCategory?: string;
  ideaContent?: string;
  documents?: Array<{ title: string; content?: string }>;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  // ideaId, // Unused parameter
  ideaTitle,
  // ideaDescription,
  // ideaCategory,
  // ideaContent,
  documents = []
}) => {
  const [step, setStep] = useState<'questions' | 'generating' | 'review'>('questions');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    timeline: '',
    vision: '',
    resources: '',
    constraints: '',
    priority: 5
  });
  const [generatedPlan, setGeneratedPlan] = useState<CreateActionPlanRequest | null>(null);

  // Initialize form data only when modal first opens
  useEffect(() => {
    if (isOpen) {
      // Only reset form data if all fields are empty (first time opening)
      if (!formData.timeline && !formData.vision && !formData.resources && !formData.constraints) {
        console.log('Initializing form data for first time');
        setFormData({
          timeline: '',
          vision: '',
          resources: '',
          constraints: '',
          priority: 5
        });
      } else {
        console.log('Preserving existing form data');
      }
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.timeline.trim() || !formData.vision.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('generating');

    try {
      // Construct the AI prompt (unused for now)
      // const prompt = constructAIPrompt();
      
      // For now, we'll create a basic action plan structure
      // In a real implementation, this would call an AI service
      const actionPlan: CreateActionPlanRequest = {
        title: `Action Plan for ${ideaTitle}`,
        content: await generateActionPlan(),
        timeline: formData.timeline,
        vision: formData.vision,
        resources: formData.resources,
        constraints: formData.constraints,
        priority: formData.priority
      };

      setGeneratedPlan(actionPlan);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate action plan');
      setStep('questions');
    } finally {
      setLoading(false);
    }
  };

  // const constructAIPrompt = () => {
  //   const documentsContent = documents
  //     .map(doc => `${doc.title}:\n${doc.content || ''}`)
  //     .join('\n\n');

  //   return `Create a highly specific and actionable plan for this idea. DO NOT generate generic business advice. Instead, analyze the research documents and create tasks that directly relate to the specific features, technical requirements, and business model described.

  // IDEA: ${ideaTitle}
  // DESCRIPTION: ${ideaDescription || 'No description provided'}
  // CATEGORY: ${ideaCategory || 'General'}
  // CONTENT: ${ideaContent || 'No additional content'}

  // RESEARCH DOCUMENTS:
  // ${documentsContent || 'No research documents available'}

  // USER GOALS:
  // - Timeline: ${formData.timeline}
  // - Vision: ${formData.vision}
  // - Resources: ${formData.resources || 'Not specified'}
  // - Constraints: ${formData.constraints || 'None mentioned'}
  // - Priority: ${formData.priority}/10

  // CRITICAL REQUIREMENTS:
  // 1. Analyze the research documents thoroughly and extract specific features, technical requirements, and business details
  // 2. Create tasks that directly implement the features described in the research
  // 3. Include specific technical tasks (e.g., "Implement geolocation API for flower tagging", "Build flower identification AI integration")
  // 4. Reference specific features from the research (e.g., "Create Flowerdex collection system", "Build bouquet creation interface")
  // 5. Include business development tasks based on the monetization strategy described
  // 6. Address the specific constraints mentioned by the user
  // 7. Create measurable milestones that align with the timeline

  // Please create a detailed, step-by-step action plan with:
  // 1. SPECIFIC technical implementation tasks based on the research
  // 2. Feature development tasks that directly relate to the documented features
  // 3. Business development tasks based on the monetization strategy
  // 4. User research and validation tasks
  // 5. Technical architecture and infrastructure tasks
  // 6. Marketing and launch preparation tasks

  // Format as a structured checklist with clear priorities. Each task should be specific enough that someone could execute it immediately.`;
  // };

  const generateActionPlan = async (): Promise<string> => {
    // Simulate AI generation with a structured response
    // In a real implementation, this would call OpenAI or another AI service
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    // Check if we have research documents to incorporate
    const hasResearch = documents.length > 0;
    
    if (hasResearch) {
      // Extract specific features from the research documents
      const researchContent = documents[0]?.content || '';
      const features = extractFeaturesFromResearch(researchContent);
      
      return `# Action Plan for ${ideaTitle}

## Phase 1: Technical Foundation (Weeks 1-4)
${features.map(feature => `- [ ] ${feature}`).join('\n')}

## Phase 2: Core Feature Development (Weeks 5-12)
${generateFeatureTasks(researchContent)}

## Phase 3: Business & Monetization (Weeks 13-16)
${generateBusinessTasks(researchContent)}

## Phase 4: Launch Preparation (Weeks 17-20)
- [ ] Final testing and quality assurance
- [ ] Launch and gather initial feedback
- [ ] Iterate based on real-world usage
- [ ] Scale successful elements

## Success Metrics:
- Timeline adherence: ${formData.timeline}
- Feature completion rate
- User engagement metrics
- Revenue generation from monetization features

## Next Immediate Actions:
1. Set up development environment and project structure
2. Create technical architecture documentation
3. Begin wireframing core user flows
4. Research and select technology stack
5. Set up version control and project management tools

## Risk Mitigation:
- Regular check-ins to address ${formData.constraints || 'potential challenges'}
- Flexible timeline to accommodate unexpected obstacles
- Backup plans for critical path items
- Continuous learning and adaptation approach

## Research Insights Incorporated:
Based on the uploaded research documents, this plan incorporates the following key insights:
${documents.map(doc => `- **${doc.title}**: ${doc.content?.substring(0, 150)}...`).join('\n')}`;
    } else {
      // Fallback to generic plan if no research documents
      return `# Action Plan for ${ideaTitle}

## Phase 1: Foundation (Weeks 1-2)
- [ ] Define clear success metrics and KPIs
- [ ] Research similar projects and learn from their experiences
- [ ] Create a detailed project timeline with milestones
- [ ] Identify and secure necessary resources (${formData.resources || 'time, budget, tools'})

## Phase 2: Planning & Preparation (Weeks 3-4)
- [ ] Break down the vision into specific, measurable goals
- [ ] Create a risk assessment and mitigation strategy
- [ ] Develop a resource allocation plan
- [ ] Set up tracking and monitoring systems

## Phase 3: Execution (Weeks 5-12)
- [ ] Begin implementation of core features
- [ ] Regular progress reviews and adjustments
- [ ] Address challenges as they arise
- [ ] Track metrics and adjust strategy as needed

## Phase 4: Launch & Optimization (Weeks 13-16)
- [ ] Final testing and quality assurance
- [ ] Launch and gather initial feedback
- [ ] Iterate based on real-world usage
- [ ] Scale successful elements

## Success Metrics:
- Timeline adherence: ${formData.timeline}
- Resource utilization efficiency
- Goal achievement rate
- User satisfaction scores

## Next Immediate Actions:
1. Schedule a planning session within the next 3 days
2. Create a detailed project charter
3. Identify key stakeholders and team members
4. Set up project management tools and systems

## Risk Mitigation:
- Regular check-ins to address ${formData.constraints || 'potential challenges'}
- Flexible timeline to accommodate unexpected obstacles
- Backup plans for critical path items
- Continuous learning and adaptation approach`;
    }
  };

  const extractFeaturesFromResearch = (content: string): string[] => {
    const features: string[] = [];
    
    if (content.includes('geolocation')) {
      features.push('Set up geolocation API integration for flower tagging');
    }
    if (content.includes('AI') || content.includes('identification')) {
      features.push('Research and integrate flower identification AI service');
    }
    if (content.includes('Flowerdex') || content.includes('collection')) {
      features.push('Design and implement user flower collection system');
    }
    if (content.includes('bouquet')) {
      features.push('Create bouquet building interface and sharing system');
    }
    if (content.includes('social') || content.includes('sharing')) {
      features.push('Implement social features and friend connection system');
    }
    if (content.includes('gamification') || content.includes('badges')) {
      features.push('Design gamification system with badges and achievements');
    }
    if (content.includes('monetization') || content.includes('premium')) {
      features.push('Plan premium features and monetization strategy');
    }
    
    return features.length > 0 ? features : ['Set up basic project structure and development environment'];
  };

  const generateFeatureTasks = (content: string): string => {
    const tasks: string[] = [];
    
    if (content.includes('Explore & Capture')) {
      tasks.push('- [ ] Implement camera integration with photo capture');
      tasks.push('- [ ] Build geolocation tagging system for flower photos');
      tasks.push('- [ ] Create flower identification feature (AI or manual)');
    }
    
    if (content.includes('Collect & Catalog')) {
      tasks.push('- [ ] Design and build "Flowerdex" collection system');
      tasks.push('- [ ] Implement flower metadata storage and management');
      tasks.push('- [ ] Create rare flower discovery mechanics');
    }
    
    if (content.includes('Create Bouquets')) {
      tasks.push('- [ ] Build bouquet creation interface');
      tasks.push('- [ ] Implement flower combination and arrangement system');
      tasks.push('- [ ] Add personal message and theme features');
    }
    
    if (content.includes('Social & Sharing')) {
      tasks.push('- [ ] Implement friend connection system');
      tasks.push('- [ ] Build bouquet sharing and sending features');
      tasks.push('- [ ] Create social media integration');
    }
    
    if (content.includes('Gamification')) {
      tasks.push('- [ ] Design achievement and badge system');
      tasks.push('- [ ] Implement daily/weekly challenges');
      tasks.push('- [ ] Create seasonal event system');
    }
    
    return tasks.join('\n');
  };

  const generateBusinessTasks = (content: string): string => {
    const tasks: string[] = [];
    
    if (content.includes('Monetization')) {
      tasks.push('- [ ] Design premium bouquet frames and styles');
      tasks.push('- [ ] Plan special flower packs and rare unlocks');
      tasks.push('- [ ] Create sticker and font marketplace');
      tasks.push('- [ ] Implement in-app purchase system');
    }
    
    if (content.includes('Target Audience')) {
      tasks.push('- [ ] Conduct user research with nature lovers and walkers');
      tasks.push('- [ ] Validate concept with wellness communities');
      tasks.push('- [ ] Test with casual mobile gamers');
    }
    
    tasks.push('- [ ] Develop marketing strategy for launch');
    tasks.push('- [ ] Plan beta testing with target users');
    
    return tasks.join('\n');
  };

  const handleSave = async () => {
    if (!generatedPlan) return;
    
    setLoading(true);
    setError(null);

    try {
      await onSave(generatedPlan);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save action plan');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('questions');
    setGeneratedPlan(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {step === 'questions' && 'Create Action Plan'}
                {step === 'generating' && 'Generating Action Plan...'}
                {step === 'review' && 'Review Action Plan'}
              </h2>
              <p className="text-sm text-gray-500">
                {step === 'questions' && 'Answer a few questions to generate your personalized action plan'}
                {step === 'generating' && 'AI is analyzing your idea and creating a detailed plan'}
                {step === 'review' && 'Review and save your AI-generated action plan'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {step === 'questions' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Debug info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  Debug: Timeline="{formData.timeline}", Vision="{formData.vision}", Resources="{formData.resources}"
                </p>
              </div>
              
              {formData.timeline && formData.vision && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    Your previous answers have been preserved. You can modify them before regenerating the action plan.
                  </p>
                </div>
              )}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  What is your timeline for growing this plant? *
                </label>
                <input
                  type="text"
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 3 months, 1 year, ongoing project"
                  required
                />
              </div>

              <div>
                <label htmlFor="vision" className="block text-sm font-medium text-gray-700 mb-2">
                  What will your plant look like when it's fully grown? *
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your end goal and what success looks like..."
                  required
                />
              </div>

              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-2">
                  What resources do you have available?
                </label>
                <textarea
                  id="resources"
                  name="resources"
                  value={formData.resources}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Time, money, skills, tools, connections..."
                />
              </div>

              <div>
                <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-2">
                  What limitations or challenges do you anticipate?
                </label>
                <textarea
                  id="constraints"
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Budget limits, time constraints, skill gaps..."
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  How important is this idea to you? (1-10)
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} - {num <= 3 ? 'Low' : num <= 7 ? 'Medium' : 'High'} priority
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.timeline.trim() || !formData.vision.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Action Plan</span>
                </button>
              </div>
            </form>
          )}

          {step === 'generating' && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Action Plan</h3>
              <p className="text-gray-600">
                Analyzing your idea and research to create a personalized roadmap...
              </p>
            </div>
          )}

          {step === 'review' && generatedPlan && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Action Plan Generated!</h3>
                <p className="text-sm text-green-700">
                  Your AI-generated action plan is ready. Review it below and save when you're satisfied.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{generatedPlan.title}</h3>
                <div className="prose prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded-lg overflow-x-auto">
                    {generatedPlan.content}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setStep('questions');
                    setGeneratedPlan(null);
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Action Plan'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 