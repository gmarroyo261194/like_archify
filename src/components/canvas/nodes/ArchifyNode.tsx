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
      className={`relative min-w-[210px] max-w-[280px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer shadow-lg ${containerStyle} ${highlightBorder} ${
        isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100'
      }`}
    >
      {/* 4 Directional Connection Handles */}
      <Handle type="target" position={Position.Top} className="!-top-1.5" />
      <Handle type="source" position={Position.Bottom} className="!-bottom-1.5" />
      <Handle type="target" position={Position.Left} id="left-t" className="!-left-1.5" />
      <Handle type="source" position={Position.Right} id="right-s" className="!-right-1.5" />

      {/* Top Meta Bar: Role Badge + Status Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
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
            className={`w-2 h-2 rounded-full ${
              data.status === 'warning'
                ? 'bg-amber-400 animate-pulse'
                : data.status === 'degraded'
                ? 'bg-rose-500'
                : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
            }`}
            title={`Status: ${data.status || 'healthy'}`}
          />
        </div>
      </div>

      {/* Main Node Content: Icon + Title */}
      <div className="flex items-start gap-2.5">
        <div className={`p-2 rounded-lg border flex-shrink-0 ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`}>
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
