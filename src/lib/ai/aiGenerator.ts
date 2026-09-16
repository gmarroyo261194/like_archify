import { ArchifyDiagramIR, DiagramType, NodeRole } from '../../types/archify';

export interface AIServiceConfig {
  provider: 'openai' | 'gemini' | 'groq' | 'anthropic' | 'custom';
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export interface PromptGenerateOptions {
  prompt: string;
  diagramType: DiagramType;
  title?: string;
  config?: AIServiceConfig;
}

export interface RepoAnalyzeOptions {
  repoUrl?: string;
  filesSummary?: { path: string; content?: string }[];
  diagramType: DiagramType;
  config?: AIServiceConfig;
}

const SYSTEM_PROMPT = `You are a Principal Software Architect AI.
Your task is to generate a comprehensive, valid Archify Diagram Intermediate Representation (IR) JSON based on user requirements or repository analysis.

SCHEMA REQUIREMENTS:
- schema_version: "2.0.0"
- diagram_type: one of ["architecture", "workflow", "sequence", "dataflow", "lifecycle"]
- meta: { title, description, version: "1.0.0", preset: "signal-flow", theme: "dark", updated_at }
- boundaries: array of { id, label, type ("vpc" | "zone" | "subnet"), position: { x, y }, size: { width, height } }
- nodes: array of {
    id: unique string (e.g. "auth_svc", "db_primary"),
    label: human readable title,
    subtitle: tech or brief role (e.g. "Node.js / Express", "PostgreSQL 16"),
    role: one of ["client", "gateway", "service", "worker", "database", "cache", "queue", "ai", "storage", "security", "external", "decision", "event", "state", "stage", "participant"],
    shape: one of ["box", "diamond", "circle", "pill", "participant", "state"],
    tech: primary technology tag,
    icon: valid icon name or role name,
    boundary_id?: string linking to boundaries id,
    position: { x: number, y: number } (will be auto-layouted, provide sensible base numbers)
  }
- edges: array of {
    id: unique string (e.g. "e1", "e2"),
    source: source node id,
    target: target node id,
    label: action or payload (e.g. "GET /api/v1/auth", "Publish Event"),
    protocol: protocol (e.g. "HTTPS", "gRPC", "AMQP", "WebSocket", "TCP"),
    edge_type: "solid" | "dashed" | "return" | "conditional",
    animated: boolean
  }

CRITICAL: Return ONLY valid, parseable JSON matching this structure. No markdown fences, no explanatory text.`;

export async function generateDiagramFromPrompt(
  options: PromptGenerateOptions
): Promise<ArchifyDiagramIR> {
  const { prompt, diagramType, title, config } = options;

  // If user provided an API key with OpenAI / Groq / Gemini compatible endpoint
  if (config && config.apiKey) {
    return await callLLMApi(prompt, diagramType, config);
  }

  // Fallback / Offline Rule-based Heuristic Generator (Fast Zero-Cost Template AI)
  return generateHeuristicDiagram(prompt, diagramType, title);
}

async function callLLMApi(
  prompt: string,
  diagramType: DiagramType,
  config: AIServiceConfig
): Promise<ArchifyDiagramIR> {
  const endpoint = config.baseUrl || (
    config.provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' :
    config.provider === 'gemini' ? 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions' :
    'https://api.openai.com/v1/chat/completions'
  );

  const model = config.model || (
    config.provider === 'groq' ? 'llama-3.3-70b-versatile' :
    config.provider === 'gemini' ? 'gemini-1.5-flash' :
    'gpt-4o-mini'
  );

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Generate a ${diagramType} diagram for the following specification:\n\n${prompt}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content;
  if (!rawContent) throw new Error('No content returned by AI provider');

  const parsed = JSON.parse(rawContent);
  return parsed as ArchifyDiagramIR;
}

export function generateHeuristicDiagram(
  prompt: string,
  diagramType: DiagramType,
  customTitle?: string
): ArchifyDiagramIR {
  const p = prompt.toLowerCase();
  const title = customTitle || (p.slice(0, 40) + ' Architecture');

  // Detect tech cues
  const hasAuth = p.includes('auth') || p.includes('login') || p.includes('jwt') || p.includes('oauth');
  const hasDB = p.includes('postgres') || p.includes('sql') || p.includes('mongo') || p.includes('database') || p.includes('db');
  const hasRedis = p.includes('cache') || p.includes('redis') || p.includes('memcached');
  const hasQueue = p.includes('queue') || p.includes('kafka') || p.includes('rabbitmq') || p.includes('sqs') || p.includes('pubsub');
  const hasAI = p.includes('ai') || p.includes('llm') || p.includes('rag') || p.includes('openai') || p.includes('vector');
  const hasStorage = p.includes('s3') || p.includes('bucket') || p.includes('storage') || p.includes('blob');
  const hasWorker = p.includes('worker') || p.includes('job') || p.includes('cron') || hasQueue;

  if (diagramType === 'workflow') {
    return {
      schema_version: '2.0.0',
      diagram_type: 'workflow',
      meta: {
        title: title || 'Generated Workflow',
        description: `Generated from prompt: ${prompt}`,
        version: '1.0.0',
        preset: 'signal-flow',
        theme: 'dark',
        updated_at: new Date().toISOString(),
      },
      boundaries: [],
      nodes: [
        { id: 'start', label: 'Start Request', subtitle: 'Entry trigger', role: 'event', shape: 'circle', position: { x: 50, y: 150 } },
        { id: 'validate', label: 'Validate Payload', subtitle: 'Schema & auth checks', role: 'stage', shape: 'box', position: { x: 250, y: 150 } },
        { id: 'decision_ok', label: 'Is Valid & Authorized?', subtitle: 'Condition evaluation', role: 'decision', shape: 'diamond', position: { x: 500, y: 130 } },
        { id: 'process', label: 'Execute Business Logic', subtitle: 'Core transaction', role: 'stage', shape: 'box', position: { x: 750, y: 80 } },
        { id: 'error_handler', label: 'Reject / Fallback', subtitle: 'Return 400/401 Error', role: 'stage', shape: 'box', position: { x: 750, y: 240 } },
        { id: 'end', label: 'Success Response', subtitle: 'Return 200 OK', role: 'event', shape: 'circle', position: { x: 1000, y: 80 } },
      ],
      edges: [
        { id: 'e1', source: 'start', target: 'validate', label: 'Trigger', protocol: 'HTTP', edge_type: 'solid', animated: true },
        { id: 'e2', source: 'validate', target: 'decision_ok', label: 'Check', protocol: 'INTERNAL', edge_type: 'solid' },
        { id: 'e3', source: 'decision_ok', target: 'process', label: 'Yes (Valid)', protocol: 'INTERNAL', edge_type: 'conditional' },
        { id: 'e4', source: 'decision_ok', target: 'error_handler', label: 'No (Invalid)', protocol: 'INTERNAL', edge_type: 'conditional' },
        { id: 'e5', source: 'process', target: 'end', label: 'Completed', protocol: 'HTTP', edge_type: 'solid' },
      ]
    };
  }

  // Architecture Diagram Default
  const nodes = [
    { id: 'client', label: 'Web & Mobile Client', subtitle: 'React / Next.js / Flutter', role: 'client' as NodeRole, shape: 'box' as const, tech: 'TypeScript', position: { x: 50, y: 200 } },
    { id: 'gateway', label: 'API Gateway', subtitle: 'Reverse Proxy & Rate Limit', role: 'gateway' as NodeRole, shape: 'box' as const, tech: 'Envoy / Kong', position: { x: 300, y: 200 } },
    { id: 'backend', label: 'Core Application Service', subtitle: 'REST & gRPC Microservice', role: 'service' as NodeRole, shape: 'box' as const, tech: 'Node.js / Go', position: { x: 580, y: 200 } },
  ];

  const edges = [
    { id: 'e1', source: 'client', target: 'gateway', label: 'HTTPS / WSS', protocol: 'HTTPS', edge_type: 'solid', animated: true },
    { id: 'e2', source: 'gateway', target: 'backend', label: 'Route & Validate', protocol: 'gRPC', edge_type: 'solid', animated: true },
  ];

  if (hasAuth) {
    nodes.push({ id: 'auth_svc', label: 'Auth & Identity Provider', subtitle: 'OAuth2 / OIDC / JWT', role: 'security', shape: 'box', tech: 'Keycloak / Auth0', position: { x: 580, y: 50 } });
    edges.push({ id: 'e_auth', source: 'gateway', target: 'auth_svc', label: 'Verify Token', protocol: 'gRPC', edge_type: 'solid', animated: false });
  }

  if (hasRedis) {
    nodes.push({ id: 'cache', label: 'Redis Cache Cluster', subtitle: 'Session & Hot Data Store', role: 'cache', shape: 'box', tech: 'Redis 7', position: { x: 580, y: 350 } });
    edges.push({ id: 'e_cache', source: 'backend', target: 'cache', label: 'Cache Query', protocol: 'RESP', edge_type: 'solid', animated: false });
  }

  if (hasDB || !hasQueue) {
    nodes.push({ id: 'db', label: 'Primary Relational DB', subtitle: 'ACID Transactions & Storage', role: 'database', shape: 'box', tech: 'PostgreSQL 16', position: { x: 880, y: 200 } });
    edges.push({ id: 'e_db', source: 'backend', target: 'db', label: 'SQL Read/Write', protocol: 'PostgreSQL TCP', edge_type: 'solid', animated: false });
  }

  if (hasQueue || hasWorker) {
    nodes.push({ id: 'queue', label: 'Message Broker', subtitle: 'Async Event Pipeline', role: 'queue', shape: 'box', tech: 'Kafka / RabbitMQ', position: { x: 880, y: 350 } });
    nodes.push({ id: 'worker', label: 'Async Background Worker', subtitle: 'Heavy Batch Processing', role: 'worker', shape: 'box', tech: 'Python / Go', position: { x: 1150, y: 350 } });
    edges.push({ id: 'e_pub', source: 'backend', target: 'queue', label: 'Publish Event', protocol: 'AMQP', edge_type: 'solid', animated: false });
    edges.push({ id: 'e_sub', source: 'queue', target: 'worker', label: 'Consume Job', protocol: 'AMQP', edge_type: 'solid', animated: true });
  }

  if (hasAI) {
    nodes.push({ id: 'vector_db', label: 'Vector Database', subtitle: 'Embeddings Index', role: 'ai', shape: 'box', tech: 'Qdrant / Pinecone', position: { x: 880, y: 50 } });
    nodes.push({ id: 'llm_service', label: 'LLM Inference API', subtitle: 'Foundational Models', role: 'ai', shape: 'box', tech: 'OpenAI / Claude', position: { x: 1150, y: 50 } });
    edges.push({ id: 'e_vec', source: 'backend', target: 'vector_db', label: 'Similarity Search', protocol: 'HTTPS', edge_type: 'solid', animated: false });
    edges.push({ id: 'e_llm', source: 'backend', target: 'llm_service', label: 'Prompt / Stream', protocol: 'HTTPS', edge_type: 'solid', animated: true });
  }

  if (hasStorage) {
    nodes.push({ id: 's3_storage', label: 'Object Storage Bucket', subtitle: 'Media & Asset Store', role: 'storage', shape: 'box', tech: 'AWS S3 / MinIO', position: { x: 1150, y: 200 } });
    edges.push({ id: 'e_s3', source: 'backend', target: 's3_storage', label: 'Presigned Upload', protocol: 'HTTPS', edge_type: 'solid', animated: false });
  }

  return {
    schema_version: '2.0.0',
    diagram_type: diagramType,
    meta: {
      title: title,
      description: `Generated from prompt: ${prompt}`,
      version: '1.0.0',
      preset: 'signal-flow',
      theme: 'dark',
      updated_at: new Date().toISOString(),
    },
    boundaries: [
      {
        id: 'vpc_main',
        label: 'Production VPC / Cloud Infrastructure',
        type: 'vpc',
        position: { x: 260, y: 10 },
        size: { width: 950, height: 460 },
      }
    ],
    nodes,
    edges,
  };
}
