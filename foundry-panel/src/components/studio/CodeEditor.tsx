import Editor from '@monaco-editor/react';
import type { StudioTemplate, StudioComponent } from './hooks/useStudio';

interface CodeEditorProps {
  code: string;
  language: 'javascript' | 'typescript';
  selectedTemplate: string | null;
  templates: StudioTemplate[];
  components: StudioComponent[];
  onChange: (code: string) => void;
  onLanguageChange: (lang: 'javascript' | 'typescript') => void;
  onTemplateSelect: (id: string | null) => void;
  onSave?: () => void;
  onDelete?: () => void;
}

export function CodeEditor({ 
  code, 
  language, 
  selectedTemplate,
  templates,
  components,
  onChange, 
  onLanguageChange,
  onTemplateSelect,
  onSave,
  onDelete
}: CodeEditorProps) {
  const isDisabled = !selectedTemplate;
  const isSavedComponent = selectedTemplate 
    ? components.some(c => c.id === selectedTemplate)
    : false;

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this component?") && isSavedComponent) {
      onDelete();
    }
  };

  return (
    <div className="studio-editor-panel">
      <div className="studio-editor-header">
        <div className="studio-editor-title">
          CODE EDITOR
        </div>
        <div className="studio-editor-actions">
          <select
            value={selectedTemplate || ''}
            onChange={(e) => onTemplateSelect(e.target.value || null)}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.35rem 0.5rem',
              fontSize: '0.65rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              marginRight: '0.5rem',
              minWidth: '180px',
            }}
          >
            <option value="">Select Component...</option>
            
            {templates.length > 0 && (
              <optgroup label="Templates">
                {templates.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </optgroup>
            )}
            
            {components.length > 0 && (
              <optgroup label="Saved Components">
                {components.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} [{c.status}]
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <select 
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as 'javascript' | 'typescript')}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.35rem 0.5rem',
              fontSize: '0.7rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
          <button
            onClick={onSave}
            disabled={isDisabled}
            style={{
              background: isDisabled ? 'var(--bg)' : 'var(--terminal-green)',
              border: '1px solid var(--border)',
              color: isDisabled ? 'var(--text)' : '#000',
              padding: '0.35rem 0.6rem',
              fontSize: '0.65rem',
              fontFamily: 'inherit',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            💾 SAVE
          </button>
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={!isSavedComponent}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--status-red)',
                color: 'var(--status-red)',
                padding: '0.35rem 0.6rem',
                fontSize: '0.65rem',
                fontFamily: 'inherit',
                cursor: isSavedComponent ? 'pointer' : 'not-allowed',
                opacity: isSavedComponent ? 1 : 0.5,
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              🗑️ DELETE
            </button>
          )}
        </div>
      </div>
      <div className="studio-editor-wrapper">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 10 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
          }}
        />
      </div>
    </div>
  );
}
