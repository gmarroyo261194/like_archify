const fs = require('fs');
const path = require('path');

function write(file, content) {
  const full = path.resolve(__dirname, '..', file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote ' + file);
}

// 1. Node Inspector
write('src/components/inspector/NodeInspector.tsx', `
import React from 'react';
import { Node } from '@xyflow/react';
import { ArchifyNodeData, NodeRole } from '../../types/archify';
import { Trash2, ExternalLink, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface Props {
  selectedNode: Node<ArchifyNodeData> | null;
  onUpdateNode: (id: string, updates: Partial<ArchifyNodeData>) => void;
  onDeleteNode: (id: string) => void;
  onTraceReach: (nodeId: string, direction: 'upstream' | 'downstream') => void;
}

const ROLES: NodeRole[] = [
  'client', 'gateway', 'service', 'worker', 'database', 
  'cache', 'queue', 'ai', 'storage', 'security', 'external'
];

export const NodeInspector: React.FC<Props> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onTraceReach
}) => {
  if (!selectedNode) return null;

  const data = selectedNode.data;

  return (
    <div className="w-80 bg-[#111726]/95 border-l border-[#1e293b] flex flex-col h-full z-10 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1e293b] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Node Inspector
          </span>
          <h3 className="text-sm font-semibold text-slate-100 truncate max-w-[180px]">
            {data.label}
          </h3>
        </div>
        <button
          onClick={() => onDeleteNode(selectedNode.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete Node (Del)"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4 text-xs">
        {/* Label */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Display Label
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Subtitle / Description
          </label>
          <input
            type="text"
            value={data.subtitle || ''}
            onChange={(e) => onUpdateNode(selectedNode.id, { subtitle: e.target.value })}
            placeholder="e.g. Ingress & Rate Limiting"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Semantic Role */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Archify Semantic Role
          </label>
          <select
            value={data.role || 'service'}
            onChange={(e) => onUpdateNode(selectedNode.id, { role: e.target.value as NodeRole })}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 capitalize"
          >
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Technology Stack Tag
          </label>
          <input
            type="text"
            value={data.tech || ''}
            onChange={(e) => onUpdateNode(selectedNode.id, { tech: e.target.value })}
            placeholder="e.g. Node.js / PostgreSQL"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Port & Status Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Port
            </label>
            <input
              type="text"
              value={data.port || ''}
              onChange={(e) => onUpdateNode(selectedNode.id, { port: e.target.value })}
              placeholder="e.g. 8080"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Health Status
            </label>
            <select
              value={data.status || 'healthy'}
              onChange={(e) => onUpdateNode(selectedNode.id, { status: e.target.value as any })}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="degraded">Degraded</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Source / Git Link */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Git Repository / Commit URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.gitUrl || ''}
              onChange={(e) => onUpdateNode(selectedNode.id, { gitUrl: e.target.value })}
              placeholder="https://github.com/org/repo"
              className="w-full pl-7 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-[11px] focus:outline-none focus:border-sky-500"
            />
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>
        </div>

        {/* Reach Tracing Tools */}
        <div className="pt-3 border-t border-slate-800">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Archify Reach Tracing
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTraceReach(selectedNode.id, 'upstream')}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-all font-medium"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Upstream</span>
            </button>
            <button
              onClick={() => onTraceReach(selectedNode.id, 'downstream')}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-all font-medium"
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Downstream</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
`);

// 2. Edge Inspector
write('src/components/inspector/EdgeInspector.tsx', `
import React from 'react';
import { Edge } from '@xyflow/react';
import { ArchifyEdgeData } from '../../types/archify';
import { Trash2, Zap } from 'lucide-react';

interface Props {
  selectedEdge: Edge<ArchifyEdgeData> | null;
  onUpdateEdge: (id: string, updates: Partial<ArchifyEdgeData>) => void;
  onDeleteEdge: (id: string) => void;
}

const PROTOCOLS = [
  'HTTP/2', 'HTTPS / TLS', 'gRPC', 'WebSocket', 'TCP', 
  'SQL Query', 'Kafka Producer', 'Kafka Consumer', 'AMQP / RabbitMQ',
  'Redis RESP', 'GraphQL', 'REST API', 'Async Event'
];

export const EdgeInspector: React.FC<Props> = ({
  selectedEdge,
  onUpdateEdge,
  onDeleteEdge
}) => {
  if (!selectedEdge) return null;

  const data = selectedEdge.data || {};

  return (
    <div className="w-80 bg-[#111726]/95 border-l border-[#1e293b] flex flex-col h-full z-10 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1e293b] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Connection Inspector
          </span>
          <h3 className="text-sm font-semibold text-slate-100 truncate max-w-[180px]">
            {data.protocol || 'Direct Flow'}
          </h3>
        </div>
        <button
          onClick={() => onDeleteEdge(selectedEdge.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete Connection"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4 text-xs">
        {/* Protocol */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Communication Protocol
          </label>
          <select
            value={data.protocol || 'HTTP/2'}
            onChange={(e) => onUpdateEdge(selectedEdge.id, { protocol: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-500"
          >
            {PROTOCOLS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Transfer Label / Purpose
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateEdge(selectedEdge.id, { label: e.target.value })}
            placeholder="e.g. Verify JWT Token"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Latency & Rate */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Estimated Latency
            </label>
            <input
              type="text"
              value={data.latency || ''}
              onChange={(e) => onUpdateEdge(selectedEdge.id, { latency: e.target.value })}
              placeholder="e.g. 5ms"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Signal Animation
            </label>
            <button
              onClick={() => onUpdateEdge(selectedEdge.id, { animated: data.animated === false ? true : false })}
              className={\`w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-colors \${
                data.animated !== false
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }\`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{data.animated !== false ? 'Active' : 'Static'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
`);

// 3. Route Inspector Bar
write('src/components/tracing/RouteInspectorBar.tsx', `
import React, { useState } from 'react';
import { Route, Play, X, Compass, CheckCircle2 } from 'lucide-react';
import { ArchifyNodeData } from '../../types/archify';
import { Node } from '@xyflow/react';

interface Props {
  nodes: Node<ArchifyNodeData>[];
  onTraceRoute: (sourceId: string, targetId: string) => void;
  onClearTrace: () => void;
  isTracingActive: boolean;
}

export const RouteInspectorBar: React.FC<Props> = ({
  nodes,
  onTraceRoute,
  onClearTrace,
  isTracingActive
}) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');

  const handleTrace = () => {
    if (sourceId && targetId) {
      onTraceRoute(sourceId, targetId);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#111726]/95 border border-[#1e293b] shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs border-r border-slate-800 pr-3">
        <Compass className="w-4 h-4 animate-spin-slow" />
        <span>Route Probe</span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500 max-w-[160px]"
        >
          <option value="">Start Node...</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.data.label}</option>
          ))}
        </select>

        <span className="text-slate-500 font-bold">→</span>

        <select
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500 max-w-[160px]"
        >
          <option value="">End Node...</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.data.label}</option>
          ))}
        </select>

        <button
          onClick={handleTrace}
          disabled={!sourceId || !targetId}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Trace Route</span>
        </button>

        {isTracingActive && (
          <button
            onClick={onClearTrace}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Clear Route Highlight"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
`);

// 4. Top Toolbar
write('src/components/toolbar/TopToolbar.tsx', `
import React from 'react';
import { 
  Sparkles, Code2, Download, Moon, Sun, LayoutGrid, RotateCcw, 
  Share2, Play, BookOpen, Layers
} from 'lucide-react';
import { PresetType, ThemeType } from '../../types/archify';

interface Props {
  preset: PresetType;
  onChangePreset: (preset: PresetType) => void;
  theme: ThemeType;
  onToggleTheme: () => void;
  onOpenJsonModal: () => void;
  onOpenExportModal: () => void;
  onLoadTemplate: (templateKey: 'web' | 'ai' | 'micro') => void;
  onResetCanvas: () => void;
}

export const TopToolbar: React.FC<Props> = ({
  preset,
  onChangePreset,
  theme,
  onToggleTheme,
  onOpenJsonModal,
  onOpenExportModal,
  onLoadTemplate,
  onResetCanvas
}) => {
  return (
    <header className="h-14 bg-[#111726]/95 border-b border-[#1e293b] px-4 flex items-center justify-between z-20 select-none">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-sky-500/25">
          A
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              Archify Studio
            </h1>
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded">
              v2.17
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Interactive Visual System Map Generator
          </p>
        </div>
      </div>

      {/* Center Controls: Presets + Templates */}
      <div className="flex items-center gap-2">
        {/* Preset Selector */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
          {(['signal-flow', 'blueprint', 'classic', 'minimal'] as PresetType[]).map((p) => (
            <button
              key={p}
              onClick={() => onChangePreset(p)}
              className={\`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all \${
                preset === p
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
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
          <div className="absolute top-full left-0 mt-1 w-48 bg-[#111726] border border-[#1e293b] rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
            <button
              onClick={() => onLoadTemplate('web')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              🌐 3-Tier Web App
            </button>
            <button
              onClick={() => onLoadTemplate('ai')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              🤖 Multi-Agent Workflow
            </button>
            <button
              onClick={() => onLoadTemplate('micro')}
              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              ⚡ Financial Event-Bus
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
          title="Clear & Reset Canvas"
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
`);

console.log('Inspectors and Top Toolbar written');
