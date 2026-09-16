import React, { useState } from 'react';
import { X, Download, FileCode, Image, Copy, Check, Share2, Sparkles, FolderArchive, Layers } from 'lucide-react';
import { ArchifyDiagramIR } from '../../types/archify';
import { ArchifyProject } from '../../types/project';
import { generateStandaloneHTML, generateProjectBundleHTML } from '../../lib/exporter/htmlExporter';
import { generateCleanSVG } from '../../lib/exporter/svgExporter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diagramIR: ArchifyDiagramIR;
  project?: ArchifyProject;
  onExportShareCard: () => void;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  diagramIR,
  project,
  onExportShareCard
}) => {
  const [copied, setCopied] = useState(false);
  const [exportScope, setExportScope] = useState<'active' | 'project'>('active');

  if (!isOpen) return null;

  const downloadHTML = () => {
    let html = '';
    let fileName = '';

    if (exportScope === 'project' && project) {
      html = generateProjectBundleHTML(project);
      fileName = `${project.title.toLowerCase().replace(/\s+/g, '-')}-project-bundle.html`;
    } else {
      html = generateStandaloneHTML(diagramIR);
      fileName = `${diagramIR.meta.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    }

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSVG = () => {
    const svg = generateCleanSVG(diagramIR);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramIR.meta.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    let jsonStr = '';
    let fileName = '';

    if (exportScope === 'project' && project) {
      jsonStr = JSON.stringify(project, null, 2);
      fileName = `${project.title.toLowerCase().replace(/\s+/g, '-')}.project.json`;
    } else {
      jsonStr = JSON.stringify(diagramIR, null, 2);
      fileName = `${diagramIR.meta.title.toLowerCase().replace(/\s+/g, '-')}.archify.json`;
    }

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHTML = () => {
    const html = exportScope === 'project' && project
      ? generateProjectBundleHTML(project)
      : generateStandaloneHTML(diagramIR);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#111726] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Export System Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Select format for standalone viewing, sharing, or agent integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scope Selector Tabs (Active View vs Project Bundle) */}
        {project && (project.diagrams?.length || 0) > 1 && (
          <div className="px-5 pt-3.5 pb-1 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Export Scope:</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setExportScope('active')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  exportScope === 'active'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Active View ({diagramIR.meta.title})</span>
              </button>
              <button
                onClick={() => setExportScope('project')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  exportScope === 'project'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>All {project.diagrams.length} Views (Project Bundle)</span>
              </button>
            </div>
          </div>
        )}

        {/* Options Grid */}
        <div className="p-5 grid grid-cols-2 gap-3.5">
          {/* Option 1: Standalone HTML */}
          <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 flex flex-col justify-between hover:border-sky-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">
                  <FileCode className="w-4 h-4" />
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded">
                  {exportScope === 'project' ? 'Multi-Tab Suite' : 'Recommended'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                {exportScope === 'project' ? 'Multi-Tab HTML Bundle' : 'Standalone HTML Viewer'}
              </h4>
              <p className="text-xs text-slate-400">
                {exportScope === 'project'
                  ? 'All diagrams bundled in a single file with an embedded tab switcher, search, and tracing.'
                  : 'Self-contained interactive file with finite motion, dark/light themes, zoom, and reach tracing.'}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={downloadHTML}
                className="flex-1 py-1.5 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
              >
                Download .html
              </button>
              <button
                onClick={copyHTML}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                title="Copy HTML Source"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Option 2: 1200x630 Share Card PNG */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Image className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  1200 × 630
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                Canonical Share Card
              </h4>
              <p className="text-xs text-slate-400">
                High-resolution PNG banner ready for GitHub README, release notes, and social cards.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => { onExportShareCard(); onClose(); }}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-all"
              >
                Capture Share Card
              </button>
            </div>
          </div>

          {/* Option 3: Clean SVG Vector */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 inline-block mb-2">
                <FileCode className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                Vector SVG Graphic
              </h4>
              <p className="text-xs text-slate-400">
                Scalable vector format with embedded CSS styling and dark theme defs.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={downloadSVG}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-all"
              >
                Download .svg
              </button>
            </div>
          </div>

          {/* Option 4: Archify JSON IR */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 inline-block mb-2">
                <Share2 className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                {exportScope === 'project' ? 'Multi-Diagram Project JSON' : 'Schema v2 JSON IR'}
              </h4>
              <p className="text-xs text-slate-400">
                {exportScope === 'project'
                  ? 'Complete project JSON bundle with all diagram views and metadata.'
                  : 'Raw typed JSON intermediate representation compatible with Archify CLI & Agent skills.'}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={downloadJSON}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-all font-mono"
              >
                Download .json
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

