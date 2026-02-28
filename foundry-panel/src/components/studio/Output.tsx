import type { ExecutionResult } from './hooks/useStudio';

interface OutputProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
  onClear: () => void;
}

export function Output({ result, isExecuting, onClear }: OutputProps) {
  const getStatusText = () => {
    if (isExecuting) return 'RUNNING';
    if (!result) return 'IDLE';
    return result.success ? 'SUCCESS' : 'ERROR';
  };

  const getStatusClass = () => {
    if (isExecuting) return 'running';
    if (!result) return '';
    return result.success ? 'success' : 'error';
  };

  const renderContent = () => {
    if (isExecuting) {
      return (
        <div className="studio-empty">
          <div className="studio-loading">Executing code...</div>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="studio-empty">
          <div className="studio-empty-icon">▶</div>
          <div>Run code to see output</div>
        </div>
      );
    }

    const lines: JSX.Element[] = [];

    // Stdout
    result.stdout.forEach((line, i) => {
      lines.push(
        <div key={`stdout-${i}`} className="studio-output-line stdout">
          {line}
        </div>
      );
    });

    // Stderr
    result.stderr.forEach((line, i) => {
      lines.push(
        <div key={`stderr-${i}`} className="studio-output-line stderr">
          {line}
        </div>
      );
    });

    // Result value
    if (result.output && !result.stdout.includes(result.output)) {
      lines.push(
        <div key="result" className="studio-output-line result">
          {result.output}
        </div>
      );
    }

    // Error
    if (result.error) {
      lines.push(
        <div key="error" className="studio-output-line error">
          Error: {result.error}
        </div>
      );
    }

    if (lines.length === 0) {
      lines.push(
        <div key="empty" className="studio-output-line" style={{ color: 'var(--text-dim)' }}>
          (no output)
        </div>
      );
    }

    return <>{lines}</>;
  };

  return (
    <div className="studio-output-panel">
      <div className="studio-output-header">
        <div className="studio-output-title">
          OUTPUT
        </div>
        <span className={`studio-output-status ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
      <div className="studio-output-content">
        {renderContent()}
      </div>
      {result && (
        <div className="studio-output-meta">
          <span>Exit code: {result.exitCode}</span>
          <span>{result.executionTimeMs}ms</span>
        </div>
      )}
    </div>
  );
}
