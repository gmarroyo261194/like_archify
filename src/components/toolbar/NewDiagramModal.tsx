import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { DiagramType, ArchifyDiagramIR } from '../../types/archify';
import { 
  TEMPLATE_WEB_APP, TEMPLATE_WORKFLOW, TEMPLATE_SEQUENCE, 
  TEMPLATE_DATAFLOW, TEMPLATE_LIFECYCLE 
} from '../../lib/templates/defaultTemplates';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddDiagram: (title: string, type: DiagramType, templateIR?: ArchifyDiagramIR) => void;
}

export const NewDiagramModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddDiagram
}) => {
  const [title, setTitle] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>('architecture');
  const [templateKey, setTemplateKey] = useState<string>('blank');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let tpl: ArchifyDiagramIR | undefined = undefined;
    if (templateKey === 'web') tpl = TEMPLATE_WEB_APP;
    if (templateKey === 'workflow') tpl = TEMPLATE_WORKFLOW;
    if (templateKey === 'sequence') tpl = TEMPLATE_SEQUENCE;
    if (templateKey === 'dataflow') tpl = TEMPLATE_DATAFLOW;
    if (templateKey === 'lifecycle') tpl = TEMPLATE_LIFECYCLE;

    onAddDiagram(title.trim(), diagramType, tpl);
    setTitle('');
    setTemplateKey('blank');
    onClose();
  };

  const handleTypeChange = (newType: DiagramType) => {
    setDiagramType(newType);
    // Suggest corresponding template
    if (newType === 'architecture') setTemplateKey('web');
    else if (newType === 'workflow') setTemplateKey('workflow');
    else if (newType === 'sequence') setTemplateKey('sequence');
    else if (newType === 'dataflow') setTemplateKey('dataflow');
    else if (newType === 'lifecycle') setTemplateKey('lifecycle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#111726] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-100">Add New Diagram Tab</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Diagram Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ingress & Auth Sequence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Diagram Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { type: 'architecture', label: 'Architecture', icon: '🌐' },
                { type: 'workflow', label: 'Workflow', icon: '🤖' },
                { type: 'sequence', label: 'Sequence', icon: '🔐' },
                { type: 'dataflow', label: 'Dataflow', icon: '⚡' },
                { type: 'lifecycle', label: 'Lifecycle', icon: '🔄' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleTypeChange(item.type as DiagramType)}
                  className={`p-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    diagramType === item.type
                      ? 'bg-sky-500/15 border-sky-500/50 text-sky-300 font-bold shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[10px] truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Starting Template
            </label>
            <select
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-sky-500 capitalize"
            >
              <option value="blank">Blank Canvas</option>
              <option value="web">🌐 3-Tier Web App (Architecture)</option>
              <option value="workflow">🤖 AI Agent Cycle (Workflow)</option>
              <option value="sequence">🔐 OAuth2 & JWT (Sequence)</option>
              <option value="dataflow">⚡ Vector Pipeline (Dataflow)</option>
              <option value="lifecycle">🔄 Order State Machine (Lifecycle)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Diagram</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
