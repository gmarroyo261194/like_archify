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
