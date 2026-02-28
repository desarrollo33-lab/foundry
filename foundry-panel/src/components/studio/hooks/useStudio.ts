import { useState, useCallback, useRef, useEffect } from 'react';
import { MCP_URL } from '../../../config';
import { useWebSocket } from './useWebSocket';

// Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  stdout: string[];
  stderr: string[];
  exitCode: number;
  executionTimeMs: number;
  error?: string;
}

export interface StudioTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  renderType: string;
}

export interface StudioComponent {
  id: string;
  name: string;
  project_id?: string;
  status: string;
  category?: string;
  renderType?: string;
  astro_code?: string;
  css_code?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface CodeSuggestion {
  id: string;
  code: string;
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface StudioState {
  code: string;
  language: 'javascript' | 'typescript';
  isExecuting: boolean;
  result: ExecutionResult | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  selectedTemplate: string | null;
  templates: StudioTemplate[];
  components: StudioComponent[];
}

export interface StudioActions {
  setCode: (code: string) => void;
  setLanguage: (lang: 'javascript' | 'typescript') => void;
  setSelectedTemplate: (id: string | null) => void;
  execute: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearOutput: () => void;
  clearChat: () => void;
}

export function useStudio(): StudioState & StudioActions {
  const [code, setCode] = useState<string>(`// STUDIO Playground
// Select a component template or saved component to edit

console.log('Hello, STUDIO!');
`);
  
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<StudioTemplate[]>([]);
  const [components, setComponents] = useState<StudioComponent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
const [wsSessionId, setWsSessionId] = useState<string | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState<CodeSuggestion | null>(null);

  // WebSocket integration
  const { isConnected, lastMessage, connect: connectWs, send: sendWs, disconnect: disconnectWs } = useWebSocket({
    sessionId: wsSessionId || undefined,
    onMessage: (data) => {
      // Handle incoming messages
      if (data.type === 'execute-result') {
        setResult({
          success: data.success,
          output: data.output,
          stdout: data.output ? [data.output] : [],
          stderr: [],
          exitCode: data.success ? 0 : 1,
          executionTimeMs: data.executionTimeMs,
        });
        setIsExecuting(false);
      } else if (data.type === 'chat-chunk') {
        // Append to last assistant message
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: last.content + data.content }];
          }
          return prev;
        });
      } else if (data.type === 'chat-done') {
        setIsStreaming(false);
} else if (data.type === 'error') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${data.message}`,
          timestamp: new Date(),
        }]);
        setIsStreaming(false);
      } else if (data.type === 'suggestion') {
        setCurrentSuggestion({
          id: data.id,
          code: data.code,
          explanation: data.explanation,
          status: 'pending',
        });
      }
    },
  });

  // Connect WebSocket on mount
  useEffect(() => {
    connectWs();
    return () => {
      disconnectWs();
    };
  }, []);

  // Fetch templates and components on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const templatesRes = await fetch(`${MCP_URL}/api/v1/components/templates`);
        if (templatesRes.ok) {
          const data = await templatesRes.json();
          setTemplates(data.results || []);
        }
      } catch (e) {
        console.error('Failed to fetch templates:', e);
      }

      try {
        const componentsRes = await fetch(`${MCP_URL}/api/v1/components`);
        if (componentsRes.ok) {
          const data = await componentsRes.json();
          setComponents(data.results || []);
        }
      } catch (e) {
        console.error('Failed to fetch components:', e);
      }

      try {
        const projectsRes = await fetch(`${MCP_URL}/api/v1/projects`);
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(data.results || []);
        }
      } catch (e) {
        console.error('Failed to fetch projects:', e);
      }
    }
    fetchData();
  }, []);

  // Transform a template to get actual code
  const transformTemplate = useCallback(async (template: StudioTemplate): Promise<string> => {
    try {
      const response = await fetch(`${MCP_URL}/api/v1/components/transform`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentName: template.name,
          projectId: 'studio-workspace',
          category: template.category,
          renderType: template.renderType,
          theme: {
            colors: {
              primary: '#3b82f6',
              secondary: '#6366f1',
              background: '#0f172a',
              surface: '#1e293b',
              text: '#f1f5f9'
            }
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.preview?.astroCode || data.preview?.cssCode || '// No code generated\n';
      }
    } catch (e) {
      console.error('Transform failed:', e);
    }
    return `// Template: ${template.name}\n// Category: ${template.category}\n// ${template.description}\n\n// Click "Transform" to generate code...\n`;
  }, []);

  const handleTemplateSelect = useCallback(async (templateId: string | null) => {
    if (!templateId) {
      setSelectedTemplate(null);
      return;
    }

    // Check if it's a template (starts with tpl_)
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      // Show loading while transforming
      setCode(`// Loading ${template.name} component...\n`);
      
      const transformedCode = await transformTemplate(template);
      setCode(transformedCode);
      return;
    }

    // Check if it's a saved component
    const component = components.find(c => c.id === templateId);
    if (component) {
      setSelectedTemplate(templateId);
      const componentCode = component.astro_code || component.css_code || '// No code available\n';
      setCode(componentCode);
      return;
    }
  }, [templates, components, transformTemplate]);

  const execute = useCallback(async () => {
    // Try WebSocket first if connected
    if (isConnected) {
      setIsExecuting(true);
      setResult(null);
      sendWs({ type: 'execute', code, language });
      // Note: result comes via onMessage callback
      return;
    }
    
    // Fallback to REST
    setIsExecuting(true);
    setResult(null);
    
    try {
      const response = await fetch(`${MCP_URL}/studio/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, timeout: 15000 }),
      });
      
      const data: ExecutionResult = await response.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        output: '',
        stdout: [],
        stderr: [],
        exitCode: 1,
        executionTimeMs: 0,
        error: err instanceof Error ? err.message : 'Execution failed',
      });
    } finally {
      setIsExecuting(false);
    }
  }, [code, language, isConnected, sendWs]);
  const sendMessage = useCallback(async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Try WebSocket first if connected
    if (isConnected) {
      setIsStreaming(true);
      sendWs({
        type: 'chat',
        message,
        context: `Current code:\n\`\`\`astro\n${code}\n\`\`\`\n`,
      });
      return;
    }
    
    // Fallback to REST
    setIsStreaming(true);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`${MCP_URL}/studio/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          context: `Current code in editor:\n\`\`\`astro\n${code}\n\`\`\``
        }),
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'chunk' && parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessageId 
                    ? { ...m, content: assistantContent }
                    : m
                ));
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return;
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Error: ${(err as Error).message}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsStreaming(false);
    }
  }, [code, isConnected, sendWs]);

  const clearOutput = useCallback(() => {
    setResult(null);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const saveComponent = useCallback(async () => {
    if (!selectedTemplate) return;
    
    const component = components.find(c => c.id === selectedTemplate);
    if (!component) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`${MCP_URL}/api/v1/components/${selectedTemplate}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ astro_code: code }),
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      const componentsRes = await fetch(`${MCP_URL}/api/v1/components`);
      if (componentsRes.ok) {
        const data = await componentsRes.json();
        setComponents(data.results || []);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [selectedTemplate, code, components]);

  const createComponent = useCallback(async (data: { name: string; category: string; projectId: string; renderType: string }) => {
    setIsSaving(true);
    try {
      const response = await fetch(`${MCP_URL}/api/v1/components`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentName: data.name,
          projectId: data.projectId,
          category: data.category,
          renderType: data.renderType,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create');
      
      const result = await response.json();
      
      const componentsRes = await fetch(`${MCP_URL}/api/v1/components`);
      if (componentsRes.ok) {
        const data = await componentsRes.json();
        setComponents(data.results || []);
      }
      
      if (result.component?.id) {
        setSelectedTemplate(result.component.id);
        setCode(result.component.astro_code || '');
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [code]);

const deleteComponent = useCallback(async () => {
    if (!selectedTemplate) return;
    
    const component = components.find(c => c.id === selectedTemplate);
    if (!component) return;
    
    try {
      const response = await fetch(`${MCP_URL}/api/v1/components/${selectedTemplate}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setSelectedTemplate(null);
      setCode('// Select a component or template to edit\n');
      
      const componentsRes = await fetch(`${MCP_URL}/api/v1/components`);
      if (componentsRes.ok) {
        const data = await componentsRes.json();
        setComponents(data.results || []);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [selectedTemplate, components]);

  const acceptSuggestion = useCallback((suggestion: CodeSuggestion) => {
    setCode(suggestion.code);
    setCurrentSuggestion(null);
    if (isConnected) {
      sendWs({ type: 'suggestion-accept', id: suggestion.id });
    }
  }, [setCode, isConnected, sendWs]);

  const rejectSuggestion = useCallback((suggestion: CodeSuggestion) => {
    setCurrentSuggestion(null);
    if (isConnected) {
      sendWs({ type: 'suggestion-reject', id: suggestion.id });
    }
  }, [isConnected, sendWs]);

  return {
    code,
    language,
    isExecuting,
    result,
    messages,
    isStreaming,
    selectedTemplate: selectedTemplate,
    templates,
    components,
    projects,
    selectedProject,
    isSaving,
    isWsConnected: isConnected,
    wsSessionId,
    setCode,
    setLanguage,
    setSelectedProject,
    execute,
    sendMessage,
    clearOutput,
    clearChat,
    createComponent,
    deleteComponent,
    currentSuggestion,
    acceptSuggestion,
rejectSuggestion,
  };
}
