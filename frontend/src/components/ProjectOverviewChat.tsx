import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, FileText, MessageSquare, Loader2, Check, Settings } from 'lucide-react';
import { Idea, Document } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ProjectOverviewChatProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea;
  documents: Document[];
  onGenerateDocument: (content: string) => void;
  conversationId: string;
}

interface DocumentDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

const DocumentDiff: React.FC<{ oldContent: string; newContent: string }> = ({ oldContent, newContent }) => {
  const [diff, setDiff] = useState<DocumentDiff>({ added: [], removed: [], modified: [] });

  useEffect(() => {
    // Simple diff implementation - in a real app, you'd use a proper diff library
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    // Simple comparison - this is a basic implementation
    for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
      if (i >= oldLines.length) {
        added.push(newLines[i]);
      } else if (i >= newLines.length) {
        removed.push(oldLines[i]);
      } else if (oldLines[i] !== newLines[i]) {
        modified.push(`Line ${i + 1}: "${oldLines[i]}" → "${newLines[i]}"`);
      }
    }

    setDiff({ added, removed, modified });
  }, [oldContent, newContent]);

  return (
    <div className="space-y-4">
      {diff.added.length > 0 && (
        <div>
          <h4 className="font-medium text-green-700 mb-2">Added Lines:</h4>
          <div className="bg-green-50 p-3 rounded">
            {diff.added.map((line, index) => (
              <div key={index} className="text-green-800 text-sm">+ {line}</div>
            ))}
          </div>
        </div>
      )}
      {diff.removed.length > 0 && (
        <div>
          <h4 className="font-medium text-red-700 mb-2">Removed Lines:</h4>
          <div className="bg-red-50 p-3 rounded">
            {diff.removed.map((line, index) => (
              <div key={index} className="text-red-800 text-sm">- {line}</div>
            ))}
          </div>
        </div>
      )}
      {diff.modified.length > 0 && (
        <div>
          <h4 className="font-medium text-yellow-700 mb-2">Modified Lines:</h4>
          <div className="bg-yellow-50 p-3 rounded">
            {diff.modified.map((line, index) => (
              <div key={index} className="text-yellow-800 text-sm">{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProjectOverviewChat: React.FC<ProjectOverviewChatProps> = ({
  isOpen,
  onClose,
  idea,
  documents,
  onGenerateDocument,
  conversationId
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
  const [modelProvider, setModelProvider] = useState<string>('openai');
  const [modelName, setModelName] = useState<string>('gpt-3.5-turbo');
  const [availableModels, setAvailableModels] = useState<{[key: string]: string[]}>({});
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      // Load conversation if it exists
      loadConversation();
    }
  }, [conversationId]);

  // Load available models and saved AI settings on component mount
  useEffect(() => {
    loadAvailableModels();
    loadAISettings();
  }, []);

  // Reload AI settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAISettings();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  const loadAvailableModels = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/chat/models');
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models || {});
      }
    } catch (error) {
      console.error('Error loading available models:', error);
    }
  };

  const loadAISettings = async () => {
    try {
      setLoadingSettings(true);
      const response = await fetch('http://localhost:4000/api/system/ai-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setModelProvider(data.data.provider || 'openai');
          setModelName(data.data.model || 'gpt-3.5-turbo');
        }
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const startConversation = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello! I'm here to help you explore and develop your idea: "${idea.title}". 

Let's start by understanding what you're trying to build. What's the core concept behind this project?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
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

    // Generate AI response
    await generateAIResponse(currentInput, [...messages, userMessage]);
  };

  const generateAIResponse = async (_userInput: string, conversationHistory: Message[]): Promise<string> => {
    try {
      // Call AI API with streaming
      const response = await callAI(conversationHistory);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Let me try again...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  const callAI = async (conversationHistory: Message[]): Promise<string> => {
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
          tone: selectedTone,
          model_provider: modelProvider,
          model_name: modelName
        }),
      });

      const reader = response.then(res => res.body?.getReader());
      const decoder = new TextDecoder();

      reader.then(reader => {
        if (!reader) {
          reject(new Error('No reader available'));
          return;
        }

        let aiResponse = '';
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: '',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);

        const readChunk = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              resolve(aiResponse);
              return;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  resolve(aiResponse);
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    aiResponse += parsed.content;
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === aiMessage.id 
                          ? { ...msg, content: aiResponse }
                          : msg
                      )
                    );
                  }
                } catch {
                  // Ignore parsing errors for incomplete chunks
                }
              }
            }

            readChunk();
          }).catch(reject);
        };

        readChunk();
      }).catch(reject);
    });
  };

  const generateFinalDocument = async () => {
    if (messages.length < 2) return;

    try {
      setIsGenerating(true);
      
      // Get template based on idea category
      const template = await getCategoryTemplate(idea.category || 'general');
      
      // Generate document with AI
      const documentContent = await generateDocumentWithAI(template);
      
      setGeneratedDocument(documentContent);
      setDocumentGenerated(true);
      setPreviousDocument(documentContent);
      
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryTemplate = async (category: string): Promise<string> => {
    try {
      const response = await fetch(`http://localhost:4000/api/chat/template/${category}`);
      if (response.ok) {
        const data = await response.json();
        return data.template || '';
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    }
    
    // Fallback template
    return `# {projectTitle}

## Overview
{description}

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Implementation
- Technical approach
- Timeline
- Resources needed

## Next Steps
- Immediate actions
- Short-term goals
- Long-term vision`;
  };

  const generateDocumentWithAI = async (template: string): Promise<string> => {
    console.log('Generating document with AI...', { template, messages: messages.length, idea, documents: documents.length, tone: selectedTone, model_provider: modelProvider, model_name: modelName });

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
        tone: selectedTone,
        model_provider: modelProvider,
        model_name: modelName
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate document');
    }

    const data = await response.json();
    return data.document || '';
  };

  const handleSaveDocument = () => {
    if (generatedDocument) {
      onGenerateDocument(generatedDocument);
      onClose();
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      const blob = new Blob([generatedDocument], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_overview.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const loadConversation = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/chat/conversation/${idea.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.conversation && data.conversation.length > 0) {
          setMessages(data.conversation);
        } else {
          startConversation();
        }
      } else {
        startConversation();
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      startConversation();
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
            {/* Model Settings */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowModelSettings(!showModelSettings)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <Settings className="w-4 h-4" />
                <span>AI Settings</span>
              </button>
            </div>

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

        {/* Model Settings Panel */}
        {showModelSettings && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
                <select
                  value={modelProvider}
                  onChange={(e) => {
                    setModelProvider(e.target.value);
                    // Reset model name to first available for the provider
                    const models = availableModels[e.target.value] || [];
                    setModelName(models[0] || '');
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loadingSettings}
                >
                  <option value="openai">OpenAI (Cloud)</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loadingSettings}
                >
                  {availableModels[modelProvider]?.map(model => (
                    <option key={model} value={model}>{model}</option>
                  )) || <option value="">No models available</option>}
                </select>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {modelProvider === 'openai' ?
                'Using OpenAI cloud API (requires API key)' :
                'Using local Ollama models (requires Ollama running)'
              }
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '60vh' }}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation to explore your idea</p>
                <button
                  onClick={startConversation}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Start Conversation
                </button>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isGenerating}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Document Generation */}
        {messages.length > 2 && !documentGenerated && (
          <div className="p-6 border-t bg-gray-50">
            <button
              onClick={generateFinalDocument}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Document...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Project Overview</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Generated Document */}
        {documentGenerated && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Document</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  {isEditing ? 'Preview' : 'Edit'}
                </button>
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  {showDiff ? 'Hide Diff' : 'Show Diff'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Download
                </button>
                <button
                  onClick={handleSaveDocument}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  Save
                </button>
              </div>
            </div>

            {showDiff && (
              <div className="mb-4 p-4 bg-white rounded border">
                <h4 className="font-medium mb-2">Document Changes</h4>
                <DocumentDiff oldContent={previousDocument} newContent={generatedDocument} />
              </div>
            )}

            <div className="bg-white rounded border p-4 max-h-96 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={generatedDocument}
                  onChange={(e) => setGeneratedDocument(e.target.value)}
                  className="w-full h-80 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edit your document..."
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{generatedDocument}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 