interface CreateComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; category: string; projectId: string; renderType: string }) => void;
  projects: { id: string; name: string }[];
}

export function CreateComponentModal({
  isOpen,
  onClose,
  onCreate,
  projects,
}: CreateComponentModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const projectId = formData.get('projectId') as string;
    const renderType = formData.get('renderType') as string;

    if (!name.trim()) return;

    onCreate({ name: name.trim(), category, projectId, renderType });
    (e.target as HTMLFormElement).reset();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          minWidth: '360px',
          maxWidth: '90vw',
        }}
      >
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--text)',
            marginBottom: '1.25rem',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            letterSpacing: '0.05em',
          }}
        >
          CREATE COMPONENT
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="component-name"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--text)',
                marginBottom: '0.4rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              COMPONENT NAME *
            </label>
            <input
              type="text"
              name="name"
              id="component-name"
              required
              autoFocus
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.5rem 0.6rem',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="component-category"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--text)',
                marginBottom: '0.4rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              CATEGORY
            </label>
            <select
              name="category"
              id="component-category"
              defaultValue="island"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.5rem 0.6rem',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursor: 'pointer',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="static">static</option>
              <option value="island">island</option>
              <option value="dynamic">dynamic</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="component-project"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--text)',
                marginBottom: '0.4rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              PROJECT
            </label>
            <select
              name="projectId"
              id="component-project"
              defaultValue={projects[0]?.id || ''}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.5rem 0.6rem',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursor: 'pointer',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              {projects.length === 0 ? (
                <option value="">No projects available</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="render-type"
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: 'var(--text)',
                marginBottom: '0.4rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              RENDER TYPE
            </label>
            <select
              name="renderType"
              id="render-type"
              defaultValue="island"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.5rem 0.6rem',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursor: 'pointer',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="static">static</option>
              <option value="island">island</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.45rem 0.8rem',
                fontSize: '0.7rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              style={{
                background: 'var(--terminal-green)',
                border: '1px solid var(--border)',
                color: '#000',
                padding: '0.45rem 0.8rem',
                fontSize: '0.7rem',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursor: 'pointer',
              }}
            >
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
