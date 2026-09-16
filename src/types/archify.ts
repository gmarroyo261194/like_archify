export type DiagramType = 'architecture' | 'workflow' | 'sequence' | 'dataflow' | 'lifecycle';
export type PresetType = 'signal-flow' | 'blueprint' | 'classic' | 'minimal';
export type ThemeType = 'dark' | 'light';

export type NodeRole = 
  | 'client' 
  | 'gateway' 
  | 'service' 
  | 'worker' 
  | 'database' 
  | 'cache' 
  | 'queue' 
  | 'ai' 
  | 'storage' 
  | 'security' 
  | 'external'
  | 'decision'
  | 'event'
  | 'state'
  | 'stage'
  | 'participant';

export type NodeShape = 'box' | 'diamond' | 'circle' | 'pill' | 'participant' | 'state';

export interface ArchifyNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  subtitle?: string;
  role: NodeRole;
  shape?: NodeShape;
  icon?: string;
  tech?: string;
  port?: string | number;
  status?: 'healthy' | 'warning' | 'degraded' | 'inactive';
  gitUrl?: string;
  metadata?: Record<string, string>;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  reachType?: 'upstream' | 'downstream' | 'none';
  diagramType?: DiagramType;
}

export interface ArchifyEdgeData extends Record<string, unknown> {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  animated?: boolean;
  edgeType?: 'solid' | 'dashed' | 'return' | 'conditional';
  latency?: string;
  dataRate?: string;
  authType?: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export interface ArchifyBoundaryData extends Record<string, unknown> {
  id: string;
  label: string;
  type: string;
  color?: string;
}

export interface ArchifyDiagramIR {
  schema_version: '2.0.0';
  diagram_type: DiagramType;
  meta: {
    title: string;
    description?: string;
    version: string;
    author?: string;
    updated_at: string;
    preset: PresetType;
    theme: ThemeType;
  };
  boundaries: {
    id: string;
    label: string;
    type: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }[];
  nodes: {
    id: string;
    label: string;
    subtitle?: string;
    role: NodeRole;
    shape?: NodeShape;
    tech?: string;
    icon?: string;
    port?: string | number;
    status?: string;
    git_url?: string;
    boundary_id?: string;
    position: { x: number; y: number };
    metadata?: Record<string, string>;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    label?: string;
    protocol?: string;
    animated?: boolean;
    edge_type?: string;
    latency?: string;
    data_rate?: string;
    auth_type?: string;
  }[];
}
