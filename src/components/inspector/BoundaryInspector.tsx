import React from 'react';
import { Node } from '@xyflow/react';
import { ArchifyBoundaryData } from '../../types/archify';
import { Trash2, Box, Shield, Cloud, Layers } from 'lucide-react';

interface Props {
  selectedBoundary: Node<ArchifyBoundaryData> | null;
  onUpdateBoundary: (id: string, updates: Partial<ArchifyBoundaryData>) => void;
  onDeleteBoundary: (id: string) => void;
}

const BOUNDARY_TYPES = [
  { id: 'vpc', label: 'VPC Network', icon: Cloud },
  { id: 'cluster', label: 'Kubernetes / App Cluster', icon: Layers },
  { id: 'subnet', label: 'Private Subnet', icon: Box },
  { id: 'zone', label: 'Security / DMZ Zone', icon: Shield },
  { id: 'security-group', label: 'Security Group', icon: Shield }
];

export const BoundaryInspector: React.FC<Props> = ({
  selectedBoundary,
  onUpdateBoundary,
  onDeleteBoundary
}) => {
  if (!selectedBoundary) return null;

  const data = selectedBoundary.data || { label: 'Boundary', type: 'vpc' };

  return (
    <div className="w-80 bg-[#111726]/95 border-l border-[#1e293b] flex flex-col h-full z-10 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1e293b] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
            Boundary Inspector
          </span>
          <h3 className="text-sm font-semibold text-slate-100 truncate max-w-[180px]">
            {data.label || 'VPC / Zone'}
          </h3>
        </div>
        <button
          onClick={() => onDeleteBoundary(selectedBoundary.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete Boundary"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4 text-xs">
        {/* Label */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Boundary Label / Title
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateBoundary(selectedBoundary.id, { label: e.target.value })}
            placeholder="e.g. Private VPC (App Cluster)"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Infrastructure Type
          </label>
          <select
            value={data.type || 'vpc'}
            onChange={(e) => onUpdateBoundary(selectedBoundary.id, { type: e.target.value as any })}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500 capitalize"
          >
            {BOUNDARY_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
