import { memo } from 'react';
import { NodeProps, Node, NodeResizer } from '@xyflow/react';
import { ArchifyBoundaryData } from '../../../types/archify';
import { Shield, Cloud, Layers, Box } from 'lucide-react';

const BOUNDARY_ICONS: Record<string, any> = {
  vpc: Cloud,
  cluster: Layers,
  subnet: Box,
  zone: Shield,
  'security-group': Shield
};

export const BoundaryNode = memo(({ data, selected }: NodeProps<Node<ArchifyBoundaryData>>) => {
  const type = (data?.type || 'vpc') as string;
  const isFrame = type === 'frame' || type === 'interaction' || type === 'group';
  const Icon = BOUNDARY_ICONS[type] || (isFrame ? Box : Cloud);

  return (
    <div
      className={`w-full h-full rounded-2xl border-2 transition-all relative ${
        isFrame
          ? selected
            ? 'border-slate-500 bg-slate-900/40 border-dashed ring-1 ring-slate-400'
            : 'border-slate-700/50 bg-slate-900/15 border-dashed hover:border-slate-600/70'
          : selected 
          ? 'border-sky-400 bg-sky-500/[0.06] shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/40 border-dashed' 
          : 'border-slate-700/60 bg-slate-900/[0.25] border-dashed'
      }`}
    >
      {/* NodeResizer for Boundary only */}
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={120}
        lineStyle={{ borderColor: '#38bdf8', borderWidth: 1.5 }}
        handleStyle={{
          width: 9,
          height: 9,
          borderRadius: 3,
          backgroundColor: '#0284c7',
          borderColor: '#38bdf8',
          borderWidth: 1.5
        }}
      />

      <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-[10px] font-bold pointer-events-none">
        {!isFrame && <Icon className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
        <span className="truncate text-slate-300">{data?.label || 'Boundary'}</span>
        {!isFrame && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono shrink-0">
            {type}
          </span>
        )}
      </div>
    </div>
  );
});

BoundaryNode.displayName = 'BoundaryNode';
