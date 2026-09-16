import { memo } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge, Edge } from '@xyflow/react';
import { ArchifyEdgeData } from '../../../types/archify';

export type CustomEdgeProps = EdgeProps<Edge<ArchifyEdgeData>>;

export const ArchifyEdge = memo(({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16
  });

  const isHighlighted = data?.isHighlighted;
  const isDimmed = data?.isDimmed;
  const isAnimated = data?.animated !== false;
  const edgeType = data?.edgeType || 'solid';

  // Semantic Sequence & Flow Coloring
  let defaultStroke = '#475569';
  if (edgeType === 'return') {
    defaultStroke = '#94a3b8'; // gray/dashed return
  } else if (edgeType === 'security' || data?.protocol?.toLowerCase().includes('jwt') || data?.protocol?.toLowerCase().includes('auth') || data?.label?.toLowerCase().includes('jwt') || data?.label?.toLowerCase().includes('auth')) {
    defaultStroke = '#f43f5e'; // rose/security
  } else if (edgeType === 'async' || data?.protocol?.toLowerCase().includes('trace') || data?.protocol?.toLowerCase().includes('event') || data?.protocol?.toLowerCase().includes('kafka') || data?.label?.toLowerCase().includes('trace')) {
    defaultStroke = '#a855f7'; // purple/async trace
  } else if (edgeType === 'request' || data?.protocol?.toLowerCase().includes('http') || data?.label?.toLowerCase().includes('get') || data?.label?.toLowerCase().includes('post')) {
    defaultStroke = '#10b981'; // emerald request
  }

  const strokeColor = isHighlighted 
    ? '#22d3ee' 
    : selected 
    ? '#38bdf8' 
    : defaultStroke;

  const isDashed = edgeType === 'dashed' || edgeType === 'return' || edgeType === 'async';

  return (
    <>
      {/* Background Glow Layer for Highlighted Edges */}
      {isHighlighted && (
        <path
          d={edgePath}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={8}
          strokeOpacity={0.25}
          className="blur-sm"
        />
      )}

      {/* Main Base Edge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...(style || {}),
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 2.5 : selected ? 2 : 1.75,
          strokeDasharray: isDashed ? '6, 5' : undefined,
          opacity: isDimmed ? 0.2 : 1
        }}
      />

      {/* Animated Flow Signal Packets */}
      {isAnimated && !isDimmed && (
        <path
          d={edgePath}
          fill="none"
          stroke={isHighlighted ? '#a5f3fc' : '#38bdf8'}
          strokeWidth={2}
          className="animate-signal"
          strokeLinecap="round"
        />
      )}

      {/* Edge Interactive Label Chip */}
      {(data?.label || data?.protocol || data?.latency) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all'
            }}
            className={`nodrag nopan flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono transition-all ${
              isHighlighted
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                : selected
                ? 'bg-sky-950/90 border-sky-400 text-sky-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            } ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
          >
            {data.protocol && (
              <span className="font-bold text-sky-400">{data.protocol}</span>
            )}
            {data.label && (
              <span className="text-slate-300">{data.label}</span>
            )}
            {data.latency && (
              <span className="text-emerald-400 font-semibold">{data.latency}</span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

ArchifyEdge.displayName = 'ArchifyEdge';
