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
  external: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/40', glow: 'shadow-slate-500/20' },
  decision: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/60', glow: 'shadow-amber-500/30' },
  event: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/60', glow: 'shadow-emerald-500/30' },
  state: { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/60', glow: 'shadow-violet-500/30' },
  stage: { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/60', glow: 'shadow-sky-500/30' },
  participant: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/60', glow: 'shadow-blue-500/30' }
};

interface CustomNodeProps extends NodeProps {
  data: ArchifyNodeData & {
    preset?: PresetType;
    theme?: ThemeType;
  };
}

export const ArchifyNode = memo(({ data, selected }: CustomNodeProps) => {
  const role = data.role || 'service';
  const shape = data.shape || 'box';
  const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.service;
  const IconComponent = (data.icon && ICON_MAP[data.icon]) ? ICON_MAP[data.icon] : Server;
  const preset = data.preset || 'signal-flow';

  const isHighlighted = data.isHighlighted;
  const isDimmed = data.isDimmed;

  const theme = data.theme || 'dark';
  const isLight = theme === 'light';

  let containerBg = isLight 
    ? 'bg-white/95 border-slate-200 text-slate-900 shadow-md backdrop-blur-md'
    : 'bg-[#111726]/90 border-[#1e293b] text-slate-100 backdrop-blur-md';

  if (preset === 'blueprint') {
    containerBg = isLight
      ? 'bg-[#eff6ff]/95 border-[#3b82f6] text-blue-950 font-mono shadow-md'
      : 'bg-[#0b192e]/95 border-[#1d4ed8] text-blue-100 font-mono';
  } else if (preset === 'classic') {
    containerBg = isLight
      ? 'bg-slate-100/95 border-slate-300 text-slate-900 shadow-lg'
      : 'bg-[#1e293b]/95 border-slate-700 text-slate-100 shadow-xl';
  } else if (preset === 'minimal') {
    containerBg = isLight
      ? 'bg-slate-50/95 border-slate-200 text-slate-800'
      : 'bg-[#0f172a]/95 border-slate-800 text-slate-200';
  }

  const highlightBorder = isHighlighted
    ? 'border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[1.03]'
    : selected
    ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
    : roleStyle.border;

  // 1. Diamond Shape (Workflow Decision Gate)
  if (shape === 'diamond') {
    return (
      <div
        className={`relative w-[130px] h-[130px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
          isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100'
        }`}
      >
        <Handle type="target" position={Position.Top} className="!-top-1" />
        <Handle type="source" position={Position.Bottom} className="!-bottom-1" />
        <Handle type="target" position={Position.Left} id="left-t" className="!-left-1" />
        <Handle type="source" position={Position.Right} id="right-s" className="!-right-1" />

        {/* Rotated Diamond Background */}
        <div
          className={`absolute inset-2 rotate-45 rounded-xl border-2 shadow-lg transition-all ${containerBg} ${highlightBorder}`}
        />

        {/* Centered Content */}
        <div className="relative z-10 text-center px-3 max-w-[110px] pointer-events-none">
          <div className="flex justify-center mb-1">
            <IconComponent className={`w-4 h-4 ${roleStyle.text}`} />
          </div>
          <h5 className="text-[11px] font-bold text-white leading-tight truncate">
            {data.label}
          </h5>
          {data.subtitle && (
            <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
              {data.subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 2. Circle Shape (Workflow Start / End Events)
  if (shape === 'circle') {
    return (
      <div
        className={`relative w-[100px] h-[100px] rounded-full border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-200 cursor-pointer shadow-lg ${containerBg} ${highlightBorder} ${
          isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100'
        }`}
      >
        <Handle type="target" position={Position.Top} className="!-top-1" />
        <Handle type="source" position={Position.Bottom} className="!-bottom-1" />
        <Handle type="target" position={Position.Left} id="left-t" className="!-left-1" />
        <Handle type="source" position={Position.Right} id="right-s" className="!-right-1" />

        <div className={`p-1.5 rounded-full mb-1 ${roleStyle.bg} ${roleStyle.text}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <h5 className="text-[10px] font-bold text-white leading-tight truncate max-w-[80px]">
          {data.label}
        </h5>
      </div>
    );
  }

  // 3. State Shape (Finite State Machine / Lifecycle)
  if (shape === 'state') {
    return (
      <div
        className={`relative min-w-[180px] max-w-[240px] rounded-2xl border-2 p-3 transition-all duration-200 cursor-pointer shadow-lg ${containerBg} ${highlightBorder} ${
          isDimmed ? 'opacity-30 filter grayscale' : 'opacity-100'
        }`}
      >
        <Handle type="target" position={Position.Top} className="!-top-1" />
        <Handle type="source" position={Position.Bottom} className="!-bottom-1" />
        <Handle type="target" position={Position.Left} id="left-t" className="!-left-1" />
        <Handle type="source" position={Position.Right} id="right-s" className="!-right-1" />

        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
            STATE
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              data.status === 'warning'
                ? 'bg-amber-400 animate-pulse'
                : data.status === 'degraded'
                ? 'bg-rose-500'
                : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${roleStyle.text} flex-shrink-0`} />
          <h4 className="text-xs font-bold text-white font-mono truncate">
            {data.label}
          </h4>
        </div>
        {data.subtitle && (
          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-sans">
            {data.subtitle}
          </p>
        )}
      </div>
    );
  }

  // 4. Participant Shape (Sequence Diagram Lifeline Actor with Execution Bars)
  if (shape === 'participant') {
    const lifelineHeight = (data.metadata?.lifelineHeight ? parseInt(data.metadata.lifelineHeight, 10) : 520);
    const activationsRaw = data.metadata?.activations;
    let activations: { top: number; height: number; color?: string }[] = [];
    if (activationsRaw) {
      try {
        activations = JSON.parse(activationsRaw);
      } catch (e) {
        // ignore
      }
    }

    return (
      <div
        className={`relative flex flex-col items-center select-none transition-all duration-200 cursor-pointer ${
          isDimmed ? 'opacity-25 filter grayscale' : 'opacity-100'
        }`}
        style={{ width: 140 }}
      >
        {/* Connection Handles */}
        <Handle type="target" position={Position.Top} className="!-top-1 !opacity-0" />
        <Handle type="source" position={Position.Bottom} className="!-bottom-1 !opacity-0" />
        <Handle type="target" position={Position.Left} id="left-t" className="!top-6 !-left-1 !opacity-0" />
        <Handle type="source" position={Position.Right} id="right-s" className="!top-6 !-right-1 !opacity-0" />

        {/* Participant Header Card (Archify Sequence Style) */}
        <div
          className={`w-full rounded-xl border-2 px-3 py-2.5 flex flex-col items-center justify-center text-center shadow-lg transition-all ${
            roleStyle.bg
          } ${roleStyle.border} ${roleStyle.glow} ${
            isHighlighted
              ? 'ring-2 ring-cyan-400 scale-[1.03]'
              : selected
              ? 'ring-2 ring-sky-400/80 scale-[1.02]'
              : ''
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <IconComponent className={`w-3.5 h-3.5 ${roleStyle.text} shrink-0`} />
            <h4 className={`text-xs font-bold font-mono tracking-tight text-white truncate`}>
              {data.label}
            </h4>
          </div>
          <span className="text-[10px] text-slate-300/80 font-sans line-clamp-1">
            {data.subtitle || data.tech || 'Participant'}
          </span>
        </div>

        {/* Vertical Dashed Lifeline */}
        <div
          className="w-0.5 border-l-2 border-dashed border-slate-600/70 relative mt-1"
          style={{ height: lifelineHeight }}
        >
          {/* Execution / Activation Bars */}
          {activations.map((box, idx) => (
            <div
              key={idx}
              className="absolute -left-[7px] w-[15px] rounded-md border-2 bg-slate-900/90 transition-all"
              style={{
                top: box.top,
                height: box.height,
                borderColor: box.color || (role === 'security' ? '#f43f5e' : role === 'cache' ? '#c084fc' : role === 'database' ? '#a78bfa' : role === 'queue' ? '#fb923c' : '#2dd4bf'),
                boxShadow: `0 0 12px ${box.color || (role === 'security' ? '#f43f5e' : role === 'cache' ? '#c084fc' : role === 'database' ? '#a78bfa' : role === 'queue' ? '#fb923c' : '#2dd4bf')}50`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // 5. Default Box Shape (Architecture / Dataflow)
  return (
    <div
      className={`relative min-w-[210px] max-w-[280px] rounded-xl border p-3.5 transition-all duration-200 cursor-pointer shadow-lg ${containerBg} ${highlightBorder} ${
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
