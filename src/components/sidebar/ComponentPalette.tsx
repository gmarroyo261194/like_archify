import React, { useState } from 'react';
import { 
  Server, Database, Cloud, Cpu, Shield, Bot, Layers, Network, Globe, 
  HardDrive, Activity, Plus, Search, Box, PanelLeftClose, PanelLeft,
  GitBranch, ArrowRightLeft, Radio, RefreshCw, CheckCircle2
} from 'lucide-react';
import { NodeRole, NodeShape, DiagramType } from '../../types/archify';

export interface PaletteItem {
  label: string;
  role: NodeRole;
  shape?: NodeShape;
  icon: string;
  iconComp: React.ElementType;
  tech: string;
  subtitle: string;
}

const PALETTES_BY_TYPE: Record<DiagramType, { title: string; boundaryName: string; items: PaletteItem[] }> = {
  architecture: {
    title: 'Architecture Blocks',
    boundaryName: '+ Add VPC / Zone Boundary',
    items: [
      { label: 'Web / Mobile Client', role: 'client', shape: 'box', icon: 'Globe', iconComp: Globe, tech: 'React / Next.js', subtitle: 'User Interface Application' },
      { label: 'API Gateway / Ingress', role: 'gateway', shape: 'box', icon: 'Layers', iconComp: Layers, tech: 'Kong / Envoy / Nginx', subtitle: 'Reverse Proxy & Traffic Router' },
      { label: 'Microservice / Backend', role: 'service', shape: 'box', icon: 'Server', iconComp: Server, tech: 'Node / Go / Rust', subtitle: 'Domain Business Logic' },
      { label: 'Background Worker', role: 'worker', shape: 'box', icon: 'Cpu', iconComp: Cpu, tech: 'Celery / BullMQ', subtitle: 'Async Job Processor' },
      { label: 'Relational Database', role: 'database', shape: 'box', icon: 'Database', iconComp: Database, tech: 'PostgreSQL / MySQL', subtitle: 'Transactional Storage' },
      { label: 'In-Memory Cache', role: 'cache', shape: 'box', icon: 'Activity', iconComp: Activity, tech: 'Redis / Memcached', subtitle: 'Low Latency Query Cache' },
      { label: 'Message Queue / Bus', role: 'queue', shape: 'box', icon: 'Network', iconComp: Network, tech: 'Kafka / RabbitMQ / SQS', subtitle: 'Distributed Event Stream' },
      { label: 'AI Agent / LLM Engine', role: 'ai', shape: 'box', icon: 'Bot', iconComp: Bot, tech: 'Claude / Gemini / OpenAI', subtitle: 'Generative Model Reasoning' },
      { label: 'Object Storage / S3', role: 'storage', shape: 'box', icon: 'HardDrive', iconComp: HardDrive, tech: 'AWS S3 / Cloudflare R2', subtitle: 'Blob & Media Storage' },
      { label: 'Security & Auth Svc', role: 'security', shape: 'box', icon: 'Shield', iconComp: Shield, tech: 'OAuth2 / Keycloak', subtitle: 'Identity & Access Control' },
      { label: 'Third-Party SaaS', role: 'external', shape: 'box', icon: 'Cloud', iconComp: Cloud, tech: 'Stripe / SendGrid', subtitle: 'External REST Provider' }
    ]
  },
  workflow: {
    title: 'Workflow Elements',
    boundaryName: '+ Add Workflow Phase / Lane',
    items: [
      { label: 'Start Trigger Event', role: 'event', shape: 'circle', icon: 'Activity', iconComp: Activity, tech: 'Event Ingress', subtitle: 'Initiating workflow trigger' },
      { label: 'Task / Execution Step', role: 'service', shape: 'box', icon: 'Server', iconComp: Server, tech: 'Action Execution', subtitle: 'Automated processing step' },
      { label: 'Decision Gate / Branch', role: 'decision', shape: 'diamond', icon: 'Shield', iconComp: Shield, tech: 'Conditional Check', subtitle: 'Human-in-the-loop / IF logic' },
      { label: 'AI Cognitive Agent', role: 'ai', shape: 'box', icon: 'Bot', iconComp: Bot, tech: 'LLM Reasoning', subtitle: 'Autonomous reasoning step' },
      { label: 'TDD Test Runner Gate', role: 'decision', shape: 'diamond', icon: 'Layers', iconComp: Layers, tech: 'Vitest / Gate', subtitle: 'Pass / Fail test assertion' },
      { label: 'End / Terminal Event', role: 'event', shape: 'circle', icon: 'CheckCircle2', iconComp: CheckCircle2, tech: 'Terminal State', subtitle: 'Final workflow outcome' }
    ]
  },
  sequence: {
    title: 'Sequence Lifelines',
    boundaryName: '+ Add Interaction Frame / Phase',
    items: [
      { label: 'Client / User Actor', role: 'client', shape: 'participant', icon: 'Globe', iconComp: Globe, tech: 'SPA / Mobile App', subtitle: 'Initiating user actor' },
      { label: 'API Ingress Gateway', role: 'gateway', shape: 'participant', icon: 'Layers', iconComp: Layers, tech: 'Kong / Envoy', subtitle: 'Reverse proxy router' },
      { label: 'Domain Microservice', role: 'service', shape: 'participant', icon: 'Server', iconComp: Server, tech: 'Go / Node / Java', subtitle: 'Business API worker' },
      { label: 'Identity / Auth Server', role: 'security', shape: 'participant', icon: 'Shield', iconComp: Shield, tech: 'OAuth2 / OIDC IdP', subtitle: 'Token issuer' },
      { label: 'In-Memory Cache', role: 'cache', shape: 'participant', icon: 'Activity', iconComp: Activity, tech: 'Redis / Memcached', subtitle: 'Low-latency query cache' },
      { label: 'Persistence Database', role: 'database', shape: 'participant', icon: 'Database', iconComp: Database, tech: 'PostgreSQL / Mongo', subtitle: 'State & transaction store' },
      { label: 'Event Broker / Queue', role: 'queue', shape: 'participant', icon: 'Network', iconComp: Network, tech: 'Kafka / SQS', subtitle: 'Async message broker' },
      { label: 'AI Agent / Model', role: 'ai', shape: 'participant', icon: 'Bot', iconComp: Bot, tech: 'Gemini / Claude / OpenAI', subtitle: 'Reasoning & inference' },
      { label: 'External SaaS / Webhook', role: 'external', shape: 'participant', icon: 'Cloud', iconComp: Cloud, tech: 'Stripe / SendGrid', subtitle: 'Third-party API' }
    ]
  },
  dataflow: {
    title: 'Dataflow Stages',
    boundaryName: '+ Add Processing Stage / Zone',
    items: [
      { label: 'Clickstream Event Log', role: 'queue', shape: 'box', icon: 'Network', iconComp: Network, tech: 'Apache Kafka / Redpanda', subtitle: 'Raw event stream ingestion' },
      { label: 'CDC Database Log', role: 'service', shape: 'box', icon: 'Layers', iconComp: Layers, tech: 'Debezium CDC Stream', subtitle: 'Row change replication' },
      { label: 'Stream Processing Engine', role: 'worker', shape: 'box', icon: 'Cpu', iconComp: Cpu, tech: 'Apache Flink / Spark', subtitle: 'Real-time windowed aggregation' },
      { label: 'Vector Embedding Stage', role: 'ai', shape: 'box', icon: 'Bot', iconComp: Bot, tech: 'Text-Embedding-3', subtitle: 'Dense vector representations' },
      { label: 'Vector Similarity Index', role: 'database', shape: 'box', icon: 'Database', iconComp: Database, tech: 'Qdrant / Milvus', subtitle: 'HNSW vector store' },
      { label: 'Iceberg Cold Lakehouse', role: 'storage', shape: 'box', icon: 'HardDrive', iconComp: HardDrive, tech: 'Apache Iceberg / S3', subtitle: 'Parquet columnar warehouse' }
    ]
  },
  lifecycle: {
    title: 'State Machine States',
    boundaryName: '+ Add State Machine Lane',
    items: [
      { label: '[INITIAL_STATE]', role: 'state', shape: 'state', icon: 'Activity', iconComp: Activity, tech: 'Initial State', subtitle: 'Start of entity lifecycle' },
      { label: '[PENDING / TRANSIENT]', role: 'state', shape: 'state', icon: 'Shield', iconComp: Shield, tech: 'Transient State', subtitle: 'Awaiting webhook or event' },
      { label: '[ACTIVE / PROCESSING]', role: 'state', shape: 'state', icon: 'Layers', iconComp: Layers, tech: 'Active State', subtitle: 'Normal processing state' },
      { label: '[FAILED / ERROR]', role: 'state', shape: 'state', icon: 'Shield', iconComp: Shield, tech: 'Degraded State', subtitle: 'Exception or rejected guard' },
      { label: '[TERMINAL / SETTLED]', role: 'state', shape: 'state', icon: 'Database', iconComp: Database, tech: 'Terminal State', subtitle: 'Closed immutable state' }
    ]
  }
};

interface Props {
  currentDiagramType?: DiagramType;
  onAddNode: (item: PaletteItem) => void;
  onAddBoundary: () => void;
}

export const ComponentPalette: React.FC<Props> = ({ 
  currentDiagramType = 'architecture',
  onAddNode, 
  onAddBoundary 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<DiagramType>(currentDiagramType);
  const [search, setSearch] = useState('');

  // Sync tab if diagram type changes from outside
  React.useEffect(() => {
    setActiveTab(currentDiagramType);
  }, [currentDiagramType]);

  const currentPalette = PALETTES_BY_TYPE[activeTab] || PALETTES_BY_TYPE.architecture;

  const filtered = currentPalette.items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.tech.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  const onDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData('application/archify-node', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  if (isCollapsed) {
    return (
      <div className="w-14 bg-[#111726]/95 border-r border-[#1e293b] flex flex-col items-center py-3 h-full z-10 select-none transition-all duration-200">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-sky-400 transition-all mb-3 shadow-lg"
          title="Expand Palette"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onAddBoundary}
          className="p-2.5 rounded-xl border border-dashed border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/20 text-sky-400 mb-2 transition-all"
          title="Add Boundary"
        >
          <Box className="w-4 h-4" />
        </button>

        <div className="w-8 h-[1px] bg-slate-800 my-1" />

        <div className="flex-1 overflow-y-auto space-y-2 py-1 flex flex-col items-center w-full px-1">
          {currentPalette.items.map((item, idx) => {
            const Icon = item.iconComp;
            return (
              <div
                key={idx}
                draggable
                onDragStart={(e) => onDragStart(e, item)}
                onClick={() => onAddNode(item)}
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-800 text-sky-400 cursor-grab active:cursor-grabbing transition-all group"
                title={`${item.label} (${item.tech})`}
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#111726]/95 border-r border-[#1e293b] flex flex-col h-full z-10 select-none transition-all duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1e293b]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Palette
            </h3>
            <span className="text-[10px] text-sky-400 font-mono">Drag / Click</span>
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Diagram Type Quick Switcher Tabs */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-lg mb-2.5">
          {(['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle'] as DiagramType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all truncate text-center ${
                activeTab === type
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`Switch palette to ${type}`}
            >
              {type.slice(0, 3)}
            </button>
          ))}
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder={`Filter ${activeTab} elements...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Palette Items List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {/* Add Boundary Container Button */}
        <button
          onClick={onAddBoundary}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-dashed border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/10 text-sky-300 text-xs font-medium transition-all group"
        >
          <Box className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <span>{currentPalette.boundaryName}</span>
        </button>

        <div className="pt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">
          {currentPalette.title}
        </div>

        {filtered.map((item, idx) => {
          const Icon = item.iconComp;
          return (
            <div
              key={idx}
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              onClick={() => onAddNode(item)}
              className="flex items-center justify-between p-2 rounded-lg border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-700 cursor-grab active:cursor-grabbing transition-all group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700/60 group-hover:border-sky-500/50 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    {item.tech}
                  </p>
                </div>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
