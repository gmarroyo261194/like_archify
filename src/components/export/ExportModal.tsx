import React, { useState } from 'react';
import { X, Download, FileCode, Image, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { ArchifyDiagramIR } from '../../types/archify';
import { generateStandaloneHTML } from '../../lib/exporter/htmlExporter';
import { generateCleanSVG } from '../../lib/exporter/svgExporter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  diagramIR: ArchifyDiagramIR;
  onExportShareCard: () => void;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  diagramIR,
  onExportShareCard
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadHTML = () => {
    const html = generateStandaloneHTML(diagramIR);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramIR.meta.title.toLowerCase().replace(/\s+/g, '-')}.html`;
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
    const jsonStr = JSON.stringify(diagramIR, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramIR.meta.title.toLowerCase().replace(/\s+/g, '-')}.archify.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHTML = () => {
    const html = generateStandaloneHTML(diagramIR);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#111726] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Export Archify Diagram
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
                  Recommended
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                Standalone HTML Viewer
              </h4>
              <p className="text-xs text-slate-400">
                Self-contained interactive file with finite motion, dark/light themes, zoom, and reach tracing.
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
                Schema v2 JSON IR
              </h4>
              <p className="text-xs text-slate-400">
                Raw typed JSON intermediate representation compatible with Archify CLI & Agent skills.
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
