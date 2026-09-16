import React, { useState } from 'react';
import { 
  Server, Database, Cloud, Cpu, Shield, Bot, Layers, Network, Globe, 
  HardDrive, Activity, Plus, Search, Box, ChevronLeft, ChevronRight,
  PanelLeftClose, PanelLeft
} from 'lucide-react';
import { NodeRole } from '../../types/archify';

interface PaletteItem {
  label: string;
  role: NodeRole;
  icon: string;
  iconComp: React.ElementType;
  tech: string;
  subtitle: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  { label: 'Web / Mobile Client', role: 'client', icon: 'Globe', iconComp: Globe, tech: 'React / Next.js', subtitle: 'User Interface Application' },
  { label: 'API Gateway / Ingress', role: 'gateway', icon: 'Layers', iconComp: Layers, tech: 'Kong / Envoy / Nginx', subtitle: 'Reverse Proxy & Traffic Router' },
  { label: 'Microservice / Backend', role: 'service', icon: 'Server', iconComp: Server, tech: 'Node / Go / Rust', subtitle: 'Domain Business Logic' },
  { label: 'Background Worker', role: 'worker', icon: 'Cpu', iconComp: Cpu, tech: 'Celery / BullMQ', subtitle: 'Async Job Processor' },
  { label: 'Relational Database', role: 'database', icon: 'Database', iconComp: Database, tech: 'PostgreSQL / MySQL', subtitle: 'Transactional Storage' },
  { label: 'In-Memory Cache', role: 'cache', icon: 'Activity', iconComp: Activity, tech: 'Redis / Memcached', subtitle: 'Low Latency Query Cache' },
  { label: 'Message Queue / Bus', role: 'queue', icon: 'Network', iconComp: Network, tech: 'Kafka / RabbitMQ / SQS', subtitle: 'Distributed Event Stream' },
  { label: 'AI Agent / LLM Engine', role: 'ai', icon: 'Bot', iconComp: Bot, tech: 'Claude / Gemini / OpenAI', subtitle: 'Generative Model Reasoning' },
  { label: 'Object Storage / S3', role: 'storage', icon: 'HardDrive', iconComp: HardDrive, tech: 'AWS S3 / Cloudflare R2', subtitle: 'Blob & Media Storage' },
  { label: 'Security & Auth Svc', role: 'security', icon: 'Shield', iconComp: Shield, tech: 'OAuth2 / Keycloak', subtitle: 'Identity & Access Control' },
  { label: 'Third-Party SaaS', role: 'external', icon: 'Cloud', iconComp: Cloud, tech: 'Stripe / SendGrid', subtitle: 'External REST Provider' },
];

interface Props {
  onAddNode: (item: PaletteItem) => void;
  onAddBoundary: () => void;
}

export const ComponentPalette: React.FC<Props> = ({ onAddNode, onAddBoundary }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = PALETTE_ITEMS.filter(item => 
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
          {PALETTE_ITEMS.map((item, idx) => {
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
              Components
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
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filter components..."
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
          <span>+ Add VPC / Zone Boundary</span>
        </button>

        <div className="pt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1">
          Building Blocks
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
