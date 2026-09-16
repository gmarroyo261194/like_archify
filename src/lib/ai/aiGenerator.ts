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
- boundaries: array of { id, label, type ("vpc" | "zone" | "subnet" | "frame" | "interaction"), position: { x, y }, size: { width, height } }
- nodes: array of {
    id: unique string (e.g. "client", "api_gateway", "auth_service", "billing_db"),
    label: human readable title,
    subtitle: tech or brief role (e.g. "React Client", "Golang API", "PostgreSQL"),
    role: one of ["client", "gateway", "service", "worker", "database", "cache", "queue", "ai", "storage", "security", "external", "decision", "event", "state", "stage", "participant"],
    shape: one of ["box", "diamond", "circle", "pill", "participant", "state"],
    tech: primary technology tag,
    icon: valid icon name or role name,
    boundary_id?: string linking to boundaries id,
    position: { x: number, y: number },
    metadata?: {
      lifelineHeight?: string,
      activations?: string (JSON stringified array of { top: number, height: number, color?: string })
    }
  }
- edges: array of {
    id: unique string (e.g. "e1", "e2"),
    source: source node id,
    target: target node id,
    label: action or payload (e.g. "1. POST /order", "2. verify payment", "200 JSON OK"),
    protocol: protocol (e.g. "HTTPS", "gRPC", "SQL", "return", "security", "async", "request"),
    edge_type: "solid" | "dashed" | "return" | "conditional" | "security" | "async" | "request",
    animated: boolean
  }

SEQUENCE DIAGRAM SPECIFIC RULES:
- When diagram_type is "sequence":
  - Nodes MUST have shape: "participant" and role matching their function ("client", "gateway", "service", "security", "cache", "database", "queue", "ai", etc.).
  - Distribute participant nodes horizontally at y: 40 with x incrementing by 160px (e.g. x: 50, x: 210, x: 370, x: 530...).
  - Provide metadata.activations JSON array on active participants showing when they are processing.
  - Use boundaries with type: "frame" to group logical phases (e.g. "Phase 1: Validation", "Phase 2: Execution", "Phase 3: Telemetry & Return").
  - Use semantic edge_type ("request" for calls, "return" for replies, "security" for auth checks, "async" for events/queues).

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
    config.provider === 'gemini' ? 'gemini-2.5-flash' :
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

  if (diagramType === 'sequence') {
    const participants = [
      { id: 'actor_client', label: 'Client App', subtitle: 'User Interface', role: 'client' as NodeRole, shape: 'participant' as const, icon: 'Globe', position: { x: 50, y: 40 }, metadata: { lifelineHeight: '560', activations: '[]' } },
      { id: 'actor_api', label: 'API Gateway', subtitle: 'Backend Controller', role: 'service' as NodeRole, shape: 'participant' as const, icon: 'Server', position: { x: 220, y: 40 }, metadata: { lifelineHeight: '560', activations: JSON.stringify([{ top: 120, height: 380, color: '#2dd4bf' }]) } },
    ];

    let xPos = 390;
    if (hasAuth) {
      participants.push({ id: 'actor_auth', label: 'Auth Provider', subtitle: 'JWT / OAuth', role: 'security', shape: 'participant', icon: 'Shield', position: { x: xPos, y: 40 }, metadata: { lifelineHeight: '560', activations: JSON.stringify([{ top: 150, height: 50, color: '#f43f5e' }]) } });
      xPos += 170;
    }
    if (hasRedis) {
      participants.push({ id: 'actor_cache', label: 'Redis Cache', subtitle: 'Key-Value Cache', role: 'cache', shape: 'participant', icon: 'Database', position: { x: xPos, y: 40 }, metadata: { lifelineHeight: '560', activations: JSON.stringify([{ top: 230, height: 50, color: '#c084fc' }]) } });
      xPos += 170;
    }
    if (hasDB || !hasQueue) {
      participants.push({ id: 'actor_db', label: 'Database', subtitle: 'ACID Storage', role: 'database', shape: 'participant', icon: 'Database', position: { x: xPos, y: 40 }, metadata: { lifelineHeight: '560', activations: JSON.stringify([{ top: 310, height: 60, color: '#a78bfa' }]) } });
      xPos += 170;
    }
    if (hasQueue) {
      participants.push({ id: 'actor_queue', label: 'Event Broker', subtitle: 'Async Queue / PubSub', role: 'queue', shape: 'participant', icon: 'Network', position: { x: xPos, y: 40 }, metadata: { lifelineHeight: '560', activations: JSON.stringify([{ top: 400, height: 50, color: '#fb923c' }]) } });
      xPos += 170;
    }

    const seqEdges: any[] = [
      { id: 'sq_e1', source: 'actor_client', target: 'actor_api', label: '1. Initiate Request', protocol: 'request', edge_type: 'request', animated: true }
    ];

    if (hasAuth) {
      seqEdges.push({ id: 'sq_auth_req', source: 'actor_api', target: 'actor_auth', label: '2. Verify Token', protocol: 'security', edge_type: 'security', animated: true });
      seqEdges.push({ id: 'sq_auth_res', source: 'actor_auth', target: 'actor_api', label: '3. Token Valid (OK)', protocol: 'return', edge_type: 'return', animated: false });
    }
    if (hasRedis) {
      seqEdges.push({ id: 'sq_cache_req', source: 'actor_api', target: 'actor_cache', label: '4. Check Cache', protocol: 'request', edge_type: 'request', animated: true });
      seqEdges.push({ id: 'sq_cache_res', source: 'actor_cache', target: 'actor_api', label: '5. Cache Miss', protocol: 'return', edge_type: 'return', animated: false });
    }
    if (hasDB || !hasQueue) {
      seqEdges.push({ id: 'sq_db_req', source: 'actor_api', target: 'actor_db', label: '6. Query Transaction Data', protocol: 'request', edge_type: 'request', animated: true });
      seqEdges.push({ id: 'sq_db_res', source: 'actor_db', target: 'actor_api', label: '7. Return Record Set', protocol: 'return', edge_type: 'return', animated: false });
    }
    if (hasQueue) {
      seqEdges.push({ id: 'sq_q_emit', source: 'actor_api', target: 'actor_queue', label: '8. Publish Async Event', protocol: 'async', edge_type: 'async', animated: true });
    }

    seqEdges.push({ id: 'sq_res_client', source: 'actor_api', target: 'actor_client', label: '9. 200 OK Response', protocol: 'return', edge_type: 'return', animated: false });

    return {
      schema_version: '2.0.0',
      diagram_type: 'sequence',
      meta: {
        title: title || 'Dynamic Interaction Sequence',
        description: `Sequence generated for: ${prompt}`,
        version: '1.0.0',
        preset: 'signal-flow',
        theme: 'dark',
        updated_at: new Date().toISOString()
      },
      boundaries: [
        { id: 'f_req', label: 'Phase 1: Ingress & Validation', type: 'frame', position: { x: 30, y: 130 }, size: { width: Math.max(xPos, 800), height: 160 } },
        { id: 'f_exec', label: 'Phase 2: Data & Processing', type: 'frame', position: { x: 30, y: 300 }, size: { width: Math.max(xPos, 800), height: 180 } }
      ],
      nodes: participants,
      edges: seqEdges
    };
  }

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
