import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';
import { ArchifyNodeData, ArchifyEdgeData } from '../../types/archify';

export type LayoutDirection = 'TB' | 'LR' | 'BT' | 'RL';

export interface LayoutOptions {
  direction?: LayoutDirection;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeSpacing?: number;
  rankSpacing?: number;
}

export function getAutoLayoutedElements(
  nodes: Node<ArchifyNodeData>[],
  edges: Edge<ArchifyEdgeData>[],
  options: LayoutOptions = {}
): { nodes: Node<ArchifyNodeData>[]; edges: Edge<ArchifyEdgeData>[] } {
  const {
    direction = 'LR',
    nodeWidth = 240,
    nodeHeight = 100,
    nodeSpacing = 60,
    rankSpacing = 90,
  } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    marginx: 40,
    marginy: 40,
  });

  const regularNodes = nodes.filter((n) => n.type !== 'boundary');
  const boundaryNodes = nodes.filter((n) => n.type === 'boundary');

  regularNodes.forEach((node) => {
    const width = node.measured?.width || (node.style?.width as number) || nodeWidth;
    const height = node.measured?.height || (node.style?.height as number) || nodeHeight;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    if (dagreGraph.hasNode(edge.source) && dagreGraph.hasNode(edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = regularNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.measured?.width || (node.style?.width as number) || nodeWidth;
    const height = node.measured?.height || (node.style?.height as number) || nodeHeight;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return {
    nodes: [...boundaryNodes, ...layoutedNodes],
    edges,
  };
}
