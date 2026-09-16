import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

import { 
  ArchifyDiagramIR, ArchifyNodeData, ArchifyEdgeData, ArchifyBoundaryData,
  PresetType, ThemeType, NodeRole, DiagramType 
} from './types/archify';
import { ArchifyProject, ProjectDiagram } from './types/project';

import { TopToolbar } from './components/toolbar/TopToolbar';
import { DiagramTabBar } from './components/toolbar/DiagramTabBar';
import { NewDiagramModal } from './components/toolbar/NewDiagramModal';
import { AIDiagramModal } from './components/ai/AIDiagramModal';
import { ArchitectureAuditModal } from './components/ai/ArchitectureAuditModal';
import { RepoToDiagramModal } from './components/ai/RepoToDiagramModal';
import { ComponentPalette } from './components/sidebar/ComponentPalette';
import { NodeInspector } from './components/inspector/NodeInspector';
import { EdgeInspector } from './components/inspector/EdgeInspector';
import { BoundaryInspector } from './components/inspector/BoundaryInspector';
import { RouteInspectorBar } from './components/tracing/RouteInspectorBar';
import { DiagramCanvas } from './components/canvas/DiagramCanvas';
import { ExportModal } from './components/export/ExportModal';
import { JsonEditorModal } from './components/code/JsonEditorModal';
import { ProjectsModal } from './components/projects/ProjectsModal';
import { getAutoLayoutedElements } from './lib/layout/autoLayout';

import { 
  getAllProjects, saveProject, 
  getActiveProjectId, setActiveProjectId,
  addDiagramToProject, duplicateDiagram,
  deleteDiagram, updateDiagramTitle 
} from './lib/storage/projectStorage';
import { 
  TEMPLATE_WEB_APP, TEMPLATE_WORKFLOW, TEMPLATE_SEQUENCE, 
  TEMPLATE_DATAFLOW, TEMPLATE_LIFECYCLE 
} from './lib/templates/defaultTemplates';

function irToCanvas(ir: ArchifyDiagramIR): { nodes: Node[]; edges: Edge[] } {
  const boundaryNodes: Node[] = (ir.boundaries || []).map(b => ({
    id: b.id,
    type: 'boundaryNode',
    position: b.position,
    data: {
      id: b.id,
      label: b.label,
      type: b.type
    },
    style: {
      width: b.size.width,
      height: b.size.height,
      zIndex: -1
    }
  }));

  const appNodes: Node[] = (ir.nodes || []).map(n => ({
    id: n.id,
    type: 'archifyNode',
    position: n.position,
    data: {
      id: n.id,
      label: n.label,
      subtitle: n.subtitle,
      role: n.role,
      shape: n.shape || 'box',
      icon: n.icon || 'Server',
      tech: n.tech,
      port: n.port,
      status: n.status || 'healthy',
      gitUrl: n.git_url,
      metadata: n.metadata,
      preset: ir.meta.preset,
      theme: ir.meta.theme,
      isHighlighted: false,
      isDimmed: false
    }
  }));

  const appEdges: Edge[] = (ir.edges || []).map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'archifyEdge',
    data: {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      protocol: e.protocol,
      edgeType: e.edge_type as any,
      animated: e.animated !== false,
      latency: e.latency,
      isHighlighted: false,
      isDimmed: false
    }
  }));

  return { nodes: [...boundaryNodes, ...appNodes], edges: appEdges };
}

function canvasToIR(
  nodes: Node[],
  edges: Edge[],
  meta: ArchifyDiagramIR['meta'],
  diagramType: DiagramType = 'architecture'
): ArchifyDiagramIR {
  const boundaries = nodes
    .filter(n => n.type === 'boundaryNode')
    .map(n => ({
      id: n.id,
      label: (n.data?.label as string) || 'Boundary',
      type: (n.data?.type as string) || 'vpc',
      position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
      size: { 
        width: Math.round((n.style?.width as number) || 400), 
        height: Math.round((n.style?.height as number) || 300) 
      }
    }));

  const appNodes = nodes
    .filter(n => n.type === 'archifyNode')
    .map(n => ({
      id: n.id,
      label: (n.data?.label as string) || 'Service',
      subtitle: n.data?.subtitle as string | undefined,
      role: ((n.data?.role as string) || 'service') as NodeRole,
      shape: (n.data?.shape as any) || 'box',
      tech: n.data?.tech as string | undefined,
      icon: n.data?.icon as string | undefined,
      port: n.data?.port as string | number | undefined,
      status: n.data?.status as string | undefined,
      git_url: n.data?.gitUrl as string | undefined,
      metadata: n.data?.metadata as Record<string, string> | undefined,
      position: { x: Math.round(n.position.x), y: Math.round(n.position.y) }
    }));

  const appEdges = edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.data?.label as string | undefined,
    protocol: e.data?.protocol as string | undefined,
    animated: e.data?.animated !== false,
    latency: e.data?.latency as string | undefined
  }));

  return {
    schema_version: '2.0.0',
    diagram_type: diagramType,
    meta: {
      ...meta,
      updated_at: new Date().toISOString()
    },
    boundaries,
    nodes: appNodes,
    edges: appEdges
  };
}

export function App() {
  const [activeProject, setActiveProject] = useState<ArchifyProject>(() => {
    const all = getAllProjects();
    const activeId = getActiveProjectId();
    const found = all.find(p => p.id === activeId);
    return found || all[0];
  });

  const activeDiagramId = activeProject.active_diagram_id || activeProject.diagrams[0]?.id;
  const activeDiagram = useMemo(() => {
    return activeProject.diagrams.find(d => d.id === activeDiagramId) || activeProject.diagrams[0];
  }, [activeProject, activeDiagramId]);

  const [meta, setMeta] = useState(activeDiagram.ir.meta);
  const initial = useMemo(() => irToCanvas(activeDiagram.ir), [activeProject.id, activeDiagram.id]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [preset, setPreset] = useState<PresetType>(activeDiagram.ir.meta.preset || 'signal-flow');
  const [theme, setTheme] = useState<ThemeType>(activeDiagram.ir.meta.theme || 'dark');

  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isNewDiagramModalOpen, setIsNewDiagramModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isTracingActive, setIsTracingActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const handleAutoLayout = useCallback(() => {
    const layouted = getAutoLayoutedElements(
      nodes as Node<ArchifyNodeData>[],
      edges as Edge<ArchifyEdgeData>[],
      { direction: 'LR', nodeSpacing: 60, rankSpacing: 100 }
    );
    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [nodes, edges, setNodes, setEdges]);

  const handleApplyAIDiagram = useCallback((generatedIR: ArchifyDiagramIR) => {
    const { nodes: rawNodes, edges: rawEdges } = irToCanvas(generatedIR);
    const layouted = getAutoLayoutedElements(
      rawNodes as Node<ArchifyNodeData>[],
      rawEdges as Edge<ArchifyEdgeData>[],
      { direction: 'LR', nodeSpacing: 60, rankSpacing: 100 }
    );

    setMeta(generatedIR.meta);
    if (generatedIR.meta.preset) setPreset(generatedIR.meta.preset);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
  }, [setNodes, setEdges]);

  const currentIR = useMemo(() => {
    return canvasToIR(nodes, edges, { ...meta, preset, theme }, activeDiagram.diagram_type);
  }, [nodes, edges, meta, preset, theme, activeDiagram.diagram_type]);

  // Real-Time Auto-Save to LocalStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsSaving(true);
    const timeout = setTimeout(() => {
      const updatedDiagrams = activeProject.diagrams.map(d => {
        if (d.id === activeDiagram.id) {
          return {
            ...d,
            title: meta.title,
            updated_at: new Date().toISOString(),
            ir: currentIR
          };
        }
        return d;
      });

      const updatedProject: ArchifyProject = {
        ...activeProject,
        title: activeProject.title,
        updated_at: new Date().toISOString(),
        diagrams: updatedDiagrams
      };

      saveProject(updatedProject);
      setIsSaving(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [nodes, edges, meta, preset, theme, activeProject.id, activeDiagram.id]);

  const selectedNode = useMemo(() => {
    const found = nodes.find(n => n.id === selectedNodeId);
    if (found && found.type === 'archifyNode') {
      return found as Node<ArchifyNodeData>;
    }
    return null;
  }, [nodes, selectedNodeId]);

  const selectedBoundary = useMemo(() => {
    const found = nodes.find(n => n.id === selectedNodeId);
    if (found && found.type === 'boundaryNode') {
      return found as Node<ArchifyBoundaryData>;
    }
    return null;
  }, [nodes, selectedNodeId]);

  const selectedEdge = useMemo(() => {
    return (edges.find(e => e.id === selectedEdgeId) as Edge<ArchifyEdgeData>) || null;
  }, [edges, selectedEdgeId]);

  const handleClearTrace = useCallback(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        isHighlighted: false,
        isDimmed: false
      }
    })));
    setEdges(eds => eds.map(e => ({
      ...e,
      data: {
        ...(e.data || {}),
        isHighlighted: false,
        isDimmed: false
      }
    })));
    setIsTracingActive(false);
  }, [setNodes, setEdges]);

  // Project Switching
  const handleSelectProject = useCallback((project: ArchifyProject) => {
    setActiveProjectId(project.id);
    setActiveProject(project);

    const firstDiag = project.diagrams.find(d => d.id === project.active_diagram_id) || project.diagrams[0];
    setMeta(firstDiag.ir.meta);
    setPreset(firstDiag.ir.meta.preset || 'signal-flow');
    setTheme(firstDiag.ir.meta.theme || 'dark');
    document.documentElement.classList.toggle('light', firstDiag.ir.meta.theme === 'light');

    const { nodes: n, edges: e } = irToCanvas(firstDiag.ir);
    setNodes(n);
    setEdges(e);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    handleClearTrace();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.1 } });
  }, [setNodes, setEdges, handleClearTrace]);

  // Diagram Tab Switching
  const handleSelectDiagram = useCallback((diagramId: string) => {
    // 1. Commit current canvas to existing active diagram in project state
    const currentUpdatedIR = canvasToIR(nodes, edges, { ...meta, preset, theme }, activeDiagram.diagram_type);
    const updatedDiagrams = activeProject.diagrams.map(d => {
      if (d.id === activeDiagram.id) {
        return {
          ...d,
          title: meta.title,
          updated_at: new Date().toISOString(),
          ir: currentUpdatedIR
        };
      }
      return d;
    });

    const target = activeProject.diagrams.find(d => d.id === diagramId);
    if (!target) return;

    const nextProject: ArchifyProject = {
      ...activeProject,
      active_diagram_id: diagramId,
      diagrams: updatedDiagrams
    };
    saveProject(nextProject);
    setActiveProject(nextProject);

    // 2. Load target diagram onto canvas
    setMeta(target.ir.meta);
    setPreset(target.ir.meta.preset || 'signal-flow');
    setTheme(target.ir.meta.theme || 'dark');
    document.documentElement.classList.toggle('light', target.ir.meta.theme === 'light');

    const { nodes: n, edges: e } = irToCanvas(target.ir);
    setNodes(n);
    setEdges(e);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    handleClearTrace();
  }, [nodes, edges, meta, preset, theme, activeDiagram, activeProject, setNodes, setEdges, handleClearTrace]);

  // Diagram Tab Creation
  const handleAddDiagram = useCallback((title: string, type: DiagramType, templateIR?: ArchifyDiagramIR) => {
    const res = addDiagramToProject(activeProject.id, title, type, templateIR);
    if (!res) return;

    const { project, newDiagram } = res;
    setActiveProject(project);
    setMeta(newDiagram.ir.meta);
    setPreset(newDiagram.ir.meta.preset || 'signal-flow');
    setTheme(newDiagram.ir.meta.theme || 'dark');
    document.documentElement.classList.toggle('light', newDiagram.ir.meta.theme === 'light');

    const { nodes: n, edges: e } = irToCanvas(newDiagram.ir);
    setNodes(n);
    setEdges(e);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    handleClearTrace();
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.1 } });
  }, [activeProject.id, setNodes, setEdges, handleClearTrace]);

  // Diagram Tab Duplication
  const handleDuplicateDiagram = useCallback((diagramId: string) => {
    const res = duplicateDiagram(activeProject.id, diagramId);
    if (!res) return;

    const { project, duplicated } = res;
    setActiveProject(project);
    setMeta(duplicated.ir.meta);
    setPreset(duplicated.ir.meta.preset || 'signal-flow');

    const { nodes: n, edges: e } = irToCanvas(duplicated.ir);
    setNodes(n);
    setEdges(e);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    handleClearTrace();
  }, [activeProject.id, setNodes, setEdges, handleClearTrace]);

  // Diagram Tab Deletion
  const handleDeleteDiagram = useCallback((diagramId: string) => {
    const res = deleteDiagram(activeProject.id, diagramId);
    if (!res) return;

    const { project, activeDiagram: nextActive } = res;
    setActiveProject(project);
    setMeta(nextActive.ir.meta);
    setPreset(nextActive.ir.meta.preset || 'signal-flow');

    const { nodes: n, edges: e } = irToCanvas(nextActive.ir);
    setNodes(n);
    setEdges(e);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    handleClearTrace();
  }, [activeProject.id, setNodes, setEdges, handleClearTrace]);

  // Diagram Tab Rename
  const handleRenameDiagram = useCallback((diagramId: string, newTitle: string) => {
    const updated = updateDiagramTitle(activeProject.id, diagramId, newTitle);
    if (updated) {
      setActiveProject({ ...updated });
      if (diagramId === activeDiagram.id) {
        setMeta(m => ({ ...m, title: newTitle }));
      }
    }
  }, [activeProject.id, activeDiagram.id]);

  const handleUpdateProjectTitle = useCallback((newTitle: string) => {
    setActiveProject(p => {
      const updated = { ...p, title: newTitle };
      saveProject(updated);
      return updated;
    });
  }, []);

  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `e-${Date.now()}`,
      type: 'archifyEdge',
      data: {
        id: `e-${Date.now()}`,
        source: params.source,
        target: params.target,
        protocol: 'HTTP/2',
        label: 'Flow',
        animated: true,
        latency: '5ms'
      }
    };
    setEdges(eds => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleAddNode = useCallback((item: any) => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'archifyNode',
      position: { x: 350 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: {
        id,
        label: item.label,
        subtitle: item.subtitle,
        role: item.role,
        shape: item.shape || 'box',
        icon: item.icon,
        tech: item.tech,
        status: 'healthy',
        preset,
        theme,
        isHighlighted: false,
        isDimmed: false
      }
    };
    setNodes(nds => [...nds, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [preset, theme, setNodes]);

  const handleAddBoundary = useCallback(() => {
    const id = `b-${Date.now()}`;
    const newBoundary: Node = {
      id,
      type: 'boundaryNode',
      position: { x: 100, y: 100 },
      data: {
        id,
        label: 'New Secure Scope / Zone',
        type: 'vpc'
      },
      style: {
        width: 400,
        height: 350,
        zIndex: -1
      }
    };
    setNodes(nds => [newBoundary, ...nds]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const dataStr = event.dataTransfer.getData('application/archify-node');
    if (!dataStr) return;

    const item = JSON.parse(dataStr);
    const bounds = containerRef.current?.getBoundingClientRect();
    const x = bounds ? event.clientX - bounds.left : 200;
    const y = bounds ? event.clientY - bounds.top : 200;

    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'archifyNode',
      position: { x, y },
      data: {
        id,
        label: item.label,
        subtitle: item.subtitle,
        role: item.role,
        shape: item.shape || 'box',
        icon: item.icon,
        tech: item.tech,
        status: 'healthy',
        preset,
        theme,
        isHighlighted: false,
        isDimmed: false
      }
    };
    setNodes(nds => [...nds, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [preset, theme, setNodes]);

  const handleUpdateNode = useCallback((id: string, updates: Partial<ArchifyNodeData>) => {
    setNodes(nds => nds.map(n => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, ...updates } };
      }
      return n;
    }));
  }, [setNodes]);

  const handleUpdateBoundary = useCallback((id: string, updates: Partial<ArchifyBoundaryData>) => {
    setNodes(nds => nds.map(n => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, ...updates } };
      }
      return n;
    }));
  }, [setNodes]);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const handleUpdateEdge = useCallback((id: string, updates: Partial<ArchifyEdgeData>) => {
    setEdges(eds => eds.map(e => {
      if (e.id === id) {
        return { ...e, data: { ...(e.data || {}), ...updates } };
      }
      return e;
    }));
  }, [setEdges]);

  const handleDeleteEdge = useCallback((id: string) => {
    setEdges(eds => eds.filter(e => e.id !== id));
    setSelectedEdgeId(null);
  }, [setEdges]);

  const handleTraceReach = useCallback((nodeId: string, direction: 'upstream' | 'downstream') => {
    const reachable = new Set<string>([nodeId]);
    const edgesToHighlight = new Set<string>();

    if (direction === 'downstream') {
      edges.forEach(e => {
        if (reachable.has(e.source)) {
          reachable.add(e.target);
          edgesToHighlight.add(e.id);
        }
      });
    } else {
      edges.forEach(e => {
        if (reachable.has(e.target)) {
          reachable.add(e.source);
          edgesToHighlight.add(e.id);
        }
      });
    }

    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        isHighlighted: reachable.has(n.id),
        isDimmed: !reachable.has(n.id) && n.type === 'archifyNode'
      }
    })));

    setEdges(eds => eds.map(e => ({
      ...e,
      data: {
        ...(e.data || {}),
        isHighlighted: edgesToHighlight.has(e.id),
        isDimmed: !edgesToHighlight.has(e.id)
      }
    })));

    setIsTracingActive(true);
  }, [edges, setNodes, setEdges]);

  const handleTraceRoute = useCallback((sourceId: string, targetId: string) => {
    const queue: string[][] = [[sourceId]];
    const visited = new Set<string>([sourceId]);
    let foundPath: string[] | null = null;

    while (queue.length > 0) {
      const path = queue.shift()!;
      const curr = path[path.length - 1];

      if (curr === targetId) {
        foundPath = path;
        break;
      }

      const neighbors = edges
        .filter(e => e.source === curr)
        .map(e => e.target);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    if (!foundPath) {
      alert('No direct path found between selected nodes.');
      return;
    }

    const pathNodes = new Set(foundPath);
    const pathEdges = new Set<string>();

    for (let i = 0; i < foundPath.length - 1; i++) {
      const u = foundPath[i];
      const v = foundPath[i + 1];
      const match = edges.find(e => e.source === u && e.target === v);
      if (match) pathEdges.add(match.id);
    }

    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        isHighlighted: pathNodes.has(n.id),
        isDimmed: !pathNodes.has(n.id) && n.type === 'archifyNode'
      }
    })));

    setEdges(eds => eds.map(e => ({
      ...e,
      data: {
        ...(e.data || {}),
        isHighlighted: pathEdges.has(e.id),
        isDimmed: !pathEdges.has(e.id)
      }
    })));

    setIsTracingActive(true);
  }, [edges, setNodes, setEdges]);

  const handleChangePreset = useCallback((newPreset: PresetType) => {
    setPreset(newPreset);
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { 
        ...n.data, 
        preset: newPreset,
        isDimmed: false,
        isHighlighted: false
      }
    })));
    setEdges(eds => eds.map(e => ({
      ...e,
      data: {
        ...(e.data || {}),
        isDimmed: false,
        isHighlighted: false
      }
    })));
    setIsTracingActive(false);
  }, [setNodes, setEdges]);

  const handleToggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  }, [theme]);

  // Load Template inside current active diagram tab
  const handleLoadTemplate = useCallback((key: 'web' | 'workflow' | 'sequence' | 'dataflow' | 'lifecycle') => {
    let tpl = TEMPLATE_WEB_APP;
    let newDiagramType: DiagramType = 'architecture';

    if (key === 'web') {
      tpl = TEMPLATE_WEB_APP;
      newDiagramType = 'architecture';
    } else if (key === 'workflow') {
      tpl = TEMPLATE_WORKFLOW;
      newDiagramType = 'workflow';
    } else if (key === 'sequence') {
      tpl = TEMPLATE_SEQUENCE;
      newDiagramType = 'sequence';
    } else if (key === 'dataflow') {
      tpl = TEMPLATE_DATAFLOW;
      newDiagramType = 'dataflow';
    } else if (key === 'lifecycle') {
      tpl = TEMPLATE_LIFECYCLE;
      newDiagramType = 'lifecycle';
    }

    const { nodes: newNodes, edges: newEdges } = irToCanvas(tpl);
    
    // Update active diagram within project
    setActiveProject(p => {
      const updated = {
        ...p,
        diagrams: p.diagrams.map(d => {
          if (d.id === activeDiagram.id) {
            return {
              ...d,
              title: tpl.meta.title,
              diagram_type: newDiagramType,
              ir: tpl
            };
          }
          return d;
        })
      };
      saveProject(updated);
      return updated;
    });

    setMeta(tpl.meta);
    setPreset(tpl.meta.preset);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    handleClearTrace();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.1 } });
  }, [activeDiagram.id, setNodes, setEdges, handleClearTrace]);

  const handleResetCanvas = useCallback(() => {
    if (window.confirm('Clear current diagram view?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  }, [setNodes, setEdges]);

  const handleExportShareCard = useCallback(() => {
    if (!containerRef.current) return;
    toPng(containerRef.current, {
      width: 1200,
      height: 630,
      backgroundColor: theme === 'dark' ? '#0a0d14' : '#f8fafc'
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${meta.title.toLowerCase().replace(/\s+/g, '-')}-share-card.png`;
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    });
  }, [meta.title, theme]);

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${theme === 'light' ? 'light' : ''}`}>
      {/* Top Navigation & Actions Bar */}
      <TopToolbar
        projectTitle={activeProject.title}
        onUpdateProjectTitle={handleUpdateProjectTitle}
        preset={preset}
        onChangePreset={handleChangePreset}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenProjectsModal={() => setIsProjectsModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenRepoModal={() => setIsRepoModalOpen(true)}
        onAutoLayout={handleAutoLayout}
        onLoadTemplate={handleLoadTemplate}
        onResetCanvas={handleResetCanvas}
        diagramType={activeDiagram.diagram_type}
        isSaving={isSaving}
      />

      {/* Sub-Header Multi-Diagram Tab Strip */}
      <DiagramTabBar
        diagrams={activeProject.diagrams}
        activeDiagramId={activeDiagram.id}
        onSelectDiagram={handleSelectDiagram}
        onAddDiagramClick={() => setIsNewDiagramModalOpen(true)}
        onDuplicateDiagram={handleDuplicateDiagram}
        onDeleteDiagram={handleDeleteDiagram}
        onRenameDiagram={handleRenameDiagram}
      />

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Left Component Palette */}
        <ComponentPalette
          currentDiagramType={activeDiagram.diagram_type}
          onAddNode={handleAddNode}
          onAddBoundary={handleAddBoundary}
        />

        {/* Central Visual Canvas */}
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => {
            setSelectedNodeId(node.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_, edge) => {
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
          onPaneClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
            if (isTracingActive) {
              handleClearTrace();
            }
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          preset={preset}
          diagramType={activeDiagram.diagram_type}
        />

        {/* Right Inspector Sidebars */}
        {selectedNode && (
          <NodeInspector
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onTraceReach={handleTraceReach}
            onClearReach={handleClearTrace}
            isTracingActive={isTracingActive}
          />
        )}

        {selectedBoundary && (
          <BoundaryInspector
            selectedBoundary={selectedBoundary}
            onUpdateBoundary={handleUpdateBoundary}
            onDeleteBoundary={handleDeleteNode}
          />
        )}

        {selectedEdge && (
          <EdgeInspector
            selectedEdge={selectedEdge}
            onUpdateEdge={handleUpdateEdge}
            onDeleteEdge={handleDeleteEdge}
          />
        )}

        {/* Bottom Interactive Route Inspector Bar */}
        <RouteInspectorBar
          nodes={nodes.filter(n => n.type === 'archifyNode') as Node<ArchifyNodeData>[]}
          onTraceRoute={handleTraceRoute}
          onClearTrace={handleClearTrace}
          isTracingActive={isTracingActive}
        />
      </div>

      {/* Projects Manager Modal */}
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        activeProjectId={activeProject.id}
        onSelectProject={handleSelectProject}
      />

      {/* Add New Diagram Tab Modal */}
      <NewDiagramModal
        isOpen={isNewDiagramModalOpen}
        onClose={() => setIsNewDiagramModalOpen(false)}
        onAddDiagram={handleAddDiagram}
      />

      {/* AI Architect Generator Modal */}
      <AIDiagramModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleApplyAIDiagram}
        currentDiagramType={activeDiagram.diagram_type}
      />

      {/* Architecture Audit & Linter Modal */}
      <ArchitectureAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        diagramIR={currentIR}
      />

      {/* Repo-to-Diagram Synthesizer Modal */}
      <RepoToDiagramModal
        isOpen={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        onApplyDiagram={handleApplyAIDiagram}
      />

      {/* JSON IR Editor Modal */}
      <JsonEditorModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        diagramIR={currentIR}
        onApplyJSON={(newIR) => {
          const { nodes: n, edges: e } = irToCanvas(newIR);
          setMeta(newIR.meta);
          setPreset(newIR.meta.preset);
          setNodes(n);
          setEdges(e);
        }}
      />

      {/* Export Formats Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        diagramIR={currentIR}
        project={activeProject}
        onExportShareCard={handleExportShareCard}
      />
    </div>
  );
}

export default App;

