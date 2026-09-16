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
