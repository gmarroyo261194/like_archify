const fs = require('fs');
const path = require('path');

function write(file, content) {
  const full = path.resolve(__dirname, '..', file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote ' + file);
}

// 1. types/archify.ts
write('src/types/archify.ts', `
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
  | 'external';

export interface ArchifyNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  subtitle?: string;
  role: NodeRole;
  icon?: string;
  tech?: string;
  port?: string | number;
  status?: 'healthy' | 'warning' | 'degraded' | 'inactive';
  gitUrl?: string;
  metadata?: Record<string, string>;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  reachType?: 'upstream' | 'downstream' | 'none';
}

export interface ArchifyEdgeData extends Record<string, unknown> {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  animated?: boolean;
  latency?: string;
  dataRate?: string;
  authType?: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export interface ArchifyBoundaryData extends Record<string, unknown> {
  id: string;
  label: string;
  type: 'vpc' | 'cluster' | 'subnet' | 'zone' | 'security-group';
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
    latency?: string;
    data_rate?: string;
    auth_type?: string;
  }[];
}
`);

// 2. src/index.css
write('src/index.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-main: #0a0d14;
    --panel-bg: #111726;
    --panel-border: #1e293b;
    --text-primary: #f8fafc;
    --text-muted: #94a3b8;
    --accent: #38bdf8;
    --accent-glow: rgba(56, 189, 248, 0.25);
  }

  .light {
    --bg-main: #f8fafc;
    --panel-bg: #ffffff;
    --panel-border: #e2e8f0;
    --text-primary: #0f172a;
    --text-muted: #64748b;
    --accent: #0284c7;
    --accent-glow: rgba(2, 132, 199, 0.2);
  }

  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    overflow: hidden;
    margin: 0;
    padding: 0;
    user-select: none;
  }
}

/* React Flow Custom Theme Overrides */
.react-flow__attribution {
  display: none !important;
}

.react-flow__handle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #38bdf8;
  border: 2px solid #0f172a;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.react-flow__handle:hover {
  transform: scale(1.4);
  background: #00f2fe;
}

/* Signal Flow Particles */
@keyframes signalPacket {
  0% {
    offset-distance: 0%;
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0.2;
  }
}

.animate-signal {
  stroke-dasharray: 6 6;
  animation: flowSignal 1s linear infinite;
}

@keyframes flowSignal {
  to {
    stroke-dashoffset: -12;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.5);
}
`);

console.log('Base types and css written');
