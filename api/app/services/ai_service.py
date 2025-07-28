import os
import json
import logging
from typing import List, Dict, Any, Optional, AsyncGenerator
from openai import OpenAI
import requests
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    idea: Dict[str, Any]
    documents: List[Dict[str, Any]]
    tone: str = "warm"
    model_provider: str = "openai"  # "openai" or "ollama"
    model_name: str = "gpt-3.5-turbo"  # For OpenAI, or model name for Ollama

class DocumentGenerationRequest(BaseModel):
    messages: List[Message]
    idea: Dict[str, Any]
    documents: List[Dict[str, Any]]
    template: str
    tone: str = "warm"
    model_provider: str = "openai"
    model_name: str = "gpt-3.5-turbo"

class AIService:
    def __init__(self):
        self.openai_client = None
        self.ollama_base_url = "http://localhost:11434"
        
        # Initialize OpenAI client if API key is available
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if openai_api_key:
            self.openai_client = OpenAI(api_key=openai_api_key)
        else:
            logger.warning("OpenAI API key not found. Cloud API features will be disabled.")
    
    def _build_system_prompt(self, idea: Dict[str, Any], documents: List[Dict[str, Any]], tone: str) -> str:
        """Build the system prompt for the AI conversation."""
        
        # Base system prompt
        system_prompt = f"""You are a thoughtful creative assistant helping the user explore and grow an idea. Your goal is to help them collaboratively create a clear, compelling project overview.

You already have access to the seed description, tags, and optionally research documents. Ask clarifying questions that help the user uncover what's important, unique, and exciting about the idea.

Keep it fun, flexible, and conversational. Once the idea is well-formed, help them generate a markdown (.md) document in a {tone} tone that fits their style.

Current project context:
- Title: {idea.get('title', 'Untitled')}
- Description: {idea.get('description', 'No description')}
- Category: {idea.get('category', 'General')}
- Tags: {', '.join([tag.get('name', '') for tag in idea.get('tags', [])])}
- Status: {idea.get('status', 'seedling')}"""

        # Add document context if available
        if documents:
            system_prompt += "\n\nResearch Documents:"
            for doc in documents:
                system_prompt += f"\n- {doc.get('title', 'Untitled')}: {doc.get('content', '')[:200]}..."

        return system_prompt
    
    def _build_document_prompt(self, messages: List[Message], idea: Dict[str, Any], template: str, tone: str) -> str:
        """Build the prompt for document generation."""
        
        # Extract conversation insights
        conversation_text = "\n".join([f"{msg.role}: {msg.content}" for msg in messages])
        
        prompt = f"""Based on the following conversation and project context, generate a comprehensive project overview document.

Project Context:
- Title: {idea.get('title', 'Untitled')}
- Description: {idea.get('description', 'No description')}
- Category: {idea.get('category', 'General')}
- Tags: {', '.join([tag.get('name', '') for tag in idea.get('tags', [])])}

Conversation History:
{conversation_text}

Template to follow:
{template}

Requirements:
- Use a {tone} tone throughout
- Fill in all template sections with relevant content from the conversation
- Make it feel natural and conversational
- Include specific details and insights from the discussion
- Format as clean markdown

Generate the complete document:"""

        return prompt
    
    async def chat_with_openai(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """Stream chat responses using OpenAI API."""
        if not self.openai_client:
            yield "Error: OpenAI API key not configured"
            return
        
        try:
            # Build system prompt
            system_prompt = self._build_system_prompt(request.idea, request.documents, request.tone)
            
            # Prepare messages for OpenAI
            messages = [{"role": "system", "content": system_prompt}]
            for msg in request.messages:
                messages.append({"role": msg.role, "content": msg.content})
            
            # Stream response from OpenAI
            stream = self.openai_client.chat.completions.create(
                model=request.model_name,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=1000
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            yield f"Error: {str(e)}"
    
    async def chat_with_ollama(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """Stream chat responses using Ollama API."""
        try:
            # Build system prompt
            system_prompt = self._build_system_prompt(request.idea, request.documents, request.tone)
            
            # Prepare messages for Ollama
            messages = [{"role": "system", "content": system_prompt}]
            for msg in request.messages:
                messages.append({"role": msg.role, "content": msg.content})
            
            # Stream response from Ollama
            url = f"{self.ollama_base_url}/api/chat"
            payload = {
                "model": request.model_name,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 1000
                }
            }
            
            response = requests.post(url, json=payload, stream=True)
            response.raise_for_status()
            
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line.decode('utf-8'))
                        if 'message' in data and 'content' in data['message']:
                            yield data['message']['content']
                    except json.JSONDecodeError:
                        continue
                        
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            yield f"Error: {str(e)}"
    
    async def generate_document_with_openai(self, request: DocumentGenerationRequest) -> str:
        """Generate a document using OpenAI API."""
        if not self.openai_client:
            raise Exception("OpenAI API key not configured")
        
        try:
            # Build document prompt
            prompt = self._build_document_prompt(request.messages, request.idea, request.template, request.tone)
            
            # Get response from OpenAI
            response = self.openai_client.chat.completions.create(
                model=request.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI document generation error: {e}")
            raise Exception(f"Document generation failed: {str(e)}")
    
    async def generate_document_with_ollama(self, request: DocumentGenerationRequest) -> str:
        """Generate a document using Ollama API."""
        try:
            # Build document prompt
            prompt = self._build_document_prompt(request.messages, request.idea, request.template, request.tone)
            
            # Get response from Ollama
            url = f"{self.ollama_base_url}/api/generate"
            payload = {
                "model": request.model_name,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 2000
                }
            }
            
            response = requests.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            return data.get('response', '')
            
        except Exception as e:
            logger.error(f"Ollama document generation error: {e}")
            raise Exception(f"Document generation failed: {str(e)}")
    
    async def stream_chat(self, request: ChatRequest) -> AsyncGenerator[str, None]:
        """Stream chat responses using the specified model provider."""
        if request.model_provider == "openai":
            async for chunk in self.chat_with_openai(request):
                yield chunk
        elif request.model_provider == "ollama":
            async for chunk in self.chat_with_ollama(request):
                yield chunk
        else:
            yield f"Error: Unsupported model provider '{request.model_provider}'"
    
    async def generate_document(self, request: DocumentGenerationRequest) -> str:
        """Generate a document using the specified model provider."""
        if request.model_provider == "openai":
            return await self.generate_document_with_openai(request)
        elif request.model_provider == "ollama":
            return await self.generate_document_with_ollama(request)
        else:
            raise Exception(f"Unsupported model provider '{request.model_provider}'")
    
    def get_available_models(self) -> Dict[str, List[str]]:
        """Get available models for each provider."""
        models = {
            "openai": [
                "gpt-3.5-turbo",
                "gpt-4",
                "gpt-4-turbo-preview"
            ],
            "ollama": [
                "llama2",
                "llama2:13b",
                "llama2:70b",
                "codellama",
                "mistral",
                "mixtral",
                "neural-chat",
                "vicuna"
            ]
        }
        
        # Check if Ollama is available
        try:
            response = requests.get(f"{self.ollama_base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if 'models' in data:
                    models["ollama"] = [model['name'] for model in data['models']]
        except:
            logger.warning("Ollama not available - using default model list")
        
        return models

# Global instance
ai_service = AIService() 