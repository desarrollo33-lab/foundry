import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, CodeSuggestion } from './hooks/useStudio';

interface ChatProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (message: string) => Promise<void>;
  onClear: () => void;
  currentSuggestion?: CodeSuggestion | null;
  onAcceptSuggestion?: (suggestion: CodeSuggestion) => void;
  onRejectSuggestion?: (suggestion: CodeSuggestion) => void;
}

export function Chat({ messages, isStreaming, onSend, onClear, currentSuggestion, onAcceptSuggestion, onRejectSuggestion }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    const message = input.trim();
    setInput('');
    await onSend(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderContent = (content: string) => {
    if (!content) return <span style={{ color: 'var(--text-dim)' }}>...</span>;
    
    // Simple markdown-like rendering for code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    const parts = content.split(codeBlockRegex);
    
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.slice(3, -3);
        return (
          <pre key={i}>
            <code>{code}</code>
          </pre>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="studio-chat-panel">
      <div className="studio-chat-header">
        <div className="studio-chat-title">
          CLAWBOT
        </div>
        {messages.length > 0 && (
          <button 
            className="studio-btn"
            onClick={onClear}
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.6rem' }}
          >
            CLEAR
          </button>
        )}
      </div>
      
      {currentSuggestion && (
        <div className="studio-suggestion">
          <div className="studio-suggestion-header">
            <span>CODE SUGGESTION</span>
          </div>
          <div className="studio-suggestion-explanation">
            {currentSuggestion.explanation}
          </div>
          <pre className="studio-suggestion-code">{currentSuggestion.code}</pre>
          <div className="studio-suggestion-actions">
            <button onClick={() => onRejectSuggestion?.(currentSuggestion)}>
              REJECT
            </button>
            <button className="accept" onClick={() => onAcceptSuggestion?.(currentSuggestion)}>
              ACCEPT
            </button>
          </div>
        </div>
      )}
      
      <div className="studio-chat-messages">
        {messages.length === 0 && !isStreaming ? (
          <div style={{ 
            color: 'var(--text-dim)', 
            fontSize: '0.7rem',
            textAlign: 'center',
            padding: '1rem' 
          }}>
            Ask ClawBot about your Astro components
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`studio-chat-message ${msg.role}`}>
                {msg.role === 'assistant' && <div className="chat-role-label">ClawBot</div>}
                <div className="chat-content">{renderContent(msg.content)}</div>
              </div>
            ))}
            {isStreaming && (
              <div className="studio-chat-message assistant">
                <div className="chat-role-label">ClawBot</div>
                <div className="chat-content chat-loading">
                  <span className="typing-indicator">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="studio-chat-input-area" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="studio-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your code..."
          rows={1}
          disabled={isStreaming}
        />
        <button 
          type="submit" 
          className="studio-btn primary"
          disabled={!input.trim() || isStreaming}
        >
          {isStreaming ? '...' : 'SEND'}
        </button>
      </form>
    </div>
  );
}
