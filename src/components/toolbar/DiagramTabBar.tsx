import React, { useState } from 'react';
import { 
  Plus, Copy, Trash2, Edit2, Check, MoreVertical, X,
  Layers, ArrowRightLeft, Radio, RefreshCw, Sparkles
} from 'lucide-react';
import { ProjectDiagram } from '../../types/project';
import { DiagramType } from '../../types/archify';

interface Props {
  diagrams: ProjectDiagram[];
  activeDiagramId: string;
  onSelectDiagram: (diagramId: string) => void;
  onAddDiagramClick: () => void;
  onDuplicateDiagram: (diagramId: string) => void;
  onDeleteDiagram: (diagramId: string) => void;
  onRenameDiagram: (diagramId: string, newTitle: string) => void;
}

const TYPE_ICONS: Record<DiagramType, { icon: string; badge: string; color: string }> = {
  architecture: { icon: '🌐', badge: 'Arch', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  workflow: { icon: '🤖', badge: 'Workflow', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  sequence: { icon: '🔐', badge: 'Sequence', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  dataflow: { icon: '⚡', badge: 'Dataflow', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  lifecycle: { icon: '🔄', badge: 'Lifecycle', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' }
};

export const DiagramTabBar: React.FC<Props> = ({
  diagrams,
  activeDiagramId,
  onSelectDiagram,
  onAddDiagramClick,
  onDuplicateDiagram,
  onDeleteDiagram,
  onRenameDiagram
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const startRename = (d: ProjectDiagram, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingId(d.id);
    setEditingTitle(d.title);
    setOpenMenuId(null);
  };

  const handleSaveRename = (d: ProjectDiagram) => {
    if (editingTitle.trim()) {
      onRenameDiagram(d.id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="h-10 bg-[#0d121f] border-b border-[#1e293b] px-3 flex items-center justify-between select-none z-15 overflow-x-auto no-scrollbar">
      {/* Tabs Container */}
      <div className="flex items-center gap-1.5 h-full py-1">
        {diagrams.map((d) => {
          const isActive = d.id === activeDiagramId;
          const isEditing = editingId === d.id;
          const meta = TYPE_ICONS[d.diagram_type] || TYPE_ICONS.architecture;
          const isMenuOpen = openMenuId === d.id;

          return (
            <div
              key={d.id}
              onClick={() => {
                if (!isActive) onSelectDiagram(d.id);
              }}
              onDoubleClick={(e) => startRename(d, e)}
              className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all text-xs font-medium relative group border ${
                isActive
                  ? 'bg-slate-900 border-sky-500/60 text-slate-100 shadow-md shadow-sky-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {/* Type Emoji Icon */}
              <span className="text-xs">{meta.icon}</span>

              {/* Title / Inline Rename Input */}
              {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="px-1.5 py-0.5 text-xs bg-slate-950 border border-sky-500 rounded text-white focus:outline-none w-28"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(d);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button
                    onClick={() => handleSaveRename(d)}
                    className="p-0.5 rounded bg-sky-500 text-slate-950"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="truncate max-w-[140px] font-semibold">
                  {d.title}
                </span>
              )}

              {/* Diagram Type Badge */}
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${meta.color}`}>
                {meta.badge}
              </span>

              {/* Actions Dropdown & Quick Delete on Hover */}
              {!isEditing && (
                <div className="flex items-center gap-0.5">
                  {diagrams.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete diagram "${d.title}"?`)) {
                          onDeleteDiagram(d.id);
                        }
                      }}
                      className="p-0.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Diagram"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : d.id);
                      }}
                      className={`p-0.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-opacity ${
                        isActive ? 'opacity-70 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>

                    {/* Context Menu Dropdown */}
                    {isMenuOpen && (
                      <div 
                        className="absolute top-full right-0 mt-1.5 w-36 bg-[#111726] border border-[#1e293b] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => startRename(d, e)}
                          className="w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3 text-sky-400" />
                          <span>Rename Tab</span>
                        </button>
                        <button
                          onClick={() => {
                            onDuplicateDiagram(d.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                          <span>Duplicate</span>
                        </button>
                        {diagrams.length > 1 && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete diagram "${d.title}"?`)) {
                                onDeleteDiagram(d.id);
                              }
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/20 rounded-lg flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Tab</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Diagram Button */}
        <button
          onClick={onAddDiagramClick}
          className="h-8 px-2.5 rounded-lg border border-dashed border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-all group"
          title="Add Diagram to Project"
        >
          <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform stroke-[2.5]" />
          <span>New View</span>
        </button>
      </div>

      {/* Right Indicator: Diagram Tabs Count */}
      <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
        <span>{diagrams.length} Diagram View{diagrams.length > 1 ? 's' : ''} in Project</span>
      </div>
    </div>
  );
};
