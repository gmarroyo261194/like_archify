import React, { useState, useEffect } from 'react';
import { X, Check, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import { ArchifyDiagramIR } from '../../types/archify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diagramIR: ArchifyDiagramIR;
  onApplyJSON: (newIR: ArchifyDiagramIR) => void;
}

export const JsonEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  diagramIR,
  onApplyJSON
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(diagramIR, null, 2));
      setError(null);
    }
  }, [isOpen, diagramIR]);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
        throw new Error('Invalid Archify IR: missing "nodes" array.');
      }
      onApplyJSON(parsed);
      onClose();
    } catch (err: any) {
      setError(err.message || 'JSON Parse Error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl h-[80vh] bg-[#111726] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Archify Schema v2 JSON IR</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                2-Way Sync
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Edit the intermediate representation directly or copy into your Agent prompt
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-hidden flex flex-col">
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            className="flex-1 w-full bg-transparent text-slate-200 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Error Footer & Actions */}
        <div className="p-4 border-t border-[#1e293b] bg-[#0d121f] flex items-center justify-between">
          {error ? (
            <div className="flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Valid JSON format ready to apply to visual canvas
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-sky-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply to Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
