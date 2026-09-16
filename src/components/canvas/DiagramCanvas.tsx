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
  preset
}) => {
  const nodeTypes = useMemo(() => ({
    archifyNode: ArchifyNode,
    boundaryNode: BoundaryNode
  }), []);

  const edgeTypes = useMemo(() => ({
    archifyEdge: ArchifyEdge
  }), []);

  let gridColor = 'rgba(255, 255, 255, 0.07)';
  let bgVariant = BackgroundVariant.Dots;

  if (preset === 'blueprint') {
    gridColor = 'rgba(96, 165, 250, 0.15)';
    bgVariant = BackgroundVariant.Lines;
  } else if (preset === 'classic') {
    gridColor = 'rgba(255, 255, 255, 0.04)';
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
    </div>
  );
};
