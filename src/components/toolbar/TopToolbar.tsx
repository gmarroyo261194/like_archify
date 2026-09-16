import React, { useState } from 'react';
import { 
  Code2, Download, Moon, Sun, RotateCcw, 
  BookOpen, FolderOpen, Edit3, Check, Cloud,
  Sparkles, Layout
} from 'lucide-react';
import { PresetType, ThemeType, DiagramType } from '../../types/archify';

interface Props {
  projectTitle: string;
  onUpdateProjectTitle: (newTitle: string) => void;
  preset: PresetType;
  onChangePreset: (preset: PresetType) => void;
  theme: ThemeType;
  onToggleTheme: () => void;
  onOpenProjectsModal: () => void;
  onOpenJsonModal: () => void;
  onOpenExportModal: () => void;
  onOpenAIModal: () => void;
  onAutoLayout: () => void;
  onLoadTemplate: (templateKey: 'web' | 'workflow' | 'sequence' | 'dataflow' | 'lifecycle') => void;
  onResetCanvas: () => void;
  diagramType?: DiagramType;
  isSaving?: boolean;
}

export const TopToolbar: React.FC<Props> = ({
  projectTitle,
  onUpdateProjectTitle,
  preset,
  onChangePreset,
  theme,
  onToggleTheme,
  onOpenProjectsModal,
  onOpenJsonModal,
  onOpenExportModal,
  onOpenAIModal,
  onAutoLayout,
  onLoadTemplate,
  onResetCanvas,
  diagramType = 'architecture',
  isSaving = false
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(projectTitle);

  const handleSaveTitle = () => {
    if (titleValue.trim()) {
      onUpdateProjectTitle(titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 bg-[#111726]/95 border-b border-[#1e293b] px-4 flex items-center justify-between z-20 select-none">
      {/* Brand Logo & Project Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-sky-500/25">
          A
        </div>

        <button
          onClick={onOpenProjectsModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-sky-400 text-xs font-semibold transition-all group"
          title="Open Projects Manager"
        >
          <FolderOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Projects</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Project Title (Inline Editable) */}
        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className="px-2 py-1 text-xs bg-slate-900 border border-sky-500 rounded-lg text-white focus:outline-none max-w-[220px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 rounded bg-sky-500 text-slate-950"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => {
              setTitleValue(projectTitle);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1.5 cursor-pointer group py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors max-w-[260px]"
            title="Click to rename project"
          >
            <h1 className="text-sm font-bold text-slate-100 tracking-tight truncate group-hover:text-sky-300">
              {projectTitle}
            </h1>
            <Edit3 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        )}

        {/* Real-Time Auto-Save Indicator */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono pl-1">
          <Cloud className={`w-3 h-3 ${isSaving ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Saved'}</span>
        </div>
      </div>

      {/* Center Controls: AI Generator + Presets + Templates */}
      <div className="flex items-center gap-2">
        {/* AI Architect Action Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold shadow-md shadow-cyan-500/10 transition-all group"
          title="Generate Architecture with AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>AI Architect</span>
        </button>

        {/* Auto Layout Button */}
        <button
          onClick={onAutoLayout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          title="Auto-organize graph layout"
        >
          <Layout className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Auto Layout</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Preset Selector */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
          {(['signal-flow', 'blueprint', 'classic', 'minimal'] as PresetType[]).map((p) => (
            <button
              key={p}
              onClick={() => onChangePreset(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                preset === p
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Template Selector Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-all">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Templates</span>
          </button>
          <div className="absolute top-full left-0 mt-1 w-56 bg-[#111726] border border-[#1e293b] rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
            <button
              onClick={() => onLoadTemplate('web')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>🌐 3-Tier Web App</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Arch</span>
            </button>
            <button
              onClick={() => onLoadTemplate('workflow')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>🤖 AI Agent Cycle</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Workflow</span>
            </button>
            <button
              onClick={() => onLoadTemplate('sequence')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>🔐 OAuth2 & JWT</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Sequence</span>
            </button>
            <button
              onClick={() => onLoadTemplate('dataflow')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>⚡ Vector Dataflow</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Data</span>
            </button>
            <button
              onClick={() => onLoadTemplate('lifecycle')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>🔄 State Machine</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Life</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Actions: Code, Theme, Export */}
      <div className="flex items-center gap-2">
        {/* Reset Canvas */}
        <button
          onClick={onResetCanvas}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Clear Canvas"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        {/* View JSON IR */}
        <button
          onClick={onOpenJsonModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono font-medium transition-all"
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>JSON IR</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
