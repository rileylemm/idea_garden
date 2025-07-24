import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, FileText, MessageSquare, Loader2, Check, X } from 'lucide-react';
import { Idea, Document } from '../services/api';

interface DocumentDiffProps {
  oldDocument: string;
  newDocument: string;
  onAccept: () => void;
  onReject: () => void;
}

const DocumentDiff: React.FC<DocumentDiffProps> = ({ oldDocument, newDocument, onAccept, onReject }) => {
  const generateDiff = () => {
    const oldLines = oldDocument.split('\n');
    const newLines = newDocument.split('\n');
    const diff: JSX.Element[] = [];
    
    let i = 0, j = 0;
    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        // Unchanged line
        diff.push(
          <div key={`unchanged-${i}`} className="text-gray-700 bg-white">
            {oldLines[i]}
          </div>
        );
        i++;
        j++;
      } else if (j < newLines.length && (i >= oldLines.length || oldLines[i] !== newLines[j])) {
        // Added line
        diff.push(
          <div key={`added-${j}`} className="text-green-800 bg-green-100 border-l-4 border-green-500 pl-2">
            + {newLines[j]}
          </div>
        );
        j++;
      } else if (i < oldLines.length) {
        // Removed line
        diff.push(
          <div key={`removed-${i}`} className="text-red-800 bg-red-100 border-l-4 border-red-500 pl-2">
            - {oldLines[i]}
          </div>
        );
        i++;
      }
    }
    
    return diff;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Document Changes</h4>
        <div className="flex space-x-2">
          <button
            onClick={onAccept}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
          >
            <Check className="w-3 h-3" />
            <span>Accept</span>
          </button>
          <button
            onClick={onReject}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Reject</span>
          </button>
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1 text-xs font-mono">
        {generateDiff()}
      </div>
    </div>
  );
};

interface Message {
  id: string;
  type: 'ai' | 'user' | 'section';
  content: string;
  timestamp: Date;
  metadata?: {
    section?: string;
    pinned?: boolean;
    tone?: string;
  };
}

interface ProjectOverviewChatProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea;
  documents: Document[];
  onGenerateDocument: (content: string, title: string) => void;
}

export const ProjectOverviewChat: React.FC<ProjectOverviewChatProps> = ({
  isOpen,
  onClose,
  idea,
  documents,
  onGenerateDocument
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('warm');
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [previousDocument, setPreviousDocument] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startConversation();
    }
  }, [isOpen]);

  const startConversation = () => {
    const initialMessage: Message = {
      id: '1',
      type: 'ai',
      content: `Hey! Let's co-write your project doc for *${idea.title}*. 

I'm here to help you explore and shape this idea into something clear and compelling. Think of me as a creative partner who's genuinely curious about what you're building.

Let's start with the heart of it. What's the *feeling* behind this idea? What got you excited about it?`,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsGenerating(true);

    try {
      // Create AI message placeholder first
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Get AI response with streaming
      const updatedMessages = [...messages, userMessage];
      await generateAIResponse(currentInput, updatedMessages);
      
      // Let the conversation flow naturally - no automatic cutoff
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Let me try again...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIResponse = async (_userInput: string, conversationHistory: Message[]): Promise<string> => {
    try {
      // Call ChatGPT API with streaming
      const response = await callChatGPT(conversationHistory);
      return response;
    } catch (error) {
      console.error('Error calling AI:', error);
      return "I'm having trouble connecting right now. Let me try a different approach...";
    }
  };



  const callChatGPT = async (conversationHistory: Message[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      const response = fetch('http://localhost:4000/api/chat/project-overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          idea: idea,
          documents: documents,
          tone: selectedTone
        }),
      });

      response.then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to get AI response');
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        let fullResponse = '';
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  resolve(fullResponse);
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;
                    // Update the AI message in real-time
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (lastMessage && lastMessage.type === 'ai') {
                        lastMessage.content = fullResponse;
                      }
                      return newMessages;
                    });
                  }
                                 } catch {
                   // Ignore parsing errors for incomplete chunks
                 }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }).catch(reject);
    });
  };

    const generateFinalDocument = async () => {
    setIsGenerating(true);
    
    try {
      // Store previous document for diff comparison
      if (documentGenerated && generatedDocument) {
        setPreviousDocument(generatedDocument);
        setShowDiff(true);
      }
      
      // Get category-specific template from backend
      const category = idea.category?.toLowerCase() || 'general';
      const template = await getCategoryTemplate(category);
      
      // Generate document using ChatGPT
      const documentContent = await generateDocumentWithAI(template);
      setGeneratedDocument(documentContent);
      setDocumentGenerated(true);
    } catch (error) {
      console.error('Error generating document:', error);
      // Fallback to basic generation
      const documentContent = generateProjectDocument();
      setGeneratedDocument(documentContent);
      setDocumentGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryTemplate = async (category: string): Promise<string> => {
    try {
      const response = await fetch(`http://localhost:4000/api/chat/template/${category}`);
      if (!response.ok) {
        throw new Error('Failed to get template');
      }
      const data = await response.json();
      return data.template;
    } catch (error) {
      console.error('Error fetching template:', error);
      // Return a basic template as fallback
      return `# {projectTitle}

## Concept Overview
{description}

## Core Value
- What makes this project unique
- Target audience and user needs
- Key benefits and value proposition

## Implementation Approach
- How the project will be built
- Timeline and key milestones
- Resources and requirements

## Success Metrics
- Key performance indicators
- User engagement and satisfaction
- Project impact and outcomes

---

*Generated collaboratively on {date}. This is a living document.*`;
    }
  };

  const generateDocumentWithAI = async (template: string): Promise<string> => {
    console.log('Generating document with AI...', { template, messages: messages.length, idea, documents: documents.length, tone: selectedTone });
    
    const response = await fetch('http://localhost:4000/api/chat/generate-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        idea: idea,
        documents: documents,
        template: template,
        tone: selectedTone
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Document generation failed:', errorText);
      throw new Error(`Failed to generate document: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Document generated successfully:', data.document?.substring(0, 100) + '...');
    return data.document;
  };

  const generateProjectDocument = (): string => {
    const ideaTitle = idea.title;
    const today = new Date().toLocaleDateString();
    
    // Extract insights from the conversation
    const conversationInsights = extractConversationInsights();
    
    return `# ${ideaTitle}

## Concept Overview
${idea.description || 'A collaborative project overview and roadmap.'}

## Intent & Mood
${conversationInsights.intent}

## Who It's For
${conversationInsights.audience}

## What It Might Do
${conversationInsights.features}

## What Happens Next
- ${conversationInsights.nextSteps}
- ${conversationInsights.optionalIdeas}

---

*Written collaboratively on ${today}. This is a living document.*`;
  };

  const extractConversationInsights = () => {
    // Analyze the conversation to extract meaningful insights
    const userMessages = messages.filter(msg => msg.type === 'user').map(msg => msg.content.toLowerCase());
    // const aiMessages = messages.filter(msg => msg.type === 'ai').map(msg => msg.content.toLowerCase());
    
    // Extract intent from user responses
    let intent = "This project aims to create a meaningful digital experience that connects people through shared moments.";
    if (userMessages.some(msg => msg.includes('feeling') || msg.includes('excited'))) {
      intent = "This project aims to capture and share the emotional connection and joy that comes from thoughtful gestures.";
    }
    if (userMessages.some(msg => msg.includes('problem') || msg.includes('solve'))) {
      intent = "This project aims to solve a specific problem and make a positive impact on users' lives.";
    }
    
    // Extract audience from conversation
    let audience = "This is for people who want to share meaningful moments with friends and loved ones.";
    if (userMessages.some(msg => msg.includes('friend') || msg.includes('partner'))) {
      audience = "This is for friends and partners who want to share beautiful moments and thoughtful gestures.";
    }
    if (userMessages.some(msg => msg.includes('family') || msg.includes('loved'))) {
      audience = "This is for families and loved ones who want to stay connected through meaningful interactions.";
    }
    
    // Extract features from conversation
    let features = "- Core functionality based on user needs\n- User-friendly interface\n- Meaningful user experience";
    if (userMessages.some(msg => msg.includes('photo') || msg.includes('picture'))) {
      features = "- Photo capture and sharing capabilities\n- Digital bouquet creation\n- Easy sharing with friends";
    }
    if (userMessages.some(msg => msg.includes('app') || msg.includes('mobile'))) {
      features = "- Mobile app with intuitive interface\n- Cross-platform compatibility\n- Real-time sharing features";
    }
    
    // Extract next steps
    let nextSteps = "Build a prototype and test with users";
    if (userMessages.some(msg => msg.includes('technical') || msg.includes('platform'))) {
      nextSteps = "Define technical requirements and choose development platform";
    }
    if (userMessages.some(msg => msg.includes('design') || msg.includes('interface'))) {
      nextSteps = "Create detailed design mockups and user interface prototypes";
    }
    
    // Extract optional ideas
    let optionalIdeas = "Consider expanding to additional platforms and features";
    if (userMessages.some(msg => msg.includes('social') || msg.includes('community'))) {
      optionalIdeas = "Consider building a community around shared experiences";
    }
    if (userMessages.some(msg => msg.includes('ai') || msg.includes('smart'))) {
      optionalIdeas = "Consider adding AI-powered features for enhanced user experience";
    }
    
    return {
      intent,
      audience,
      features,
      nextSteps,
      optionalIdeas
    };
  };

  const handleSaveDocument = () => {
    if (generatedDocument) {
      onGenerateDocument(generatedDocument, `${idea.title} - Project Overview`);
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      const blob = new Blob([generatedDocument], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_overview.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold">Generate Project Overview</h2>
              <p className="text-sm text-gray-600">Let's flesh out your idea through conversation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Tone Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Tone:</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="warm">Warm</option>
                <option value="professional">Professional</option>
                <option value="playful">Playful</option>
                <option value="poetic">Poetic</option>
                <option value="analytical">Analytical</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {(
          <div className="p-6 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isGenerating}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isGenerating}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
              <button
                onClick={generateFinalDocument}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>{documentGenerated ? 'Regenerate Doc' : 'Generate Doc'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Document Preview */}
        {documentGenerated && generatedDocument && (
          <div className="p-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Project Overview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveDocument}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Save to Documents</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .md</span>
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isEditing ? 'View' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => {
                    setDocumentGenerated(false);
                    setGeneratedDocument('');
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Continue Chat</span>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {showDiff && previousDocument ? (
                <DocumentDiff 
                  oldDocument={previousDocument} 
                  newDocument={generatedDocument}
                  onAccept={() => setShowDiff(false)}
                  onReject={() => {
                    setGeneratedDocument(previousDocument);
                    setShowDiff(false);
                  }}
                />
              ) : isEditing ? (
                <textarea
                  value={generatedDocument}
                  onChange={(e) => setGeneratedDocument(e.target.value)}
                  className="w-full h-64 p-2 border border-gray-300 rounded text-sm font-mono resize-none"
                  placeholder="Edit your document here..."
                />
              ) : (
                <pre className="text-sm whitespace-pre-wrap font-mono">{generatedDocument}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 