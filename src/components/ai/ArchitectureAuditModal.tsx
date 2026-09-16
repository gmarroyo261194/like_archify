import React, { useMemo } from 'react';
import { X, ShieldAlert, AlertTriangle, Info, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { ArchifyDiagramIR } from '../../types/archify';
import { lintArchitecture, LintIssue } from '../../lib/linter/architectureLinter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diagramIR: ArchifyDiagramIR;
  onHighlightNodes?: (nodeIds: string[]) => void;
}

export const ArchitectureAuditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  diagramIR,
  onHighlightNodes
}) => {
  const issues = useMemo(() => {
    if (!isOpen) return [];
    return lintArchitecture(diagramIR);
  }, [isOpen, diagramIR]);

  if (!isOpen) return null;

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-slate-100 max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1e293b] bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white ${
              errorCount > 0
                ? 'bg-gradient-to-tr from-rose-500 to-red-600 shadow-rose-500/20'
                : warningCount > 0
                ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/20'
            }`}>
              {errorCount > 0 ? (
                <ShieldAlert className="w-5 h-5" />
              ) : warningCount > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Architecture Health & Security Audit
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-mono">
                  Linter
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Static validation of Clean Architecture, security boundaries, and reliability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-400 font-medium">Errors:</span>
            <span className="font-bold text-rose-400 font-mono">{errorCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-400 font-medium">Warnings:</span>
            <span className="font-bold text-amber-400 font-mono">{warningCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-slate-400 font-medium">Suggestions:</span>
            <span className="font-bold text-sky-400 font-mono">{infoCount}</span>
          </div>
          <div className="ml-auto text-[11px] text-slate-500 font-mono">
            {diagramIR.nodes?.length || 0} nodes · {diagramIR.edges?.length || 0} connections audited
          </div>
        </div>

        {/* Findings List */}
        <div className="p-6 space-y-3 overflow-y-auto flex-1">
          {issues.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-emerald-300">Clean Architecture Verified!</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                No anti-patterns, missing gateway boundaries, or orphan nodes detected in this diagram.
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  issue.severity === 'error'
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/70'
                    : issue.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/70'
                    : 'bg-sky-950/20 border-sky-500/40 hover:border-sky-500/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {issue.severity === 'error' && <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                    {issue.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                    {issue.severity === 'info' && <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />}
                    <h5 className="font-bold text-slate-100 text-sm">{issue.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    issue.severity === 'error' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  }`}>
                    {issue.severity}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed">{issue.description}</p>

                <div className="pt-2 border-t border-slate-800/60 flex items-start gap-2 text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 font-medium">
                    <strong className="text-amber-300">Recommendation:</strong> {issue.recommendation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-time static architecture evaluator</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
