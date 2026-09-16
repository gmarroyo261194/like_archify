import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ArchifyNode } from './nodes/ArchifyNode';
import { ArchifyEdge } from './edges/ArchifyEdge';
import { BoundaryNode } from './boundaries/BoundaryNode';
import { PresetType } from '../../types/archify';

interface Props {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  preset: PresetType;
  theme?: string;
  diagramType?: string;
}

export const DiagramCanvas: React.FC<Props> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onDrop,
  onDragOver,
  preset,
  theme = 'dark',
  diagramType
}) => {
  const nodeTypes = useMemo(() => ({
    archifyNode: ArchifyNode,
    boundaryNode: BoundaryNode
  }), []);

  const edgeTypes = useMemo(() => ({
    archifyEdge: ArchifyEdge
  }), []);

  const isLight = theme === 'light';
  let gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.07)';
  let bgVariant = BackgroundVariant.Dots;

  if (preset === 'blueprint') {
    gridColor = isLight ? 'rgba(37, 99, 235, 0.18)' : 'rgba(96, 165, 250, 0.15)';
    bgVariant = BackgroundVariant.Lines;
  } else if (preset === 'classic') {
    gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.04)';
    bgVariant = BackgroundVariant.Cross;
  }

  return (
    <div 
      className="flex-1 h-full w-full relative"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={3}
        defaultEdgeOptions={{
          type: 'archifyEdge',
          animated: true
        }}
      >
        <Background
          variant={bgVariant}
          gap={preset === 'blueprint' ? 32 : 24}
          size={1.5}
          color={gridColor}
        />
        <Controls className="!bg-[#111726]/90 !border-[#1e293b] !rounded-xl !overflow-hidden" />
        <MiniMap
          className="!bg-[#111726]/90 !border-[#1e293b] !rounded-xl"
          nodeColor={(node) => {
            if (node.type === 'boundaryNode') return 'rgba(100, 116, 139, 0.2)';
            return '#38bdf8';
          }}
          maskColor="rgba(10, 13, 20, 0.75)"
        />
      </ReactFlow>

      {/* Sequence Semantic Legend Overlay */}
      {diagramType === 'sequence' && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#111726]/95 border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md flex items-center gap-4 text-[11px] font-mono select-none">
          <span className="font-bold text-slate-100 uppercase tracking-wider text-[10px]">Legend</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-4 h-0.5 bg-emerald-400 rounded"></span>
            <span>request</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-4 h-0.5 border-t border-dashed border-slate-400"></span>
            <span>return</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500"></span>
            <span>security</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-400"></span>
            <span>async trace</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-4 h-0.5 bg-slate-500 rounded"></span>
            <span>default message</span>
          </div>
        </div>
      )}
    </div>
  );
};
