import React, { useState } from 'react';
import { X, Sparkles, Loader2, Key, Wand2, LayoutGrid } from 'lucide-react';
import { DiagramType, ArchifyDiagramIR } from '../../types/archify';
import { generateDiagramFromPrompt, AIServiceConfig } from '../../lib/ai/aiGenerator';

interface AIDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (diagramIR: ArchifyDiagramIR) => void;
  currentDiagramType: DiagramType;
}

const SAMPLE_PROMPTS = [
  'E-commerce microservices with Next.js, API Gateway, Auth0, Product Service, Order Service, PostgreSQL, Redis cache and Kafka event broker',
  'Real-time RAG AI pipeline with FastAPI, Qdrant Vector DB, OpenAI LLM, Redis session history and S3 document store',
  'Serverless event-driven architecture with AWS Lambda, API Gateway, DynamoDB, SQS queue and EventBridge',
  'User registration and OAuth2 login flow with email verification step and JWT generation',
];

export const AIDiagramModal: React.FC<AIDiagramModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  currentDiagramType,
}) => {
  const [prompt, setPrompt] = useState('');
  const [diagramType, setDiagramType] = useState<DiagramType>(currentDiagramType || 'architecture');
  const [useApiKey, setUseApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('archify_ai_key') || '');
  const [provider, setProvider] = useState<'openai' | 'groq' | 'gemini'>('groq');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      let config: AIServiceConfig | undefined = undefined;
      if (useApiKey && apiKey.trim()) {
        config = {
          provider,
          apiKey: apiKey.trim(),
        };
        localStorage.setItem('archify_ai_key', apiKey.trim());
      }

      const generatedIR = await generateDiagramFromPrompt({
        prompt: prompt.trim(),
        diagramType,
        config,
      });

      onGenerate(generatedIR);
      onClose();
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setError(err?.message || 'Error generating diagram with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1e293b] bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Architect & Diagram Generator
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest font-mono">
                  Intelligent
                </span>
              </h3>
              <p className="text-xs text-slate-400">Describe your system in natural language to build a structured diagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <p className="flex-1">{error}</p>
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              Architecture Description / Requirements
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Design an event-driven payment processing system with Kafka, microservices in Go, Stripe webhook handler, PostgreSQL transactions, and Redis idempotency cache..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400">Or pick a starter prompt:</span>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sample)}
                  className="text-left text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-lg px-3 py-2 text-slate-300 hover:text-white transition-all line-clamp-1 cursor-pointer"
                >
                  ✨ {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Diagram Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
              Diagram View Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle'] as DiagramType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDiagramType(type)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border capitalize text-center transition-all cursor-pointer ${
                    diagramType === type
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced / Custom LLM API Key Toggle */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useApiKey}
                  onChange={(e) => setUseApiKey(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-950"
                />
                <span className="flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-amber-400" />
                  Use Custom AI Provider Key (Groq / Gemini / OpenAI)
                </span>
              </label>
              {!useApiKey && (
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Free Local Engine Active
                </span>
              )}
            </div>

            {useApiKey && (
              <div className="grid grid-cols-3 gap-2 animate-fade-in">
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="groq">Groq (Llama 3.3 70B)</option>
                  <option value="gemini">Google Gemini (1.5 Flash)</option>
                  <option value="openai">OpenAI (GPT-4o mini)</option>
                </select>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API Key"
                  className="col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-[#1e293b] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Architecture...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Diagram
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
