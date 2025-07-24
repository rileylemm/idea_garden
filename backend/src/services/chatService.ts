import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load .env file explicitly
dotenv.config({ override: true });

export interface ChatMessage {
  type: 'user' | 'ai' | 'section';
  content: string;
  timestamp: Date;
  metadata?: {
    section?: string;
    pinned?: boolean;
    tone?: string;
  };
}

export interface Idea {
  title: string;
  description?: string;
  category?: string;
  content?: string;
}

export interface Document {
  title: string;
  content?: string;
}

export class ChatService {
  private openai: OpenAI;

  constructor() {
    // Explicitly load the .env file and use that API key
    const path = require('path');
    const envPath = path.resolve(__dirname, '../../.env');
    const envConfig = require('dotenv').config({ path: envPath, override: true });
    
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('ChatService: Using API key starting with:', apiKey?.substring(0, 20) + '...');
    
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async streamProjectOverviewChat(
    messages: ChatMessage[], 
    idea: Idea, 
    documents: Document[], 
    res: any,
    tone: string = 'warm'
  ): Promise<void> {
    const systemPrompt = this.buildSystemPrompt(idea, documents, tone);
    const openAIMessages = this.formatMessagesForOpenAI(messages, systemPrompt, idea);

    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: openAIMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 500
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
      
    } catch (error) {
      console.error('OpenAI API error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
      res.end();
    }
  }

  private buildSystemPrompt(idea: Idea, documents: Document[], tone: string = 'warm'): string {
    const category = idea.category?.toLowerCase() || 'general';
    const categoryPrompt = this.getCategorySpecificPrompt(category);
    const tonePrompt = this.getToneSpecificPrompt(tone);
    
    return `You are a thoughtful creative assistant helping the user explore and grow an idea. Your goal is to help them collaboratively create a clear, compelling project overview.

Idea: ${idea.title}
Description: ${idea.description || 'No description provided'}
Category: ${idea.category || 'General'}
Content: ${idea.content || 'No additional content'}

Research Documents: ${this.summarizeDocuments(documents)}

${categoryPrompt}

${tonePrompt}

Be warm, curious, and genuinely interested in their idea. Ask thoughtful follow-up questions that help them explore and clarify their vision. When you have enough information, offer to generate a structured markdown document.

Keep responses conversational and natural, like you're having a real conversation.`;
  }

  private getCategorySpecificPrompt(category: string): string {
    const prompts: { [key: string]: string } = {
      'technology': `This is a technology project. Focus on:
- Technical architecture and implementation approach
- User experience and interface design
- Scalability and performance considerations
- Development timeline and milestones
- Technology stack and platform choices
- User adoption and market fit

Ask about technical challenges, user workflows, and how the technology serves the user's needs.`,

      'business': `This is a business project. Focus on:
- Market opportunity and target audience
- Revenue model and monetization strategy
- Competitive landscape and differentiation
- Business model and value proposition
- Growth strategy and scaling plans
- Key metrics and success indicators

Ask about market research, customer pain points, and business viability.`,

      'creative': `This is a creative project. Focus on:
- Artistic vision and creative direction
- Emotional impact and user experience
- Aesthetic choices and design philosophy
- Storytelling and narrative elements
- Audience engagement and connection
- Creative process and inspiration

Ask about the creative vision, emotional goals, and what makes this project unique artistically.`,

      'health': `This is a health/wellness project. Focus on:
- User health outcomes and benefits
- Safety and regulatory considerations
- Evidence-based approach and research
- Accessibility and inclusivity
- User behavior change and motivation
- Health impact measurement

Ask about health goals, user needs, and how the project improves wellbeing.`,

      'education': `This is an educational project. Focus on:
- Learning objectives and outcomes
- Target learners and their needs
- Educational methodology and approach
- Assessment and progress tracking
- Accessibility and learning styles
- Knowledge retention and application

Ask about learning goals, target audience, and educational impact.`,

      'social': `This is a social impact project. Focus on:
- Community needs and social problems
- Impact measurement and outcomes
- Stakeholder engagement and partnerships
- Sustainability and long-term viability
- Social change and advocacy
- Community building and connection

Ask about social goals, community needs, and desired impact.`,

      'general': `This is a general project. Focus on:
- Core concept and unique value
- Target audience and user needs
- Implementation approach and timeline
- Success metrics and goals
- Challenges and opportunities
- Growth and evolution potential

Ask about the core idea, user benefits, and what makes this project special.`
    };

    return prompts[category] || prompts['general'];
  }

  private getToneSpecificPrompt(tone: string): string {
    const tones: { [key: string]: string } = {
      'warm': 'Maintain a warm, encouraging, and supportive tone throughout the conversation.',
      'professional': 'Keep responses professional, structured, and business-focused.',
      'playful': 'Use a playful, creative, and lighthearted approach to the conversation.',
      'poetic': 'Respond with a poetic, artistic, and expressive style.',
      'analytical': 'Focus on analytical thinking, data-driven insights, and logical structure.',
      'casual': 'Use a casual, friendly, and relaxed conversational style.'
    };

    return tones[tone] || tones['warm'];
  }

  private summarizeDocuments(documents: Document[]): string {
    if (documents.length === 0) {
      return 'No research documents available.';
    }

    return documents.map(doc => {
      const summary = doc.content?.substring(0, 300) || 'No content available';
      return `📄 ${doc.title}: ${summary}${summary.length >= 300 ? '...' : ''}`;
    }).join('\n');
  }

  private getInitialAssistantMessage(idea: Idea): string {
    const category = idea.category?.toLowerCase() || 'general';
    
    const initialMessages: { [key: string]: string } = {
      'technology': `Hey! I'm excited to help you shape this tech project. I can see you're working on "${idea.title}". Let's start with what inspired this idea — what problem are you trying to solve, or what opportunity are you exploring?`,
      
      'business': `Hi there! I'm here to help you develop this business idea. "${idea.title}" sounds interesting! Let's start with the core concept — what's the business opportunity you're seeing, and who would be your ideal customer?`,
      
      'creative': `Hello! I love creative projects like "${idea.title}". Let's explore this together! What's the creative vision behind this? What feeling or experience are you hoping to create?`,
      
      'health': `Hi! I'm here to help you develop this health and wellness project. "${idea.title}" sounds meaningful! Let's start with the health goal — what positive change are you hoping to create for people?`,
      
      'education': `Hello! I'm excited to help you shape this educational project. "${idea.title}" sounds like it could make a real difference! Let's start with the learning goal — what knowledge or skills are you hoping to share?`,
      
      'social': `Hi there! I'm here to help you develop this social impact project. "${idea.title}" sounds like it could create positive change! Let's start with the social goal — what community need or issue are you addressing?`,
      
      'general': `Hey! I'm here to help you explore and shape this idea. "${idea.title}" sounds interesting! Let's start with what inspired you — what's the spark behind this project?`
    };

    return initialMessages[category] || initialMessages['general'];
  }

  private formatMessagesForOpenAI(messages: ChatMessage[], systemPrompt: string, idea: Idea): any[] {
    const baseMessages = [
      { role: 'system', content: systemPrompt },
      // Add dynamic initial assistant message based on category
      { role: 'assistant', content: this.getInitialAssistantMessage(idea) }
    ];

    // Add conversation messages, filtering out 'section' type messages
    const conversationMessages = messages
      .filter(msg => msg.type !== 'section')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    return [...baseMessages, ...conversationMessages];
  }

  getCategorySpecificDocumentTemplate(category: string): string {
    const templates: { [key: string]: string } = {
      'technology': `# {projectTitle}

## Concept Overview
{description}

## Technical Architecture
- Platform and technology stack
- System components and integrations
- Scalability and performance considerations

## User Experience
- Target user workflows
- Interface design and interactions
- User journey and key features

## Development Roadmap
- Phase 1: Core functionality
- Phase 2: Advanced features
- Phase 3: Optimization and scaling

## Technical Requirements
- Technology stack and tools
- Infrastructure and hosting
- Security and compliance needs

## Success Metrics
- User adoption and engagement
- Performance and reliability
- Technical debt and maintainability

---

*Generated collaboratively on {date}. This is a living document.*`,

      'business': `# {projectTitle}

## Concept Overview
{description}

## Market Opportunity
- Target market and audience
- Market size and growth potential
- Competitive landscape analysis

## Business Model
- Revenue streams and pricing
- Value proposition and differentiation
- Customer acquisition strategy

## Financial Projections
- Revenue model and projections
- Cost structure and profitability
- Funding requirements and timeline

## Growth Strategy
- Market expansion plans
- Partnership opportunities
- Scaling and operational considerations

## Success Metrics
- Revenue and profitability targets
- Customer acquisition and retention
- Market share and competitive position

---

*Generated collaboratively on {date}. This is a living document.*`,

      'creative': `# {projectTitle}

## Concept Overview
{description}

## Creative Vision
- Artistic direction and aesthetic
- Emotional impact and storytelling
- Creative process and inspiration

## Audience Experience
- How users will feel and engage
- Visual and sensory elements
- Narrative and storytelling approach

## Creative Elements
- Design philosophy and choices
- Artistic influences and references
- Unique creative features

## Production Approach
- Creative workflow and process
- Resources and collaboration needs
- Timeline and creative milestones

## Success Metrics
- Audience engagement and response
- Creative impact and recognition
- Artistic achievement and growth

---

*Generated collaboratively on {date}. This is a living document.*`,

      'health': `# {projectTitle}

## Concept Overview
{description}

## Health Impact
- User health outcomes and benefits
- Evidence-based approach
- Safety and regulatory considerations

## Target Users
- Health needs and pain points
- Accessibility and inclusivity
- User behavior and motivation

## Implementation Strategy
- Health intervention approach
- User engagement and retention
- Progress tracking and measurement

## Health Outcomes
- Specific health improvements
- Measurement and evaluation
- Long-term health impact

## Success Metrics
- Health outcome improvements
- User engagement and adherence
- Clinical or wellness impact

---

*Generated collaboratively on {date}. This is a living document.*`,

      'education': `# {projectTitle}

## Concept Overview
{description}

## Learning Objectives
- Educational goals and outcomes
- Target learners and their needs
- Knowledge and skill development

## Educational Approach
- Teaching methodology and pedagogy
- Learning experience design
- Assessment and progress tracking

## Learning Experience
- How learners will engage
- Interactive elements and activities
- Knowledge retention strategies

## Educational Impact
- Learning outcomes and achievements
- Accessibility and inclusivity
- Long-term educational value

## Success Metrics
- Learning outcomes and achievements
- User engagement and completion
- Educational impact and growth

---

*Generated collaboratively on {date}. This is a living document.*`,

      'social': `# {projectTitle}

## Concept Overview
{description}

## Social Impact
- Community needs and problems
- Social change and advocacy goals
- Impact measurement and outcomes

## Target Community
- Stakeholder needs and engagement
- Community building and connection
- Accessibility and inclusivity

## Implementation Strategy
- Community engagement approach
- Partnership and collaboration
- Sustainability and long-term viability

## Social Outcomes
- Specific social improvements
- Community impact and change
- Stakeholder benefits and value

## Success Metrics
- Social impact and outcomes
- Community engagement and participation
- Long-term social change

---

*Generated collaboratively on {date}. This is a living document.*`,

      'general': `# {projectTitle}

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

## User Experience
- How users will interact and benefit
- Key features and functionality
- User journey and engagement

## Growth Potential
- Future opportunities and expansion
- Challenges and opportunities
- Long-term vision and goals

## Success Metrics
- Key performance indicators
- User engagement and satisfaction
- Project impact and outcomes

---

*Generated collaboratively on {date}. This is a living document.*`
    };

    return templates[category] || templates['general'];
  }

  async generateDocumentWithAI(
    messages: ChatMessage[], 
    idea: Idea, 
    documents: Document[], 
    template: string,
    tone: string = 'warm'
  ): Promise<string> {
    console.log('ChatService: Generating document with AI...', { 
      messagesCount: messages.length, 
      ideaTitle: idea.title,
      documentsCount: documents.length,
      templateLength: template.length,
      tone 
    });
    
    const systemPrompt = this.buildDocumentGenerationPrompt(idea, documents, template, tone);
    const openAIMessages = this.formatMessagesForOpenAI(messages, systemPrompt, idea);
    
    console.log('ChatService: OpenAI messages prepared:', openAIMessages.length);

    try {
      console.log('ChatService: Calling OpenAI API...');
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = completion.choices[0]?.message?.content || 'Failed to generate document';
      console.log('ChatService: OpenAI response received, length:', result.length);
      return result;
    } catch (error) {
      console.error('ChatService: OpenAI API error:', error);
      throw new Error('Failed to generate document');
    }
  }

  private buildDocumentGenerationPrompt(idea: Idea, documents: Document[], template: string, tone: string): string {
    const category = idea.category?.toLowerCase() || 'general';
    const categoryPrompt = this.getCategorySpecificPrompt(category);
    const tonePrompt = this.getToneSpecificPrompt(tone);
    
    return `You are an expert project document writer. Your task is to generate a comprehensive project overview document based on a conversation and template.

IDEA: ${idea.title}
DESCRIPTION: ${idea.description || 'No description provided'}
CATEGORY: ${idea.category || 'General'}
CONTENT: ${idea.content || 'No additional content'}

RESEARCH DOCUMENTS: ${this.summarizeDocuments(documents)}

CONVERSATION CONTEXT: The user has had a detailed conversation about this project. Use the conversation history to inform your document generation.

TEMPLATE TO FOLLOW:
${template}

${categoryPrompt}

${tonePrompt}

INSTRUCTIONS:
1. Fill in the template with specific, detailed content based on the conversation
2. Replace placeholders like {projectTitle}, {description}, {date} with actual values
3. Use information from the conversation to make the document specific and actionable
4. Maintain the tone and style specified
5. Ensure the document is comprehensive and well-structured
6. Make it feel like a collaborative document that captures the essence of the conversation

  Generate a complete, professional project overview document.`;
  }

  async saveConversation(ideaId: number, messages: ChatMessage[], generatedDocument: string): Promise<string> {
    // For now, we'll just return a mock conversation ID
    // In a real implementation, this would save to a database
    const conversationId = `conv_${ideaId}_${Date.now()}`;
    console.log(`Saving conversation ${conversationId} for idea ${ideaId}`);
    console.log(`Messages: ${messages.length}, Document: ${generatedDocument.length} chars`);
    return conversationId;
  }

  async createAIGeneratedDocument(ideaId: number, title: string, content: string, conversationId: string): Promise<any> {
    // Import the DocumentService to create the document
    const { DocumentService } = await import('./documentService');
    const documentService = new DocumentService();
    
    const documentData = {
      title,
      content,
      document_type: 'ai_generated' as const,
      conversation_id: conversationId
    };
    
    const document = await documentService.createDocument(ideaId, documentData);
    console.log(`Created AI-generated document: ${document.id} for idea ${ideaId}`);
    
    // Create initial version for the document
    if (document.id) {
      try {
        const { DocumentVersionService } = await import('./documentVersionService');
        const versionService = new DocumentVersionService();
        
        await versionService.createInitialVersion(document.id, content, 'ai');
        console.log(`Created initial version for document: ${document.id}`);
      } catch (error) {
        console.error('Failed to create initial document version:', error);
        // Don't fail the document creation if versioning fails
      }
    }
    
    return document;
  }

  async loadConversation(ideaId: number): Promise<{ messages: ChatMessage[], generatedDocument: string } | null> {
    // For now, we'll return null (no saved conversation)
    // In a real implementation, this would load from a database
    console.log(`Loading conversation for idea ${ideaId}`);
    return null;
  }
}  