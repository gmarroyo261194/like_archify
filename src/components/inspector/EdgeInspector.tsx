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

  const data = (selectedEdge.data || {}) as Partial<ArchifyEdgeData>;

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
              className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                data.animated !== false
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
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
