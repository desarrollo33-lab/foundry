import { useState } from 'react';
import { useStudio } from './hooks/useStudio';
import { CodeEditor } from './CodeEditor';
import { Output } from './Output';
import { Chat } from './Chat';
import { CreateComponentModal } from './CreateComponentModal';
import './styles.css';

export function StudioIsland() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    code,
    language,
    isExecuting,
    result,
    messages,
    isStreaming,
    selectedTemplate,
    templates,
    components,
    projects,
    isSaving,
    setCode,
    setLanguage,
    setSelectedTemplate,
    execute,
    sendMessage,
    clearOutput,
    clearChat,
    saveComponent,
    createComponent,
deleteComponent,
    currentSuggestion,
    acceptSuggestion,
    rejectSuggestion,
  } = useStudio();

  return (
    <div className="studio-container">
      <CodeEditor
        code={code}
        language={language}
        selectedTemplate={selectedTemplate}
        templates={templates}
        components={components}
        onChange={setCode}
        onLanguageChange={setLanguage}
        onTemplateSelect={setSelectedTemplate}
        onSave={saveComponent}
        onDelete={deleteComponent}
      />
      
      <Output
        result={result}
        isExecuting={isExecuting}
        onClear={clearOutput}
      />
      
<Chat
        messages={messages}
        isStreaming={isStreaming}
        onSend={sendMessage}
        onClear={clearChat}
        currentSuggestion={currentSuggestion}
        onAcceptSuggestion={acceptSuggestion}
        onRejectSuggestion={rejectSuggestion}
      />
      
      {/* Floating action buttons */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 100,
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <button
          className="studio-btn primary"
          onClick={execute}
          disabled={isExecuting}
          style={{
            padding: '0.75rem 1.5rem',
          }}
        >
          <span className="studio-btn-icon">▶</span>
          {isExecuting ? 'RUNNING...' : 'RUN CODE'}
        </button>
        
        <button
          className="studio-btn"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isSaving}
          style={{
            padding: '0.75rem 1.5rem',
          }}
        >
          <span className="studio-btn-icon">+</span>
          NEW COMPONENT
        </button>
      </div>
      
      <CreateComponentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(data) => {
          createComponent(data);
          setIsCreateModalOpen(false);
        }}
        projects={projects}
      />
    </div>
  );
}
