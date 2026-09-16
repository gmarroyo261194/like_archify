const fs = require('fs');
const path = require('path');

function write(file, content) {
  const full = path.resolve(__dirname, '..', file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote ' + file);
}

// 1. Templates
write('src/lib/templates/defaultTemplates.ts', `
import { ArchifyDiagramIR } from '../../types/archify';

export const TEMPLATE_WEB_APP: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'architecture',
  meta: {
    title: 'Cloud-Native 3-Tier Web Application',
    description: 'High-availability web architecture with CDN caching, API gateway, microservices, and database replication.',
    version: '1.2.0',
    author: 'Archify Visual Studio',
    updated_at: new Date().toISOString(),
    preset: 'signal-flow',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'b-public',
      label: 'Edge & Ingress Zone',
      type: 'zone',
      position: { x: 50, y: 100 },
      size: { width: 340, height: 480 }
    },
    {
      id: 'b-internal',
      label: 'Private VPC (App Cluster)',
      type: 'vpc',
      position: { x: 440, y: 100 },
      size: { width: 440, height: 480 }
    },
    {
      id: 'b-data',
      label: 'Data & Persistence Tier',
      type: 'subnet',
      position: { x: 930, y: 100 },
      size: { width: 340, height: 480 }
    }
  ],
  nodes: [
    {
      id: 'client-users',
      label: 'End Users',
      subtitle: 'Browser / Mobile App',
      role: 'client',
      tech: 'React / Swift',
      icon: 'Globe',
      status: 'healthy',
      boundary_id: 'b-public',
      position: { x: 90, y: 160 }
    },
    {
      id: 'edge-cdn',
      label: 'Cloudflare CDN & WAF',
      subtitle: 'DDoS Protection & SSL',
      role: 'security',
      tech: 'Cloudflare',
      icon: 'Shield',
      status: 'healthy',
      boundary_id: 'b-public',
      position: { x: 90, y: 320 }
    },
    {
      id: 'api-gateway',
      label: 'Kong Ingress Gateway',
      subtitle: 'Auth & Rate Limiting',
      role: 'gateway',
      tech: 'Kong / Envoy',
      icon: 'Layers',
      port: 443,
      status: 'healthy',
      boundary_id: 'b-internal',
      position: { x: 480, y: 160 }
    },
    {
      id: 'auth-service',
      label: 'Auth Microservice',
      subtitle: 'JWT / OAuth2 / OIDC',
      role: 'service',
      tech: 'Go / gRPC',
      icon: 'Shield',
      port: 8081,
      status: 'healthy',
      boundary_id: 'b-internal',
      position: { x: 480, y: 320 }
    },
    {
      id: 'core-api',
      label: 'Core API Service',
      subtitle: 'Business Domain Logic',
      role: 'service',
      tech: 'Node.js / Express',
      icon: 'Server',
      port: 8080,
      status: 'healthy',
      boundary_id: 'b-internal',
      position: { x: 670, y: 220 }
    },
    {
      id: 'cache-redis',
      label: 'Redis Cluster',
      subtitle: 'Session & Query Cache',
      role: 'cache',
      tech: 'Redis v7',
      icon: 'Database',
      port: 6379,
      status: 'healthy',
      boundary_id: 'b-data',
      position: { x: 970, y: 160 }
    },
    {
      id: 'db-postgres',
      label: 'PostgreSQL Primary',
      subtitle: 'ACID Relational Storage',
      role: 'database',
      tech: 'Postgres 16',
      icon: 'Database',
      port: 5432,
      status: 'healthy',
      boundary_id: 'b-data',
      position: { x: 970, y: 320 }
    }
  ],
  edges: [
    {
      id: 'e-1',
      source: 'client-users',
      target: 'edge-cdn',
      label: 'HTTPS Requests',
      protocol: 'HTTPS / TLS 1.3',
      animated: true,
      latency: '15ms'
    },
    {
      id: 'e-2',
      source: 'edge-cdn',
      target: 'api-gateway',
      label: 'Proxy Ingress',
      protocol: 'HTTP/2',
      animated: true,
      latency: '8ms'
    },
    {
      id: 'e-3',
      source: 'api-gateway',
      target: 'auth-service',
      label: 'Verify Token',
      protocol: 'gRPC',
      animated: true,
      latency: '2ms'
    },
    {
      id: 'e-4',
      source: 'api-gateway',
      target: 'core-api',
      label: 'Dispatch Route',
      protocol: 'HTTP/2',
      animated: true,
      latency: '3ms'
    },
    {
      id: 'e-5',
      source: 'core-api',
      target: 'cache-redis',
      label: 'Cache Get / Set',
      protocol: 'TCP / RESP',
      animated: true,
      latency: '1ms'
    },
    {
      id: 'e-6',
      source: 'core-api',
      target: 'db-postgres',
      label: 'SQL Queries',
      protocol: 'SQL Connection Pool',
      animated: true,
      latency: '4ms'
    }
  ]
};

export const TEMPLATE_AI_AGENT: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'workflow',
  meta: {
    title: 'Autonomous Multi-Agent AI Workflow',
    description: 'Autonomous orchestrator dispatching vector search, memory extraction, tool calls, and model reasoning.',
    version: '2.0.0',
    author: 'Archify Visual Studio',
    updated_at: new Date().toISOString(),
    preset: 'blueprint',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'b-agent-core',
      label: 'Agent Runtime Core',
      type: 'cluster',
      position: { x: 100, y: 100 },
      size: { width: 420, height: 460 }
    },
    {
      id: 'b-inference-tools',
      label: 'Inference & Context Backend',
      type: 'vpc',
      position: { x: 580, y: 100 },
      size: { width: 500, height: 460 }
    }
  ],
  nodes: [
    {
      id: 'user-prompt',
      label: 'User Intent / Prompt',
      subtitle: 'Interactive Chat Session',
      role: 'client',
      tech: 'SSE / Stream',
      icon: 'Bot',
      status: 'healthy',
      boundary_id: 'b-agent-core',
      position: { x: 140, y: 160 }
    },
    {
      id: 'agent-orchestrator',
      label: 'Agent Orchestrator',
      subtitle: 'DAG Planning & State Machine',
      role: 'ai',
      tech: 'Python / LangGraph',
      icon: 'Cpu',
      status: 'healthy',
      boundary_id: 'b-agent-core',
      position: { x: 140, y: 320 }
    },
    {
      id: 'vector-memory',
      label: 'Semantic Memory & RAG',
      subtitle: 'Vector Index / HNSW',
      role: 'database',
      tech: 'Qdrant / Pinecone',
      icon: 'Database',
      status: 'healthy',
      boundary_id: 'b-inference-tools',
      position: { x: 620, y: 160 }
    },
    {
      id: 'llm-engine',
      label: 'LLM Reasoning Core',
      subtitle: 'Claude 3.7 / Gemini Pro',
      role: 'ai',
      tech: 'Anthropic / Google API',
      icon: 'Bot',
      status: 'healthy',
      boundary_id: 'b-inference-tools',
      position: { x: 840, y: 240 }
    },
    {
      id: 'tool-registry',
      label: 'MCP Tool Executor',
      subtitle: 'Sandbox & System Exec',
      role: 'worker',
      tech: 'Docker / Sandbox',
      icon: 'Server',
      status: 'healthy',
      boundary_id: 'b-inference-tools',
      position: { x: 620, y: 360 }
    }
  ],
  edges: [
    {
      id: 'ae-1',
      source: 'user-prompt',
      target: 'agent-orchestrator',
      label: 'User Query',
      protocol: 'WebSocket',
      animated: true
    },
    {
      id: 'ae-2',
      source: 'agent-orchestrator',
      target: 'vector-memory',
      label: 'Retrieve Context',
      protocol: 'gRPC / Embeddings',
      animated: true
    },
    {
      id: 'ae-3',
      source: 'agent-orchestrator',
      target: 'llm-engine',
      label: 'Prompt + History',
      protocol: 'REST Stream',
      animated: true
    },
    {
      id: 'ae-4',
      source: 'llm-engine',
      target: 'tool-registry',
      label: 'Invoke MCP Tool',
      protocol: 'JSON-RPC',
      animated: true
    },
    {
      id: 'ae-5',
      source: 'tool-registry',
      target: 'agent-orchestrator',
      label: 'Tool Observations',
      protocol: 'Async Feedback',
      animated: true
    }
  ]
};

export const TEMPLATE_MICROSERVICES: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'dataflow',
  meta: {
    title: 'Event-Driven Financial Microservices',
    description: 'Decoupled banking architecture leveraging Apache Kafka event bus for async order processing and settlement.',
    version: '3.1.0',
    author: 'Archify Visual Studio',
    updated_at: new Date().toISOString(),
    preset: 'classic',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'b-services',
      label: 'Core Banking Cluster',
      type: 'cluster',
      position: { x: 80, y: 120 },
      size: { width: 380, height: 420 }
    },
    {
      id: 'b-event-bus',
      label: 'Event Streaming Backbone',
      type: 'vpc',
      position: { x: 510, y: 120 },
      size: { width: 300, height: 420 }
    },
    {
      id: 'b-analytics',
      label: 'Analytics & Reporting Data Lake',
      type: 'zone',
      position: { x: 860, y: 120 },
      size: { width: 340, height: 420 }
    }
  ],
  nodes: [
    {
      id: 'payment-svc',
      label: 'Payment Gateway Svc',
      subtitle: 'Card & Crypto Processing',
      role: 'service',
      tech: 'Rust / Actix',
      icon: 'Shield',
      status: 'healthy',
      boundary_id: 'b-services',
      position: { x: 120, y: 180 }
    },
    {
      id: 'ledger-svc',
      label: 'Double-Entry Ledger',
      subtitle: 'Immutable Transaction Journal',
      role: 'service',
      tech: 'Java / Spring Boot',
      icon: 'Server',
      status: 'healthy',
      boundary_id: 'b-services',
      position: { x: 120, y: 340 }
    },
    {
      id: 'kafka-bus',
      label: 'Apache Kafka Cluster',
      subtitle: 'High-Throughput Log Stream',
      role: 'queue',
      tech: 'Kafka 3.6 / KRaft',
      icon: 'Network',
      status: 'healthy',
      boundary_id: 'b-event-bus',
      position: { x: 550, y: 260 }
    },
    {
      id: 'fraud-detector',
      label: 'ML Fraud Detector',
      subtitle: 'Realtime Anomaly Scoring',
      role: 'ai',
      tech: 'Python / Flink',
      icon: 'Bot',
      status: 'healthy',
      boundary_id: 'b-analytics',
      position: { x: 900, y: 180 }
    },
    {
      id: 'clickhouse-dw',
      label: 'ClickHouse Data Warehouse',
      subtitle: 'OLAP Real-Time Analytics',
      role: 'database',
      tech: 'ClickHouse Columnar',
      icon: 'Database',
      status: 'healthy',
      boundary_id: 'b-analytics',
      position: { x: 900, y: 340 }
    }
  ],
  edges: [
    {
      id: 'me-1',
      source: 'payment-svc',
      target: 'kafka-bus',
      label: 'TxInitiated Event',
      protocol: 'Kafka Producer',
      animated: true
    },
    {
      id: 'me-2',
      source: 'kafka-bus',
      target: 'ledger-svc',
      label: 'Commit Ledger',
      protocol: 'Kafka Consumer',
      animated: true
    },
    {
      id: 'me-3',
      source: 'kafka-bus',
      target: 'fraud-detector',
      label: 'Stream Events',
      protocol: 'Kafka Consumer Group',
      animated: true
    },
    {
      id: 'me-4',
      source: 'fraud-detector',
      target: 'clickhouse-dw',
      label: 'Store Risk Audit',
      protocol: 'TCP Ingest',
      animated: true
    }
  ]
};
`);

// 2. Custom Node Component
write('src/components/canvas/nodes/ArchifyNode.tsx', `
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Server, Database, Cloud, Cpu, Shield, Bot, Layers, Network, Globe, 
  HardDrive, Lock, Activity, ExternalLink 
} from 'lucide-react';
import { ArchifyNodeData, NodeRole, PresetType, ThemeType } from '../../../types/archify';

const ICON_MAP: Record<string, React.ElementType> = {
  Server,
  Database,
  Cloud,
  Cpu,
  Shield,
  Bot,
  Layers,
  Network,
  Globe,
  HardDrive,
  Lock,
  Activity
};

const ROLE_COLORS: Record<NodeRole, { bg: string; text: string; border: string; glow: string }> = {
  client: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' },
  gateway: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/20' },
  service: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' },
  worker: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/40', glow: 'shadow-indigo-500/20' },
  database: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' },
  cache: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/40', glow: 'shadow-orange-500/20' },
  queue: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/40', glow: 'shadow-purple-500/20' },
  ai: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/40', glow: 'shadow-fuchsia-500/20' },
  storage: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/40', glow: 'shadow-teal-500/20' },
  security: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/40', glow: 'shadow-rose-500/20' },
  external: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/40', glow: 'shadow-slate-500/20' }
};

interface CustomNodeProps extends NodeProps {
  data: ArchifyNodeData & {
    preset?: PresetType;
    theme?: ThemeType;
  };
}

export const ArchifyNode = memo(({ data, selected }: CustomNodeProps) => {
  const role = data.role || 'service';
  const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.service;
  const IconComponent = (data.icon && ICON_MAP[data.icon]) ? ICON_MAP[data.icon] : Server;
  const preset = data.preset || 'signal-flow';

  const isHighlighted = data.isHighlighted;
  const isDimmed = data.isDimmed;

  // Preset based styling
  let containerStyle = 'bg-[#111726]/90 border-[#1e293b] text-slate-100 backdrop-blur-md';
  if (preset === 'blueprint') {
    containerStyle = 'bg-[#0b192e]/95 border-[#1d4ed8] text-blue-100 font-mono';
  } else if (preset === 'classic') {
    containerStyle = 'bg-[#1e293b]/95 border-slate-700 text-slate-100 shadow-xl';
  } else if (preset === 'minimal') {
    containerStyle = 'bg-[#0f172a]/95 border-slate-800 text-slate-200';
  }

  const highlightBorder = isHighlighted
    ? 'border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[1.03]'
    : selected
    ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
    : roleStyle.border;

  return (
    <div
      className={\`relative min-w-[210px] max-w-[280px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer shadow-lg \${containerStyle} \${highlightBorder} \${
        isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100'
      }\`}
    >
      {/* 4 Directional Connection Handles */}
      <Handle type="target" position={Position.Top} className="!-top-1.5" />
      <Handle type="source" position={Position.Bottom} className="!-bottom-1.5" />
      <Handle type="target" position={Position.Left} id="left-t" className="!-left-1.5" />
      <Handle type="source" position={Position.Right} id="right-s" className="!-right-1.5" />

      {/* Top Meta Bar: Role Badge + Status Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={\`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md border \${roleStyle.bg} \${roleStyle.text} \${roleStyle.border}\`}
        >
          {role}
        </span>
        
        <div className="flex items-center gap-1.5">
          {data.port && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
              :{data.port}
            </span>
          )}
          <div
            className={\`w-2 h-2 rounded-full \${
              data.status === 'warning'
                ? 'bg-amber-400 animate-pulse'
                : data.status === 'degraded'
                ? 'bg-rose-500'
                : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
            }\`}
            title={\`Status: \${data.status || 'healthy'}\`}
          />
        </div>
      </div>

      {/* Main Node Content: Icon + Title */}
      <div className="flex items-start gap-2.5">
        <div className={\`p-2 rounded-lg border flex-shrink-0 \${roleStyle.bg} \${roleStyle.border} \${roleStyle.text}\`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold tracking-tight text-white truncate">
            {data.label}
          </h4>
          {data.subtitle && (
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer: Tech stack tag + Git url indicator */}
      {(data.tech || data.gitUrl) && (
        <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
          {data.tech ? (
            <span className="font-mono text-slate-300 truncate max-w-[150px]">
              {data.tech}
            </span>
          ) : <span />}

          {data.gitUrl && (
            <span className="flex items-center gap-0.5 text-sky-400 hover:underline" title={data.gitUrl}>
              <ExternalLink className="w-3 h-3" />
              <span>src</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
});

ArchifyNode.displayName = 'ArchifyNode';
`);

// 3. Custom Edge Component
write('src/components/canvas/edges/ArchifyEdge.tsx', `
import React, { memo } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { ArchifyEdgeData } from '../../../types/archify';

export const ArchifyEdge = memo(({
  id,
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
}: EdgeProps<ArchifyEdgeData>) => {
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

  const strokeColor = isHighlighted 
    ? '#22d3ee' 
    : selected 
    ? '#38bdf8' 
    : '#475569';

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
          ...style,
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 2.5 : selected ? 2 : 1.5,
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
              transform: \`translate(-50%, -50%) translate(\${labelX}px,\${labelY}px)\`,
              pointerEvents: 'all'
            }}
            className={\`nodrag nopan flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono transition-all \${
              isHighlighted
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                : selected
                ? 'bg-sky-950/90 border-sky-400 text-sky-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            } \${isDimmed ? 'opacity-20' : 'opacity-100'}\`}
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
`);

// 4. Custom Boundary Group Component
write('src/components/canvas/boundaries/BoundaryNode.tsx', `
import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { ArchifyBoundaryData } from '../../../types/archify';
import { Shield, Cloud, Layers, Box } from 'lucide-react';

const BOUNDARY_ICONS = {
  vpc: Cloud,
  cluster: Layers,
  subnet: Box,
  zone: Shield,
  'security-group': Shield
};

export const BoundaryNode = memo(({ data, selected }: NodeProps<ArchifyBoundaryData>) => {
  const type = data.type || 'vpc';
  const Icon = BOUNDARY_ICONS[type] || Cloud;

  return (
    <div
      className={\`w-full h-full rounded-2xl border-2 border-dashed p-4 transition-all pointer-events-none \${
        selected 
          ? 'border-sky-400 bg-sky-500/[0.04]' 
          : 'border-slate-700/60 bg-slate-900/[0.25]'
      }\`}
    >
      <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-[11px] font-bold">
        <Icon className="w-3.5 h-3.5 text-sky-400" />
        <span>{data.label}</span>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {type}
        </span>
      </div>
    </div>
  );
});

BoundaryNode.displayName = 'BoundaryNode';
`);

console.log('Canvas node & edge primitives written');
