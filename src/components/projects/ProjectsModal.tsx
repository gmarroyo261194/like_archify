import React, { useState, useRef } from 'react';
import { 
  X, FolderOpen, Plus, Copy, Trash2, Download, Upload, 
  Search, Calendar, Layers, Sparkles, Check, Edit2, FileText
} from 'lucide-react';
import { ArchifyProject } from '../../types/project';
import { DiagramType } from '../../types/archify';
import { 
  getAllProjects, createNewProject, duplicateProject, 
  deleteProject, exportProjectToFile, importProjectFromFile 
} from '../../lib/storage/projectStorage';
import { 
  TEMPLATE_WEB_APP, TEMPLATE_WORKFLOW, TEMPLATE_SEQUENCE, 
  TEMPLATE_DATAFLOW, TEMPLATE_LIFECYCLE 
} from '../../lib/templates/defaultTemplates';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeProjectId: string;
  onSelectProject: (project: ArchifyProject) => void;
}

export const ProjectsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeProjectId,
  onSelectProject
}) => {
  const [projects, setProjects] = useState<ArchifyProject[]>(() => getAllProjects());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DiagramType>('architecture');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const refreshList = () => {
    setProjects(getAllProjects());
  };

  const handleOpen = (p: ArchifyProject) => {
    onSelectProject(p);
    onClose();
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    let tplIR = undefined;
    let finalType = newType;
    if (selectedTemplate === 'web') {
      tplIR = TEMPLATE_WEB_APP;
      finalType = 'architecture';
    } else if (selectedTemplate === 'workflow') {
      tplIR = TEMPLATE_WORKFLOW;
      finalType = 'workflow';
    } else if (selectedTemplate === 'sequence') {
      tplIR = TEMPLATE_SEQUENCE;
      finalType = 'sequence';
    } else if (selectedTemplate === 'dataflow') {
      tplIR = TEMPLATE_DATAFLOW;
      finalType = 'dataflow';
    } else if (selectedTemplate === 'lifecycle') {
      tplIR = TEMPLATE_LIFECYCLE;
      finalType = 'lifecycle';
    }

    const created = createNewProject(newTitle.trim(), finalType, tplIR);
    refreshList();
    setIsCreatingNew(false);
    setNewTitle('');
    onSelectProject(created);
    onClose();
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = duplicateProject(id);
    if (dup) {
      refreshList();
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (projects.length <= 1) {
      alert('Cannot delete the only remaining project.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      const remaining = getAllProjects();
      setProjects(remaining);
      if (id === activeProjectId && remaining.length > 0) {
        onSelectProject(remaining[0]);
      }
    }
  };

  const handleExport = (p: ArchifyProject, e: React.MouseEvent) => {
    e.stopPropagation();
    exportProjectToFile(p);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProjectFromFile(file);
      refreshList();
      onSelectProject(imported);
      onClose();
    } catch (err: any) {
      alert('Failed to import project: ' + err.message);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRename = (p: ArchifyProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(p.id);
    setEditingTitle(p.title);
  };

  const saveRename = (p: ArchifyProject) => {
    if (editingTitle.trim()) {
      p.title = editingTitle.trim();
      if (p.diagrams && p.diagrams.length > 0) {
        const activeDiag = p.diagrams.find(d => d.id === p.active_diagram_id) || p.diagrams[0];
        if (activeDiag) activeDiag.title = editingTitle.trim();
      }
      p.updated_at = new Date().toISOString();
      const all = getAllProjects();
      const idx = all.findIndex(item => item.id === p.id);
      if (idx >= 0) all[idx] = p;
      localStorage.setItem('archify_projects_v2', JSON.stringify(all));
      refreshList();
    }
    setEditingId(null);
  };

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.diagram_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl h-[85vh] bg-[#111726] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Project Management</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {projects.length} Saved
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Create, switch, organize, backup, and restore your system architecture projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Import .json</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => setIsCreatingNew(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Project</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-3.5 border-b border-[#1e293b] bg-slate-900/50 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
            {['all', 'architecture', 'workflow', 'dataflow', 'sequence', 'lifecycle'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  filterType === t
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* New Project Creator Drawer / Form */}
        {isCreatingNew && (
          <div className="p-4 bg-slate-900/90 border-b border-sky-500/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create New Project</span>
              </h4>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Payment Gateway Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Diagram Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DiagramType)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 capitalize"
                >
                  <option value="architecture">Architecture Map</option>
                  <option value="workflow">Workflow & Pipeline</option>
                  <option value="dataflow">Data Flow Stream</option>
                  <option value="sequence">Sequence Model</option>
                  <option value="lifecycle">State Lifecycle</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Starting Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="none">Blank Canvas</option>
                  <option value="web">🌐 3-Tier Web App (Architecture)</option>
                  <option value="workflow">🤖 AI Agent Cycle (Workflow)</option>
                  <option value="sequence">🔐 OAuth2 & JWT (Sequence)</option>
                  <option value="dataflow">⚡ Vector Pipeline (Dataflow)</option>
                  <option value="lifecycle">🔄 Order State Machine (Lifecycle)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-1">
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-sky-500/20"
              >
                Create & Open Project
              </button>
            </div>
          </div>
        )}

        {/* Projects Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5 content-start">
          {filtered.map((project) => {
            const isActive = project.id === activeProjectId;
            const isEditing = editingId === project.id;
            const diagrams = project.diagrams || [];
            const activeDiag = diagrams.find(d => d.id === project.active_diagram_id) || diagrams[0];
            const primaryType = activeDiag?.diagram_type || project.diagram_type || 'architecture';
            
            const totalNodes = diagrams.reduce((acc, d) => acc + (d.ir?.nodes?.length || 0), 0);
            const totalEdges = diagrams.reduce((acc, d) => acc + (d.ir?.edges?.length || 0), 0);

            const formattedDate = new Date(project.updated_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={project.id}
                onClick={() => handleOpen(project)}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-sky-500/10 border-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* Top Row: Type Badge + Diagram Count + Active Indicator */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-800 text-sky-400 border border-slate-700">
                        {primaryType}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800/60 text-slate-400 border border-slate-700/60">
                        {diagrams.length} View{diagrams.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {isActive ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 my-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs bg-slate-950 border border-sky-500 rounded text-white focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(project);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => saveRename(project)}
                        className="p-1 rounded bg-sky-500 text-slate-950 font-bold"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                        {project.title}
                      </h4>
                      <button
                        onClick={(e) => startRename(project, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
                        title="Rename Project"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Bottom Row: Stats & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      {totalNodes} nodes
                    </span>
                    <span>·</span>
                    <span>{totalEdges} connections</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicate(project.id, e)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleExport(project, e)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Export .json"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
