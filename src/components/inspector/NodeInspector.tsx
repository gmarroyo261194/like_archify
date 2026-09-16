import React from 'react';
import { Node } from '@xyflow/react';
import { ArchifyNodeData, NodeRole } from '../../types/archify';
import { Trash2, ExternalLink, ArrowUpRight, ArrowDownRight, EyeOff } from 'lucide-react';

interface Props {
  selectedNode: Node<ArchifyNodeData> | null;
  onUpdateNode: (id: string, updates: Partial<ArchifyNodeData>) => void;
  onDeleteNode: (id: string) => void;
  onTraceReach: (nodeId: string, direction: 'upstream' | 'downstream') => void;
  onClearReach?: () => void;
  isTracingActive?: boolean;
}

const ROLES: NodeRole[] = [
  'client', 'gateway', 'service', 'worker', 'database', 
  'cache', 'queue', 'ai', 'storage', 'security', 'external'
];

export const NodeInspector: React.FC<Props> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onTraceReach,
  onClearReach,
  isTracingActive
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
          title="Delete Node"
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Archify Reach Tracing
            </label>
            {isTracingActive && onClearReach && (
              <button
                onClick={onClearReach}
                className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <EyeOff className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
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
