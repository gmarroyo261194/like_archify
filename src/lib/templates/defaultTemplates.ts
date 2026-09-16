import { ArchifyDiagramIR } from '../../types/archify';

// 1. Architecture Diagram
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
      shape: 'box',
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
      shape: 'box',
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
      shape: 'box',
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
      shape: 'box',
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
      shape: 'box',
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
      shape: 'box',
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
      shape: 'box',
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

// 2. Workflow Diagram (with decision gates, start/end circles, lanes)
export const TEMPLATE_WORKFLOW: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'workflow',
  meta: {
    title: 'Autonomous AI Coding Agent Workflow',
    description: 'Autonomous execution cycle: User Prompt → Spec Verification → Decision Gate → Execution → Test Gate → Merge.',
    version: '2.1.0',
    author: 'Archify Studio',
    updated_at: new Date().toISOString(),
    preset: 'signal-flow',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'b-planning',
      label: 'Phase 1: Planning & Exploration',
      type: 'phase',
      position: { x: 50, y: 80 },
      size: { width: 340, height: 460 }
    },
    {
      id: 'b-exec',
      label: 'Phase 2: Code Execution & TDD',
      type: 'phase',
      position: { x: 440, y: 80 },
      size: { width: 420, height: 460 }
    },
    {
      id: 'b-verify',
      label: 'Phase 3: Automated Verification',
      type: 'phase',
      position: { x: 910, y: 80 },
      size: { width: 340, height: 460 }
    }
  ],
  nodes: [
    {
      id: 'wf-start',
      label: 'User Request',
      subtitle: 'Task Input Prompt',
      role: 'event',
      shape: 'circle',
      tech: 'Trigger',
      icon: 'Activity',
      status: 'healthy',
      boundary_id: 'b-planning',
      position: { x: 170, y: 130 }
    },
    {
      id: 'wf-plan',
      label: 'Explore & Generate Plan',
      subtitle: 'Codebase Research',
      role: 'service',
      shape: 'box',
      tech: 'LLM Reasoning',
      icon: 'Bot',
      status: 'healthy',
      boundary_id: 'b-planning',
      position: { x: 100, y: 240 }
    },
    {
      id: 'wf-decide',
      label: 'Plan Approved?',
      subtitle: 'User / Gatekeeper Check',
      role: 'decision',
      shape: 'diamond',
      tech: 'Human-in-the-Loop',
      icon: 'Shield',
      status: 'healthy',
      boundary_id: 'b-planning',
      position: { x: 135, y: 380 }
    },
    {
      id: 'wf-apply',
      label: 'Write Code & Tests',
      subtitle: 'TDD Red-Green Cycle',
      role: 'worker',
      shape: 'box',
      tech: 'TypeScript / AST',
      icon: 'Server',
      status: 'healthy',
      boundary_id: 'b-exec',
      position: { x: 490, y: 240 }
    },
    {
      id: 'wf-gate',
      label: 'Tests Pass 100%?',
      subtitle: 'Unit & E2E Validation',
      role: 'decision',
      shape: 'diamond',
      tech: 'Vitest / Playwright',
      icon: 'Layers',
      status: 'healthy',
      boundary_id: 'b-exec',
      position: { x: 550, y: 380 }
    },
    {
      id: 'wf-commit',
      label: 'Git Commit & Push',
      subtitle: 'Conventional Commits',
      role: 'service',
      shape: 'box',
      tech: 'Git CLI',
      icon: 'HardDrive',
      status: 'healthy',
      boundary_id: 'b-verify',
      position: { x: 960, y: 240 }
    },
    {
      id: 'wf-end',
      label: 'Deployment Done',
      subtitle: 'CI/CD Pipeline Success',
      role: 'event',
      shape: 'circle',
      tech: 'Terminal State',
      icon: 'Activity',
      status: 'healthy',
      boundary_id: 'b-verify',
      position: { x: 1030, y: 390 }
    }
  ],
  edges: [
    {
      id: 'wfe-1',
      source: 'wf-start',
      target: 'wf-plan',
      label: 'Initiate Task',
      protocol: 'Trigger',
      animated: true
    },
    {
      id: 'wfe-2',
      source: 'wf-plan',
      target: 'wf-decide',
      label: 'Submit Spec',
      protocol: 'Review',
      animated: true
    },
    {
      id: 'wfe-3',
      source: 'wf-decide',
      target: 'wf-apply',
      label: 'Approved [Yes]',
      protocol: 'Dispatch',
      animated: true
    },
    {
      id: 'wfe-4',
      source: 'wf-apply',
      target: 'wf-gate',
      label: 'Run Test Suite',
      protocol: 'Test Runner',
      animated: true
    },
    {
      id: 'wfe-5',
      source: 'wf-gate',
      target: 'wf-commit',
      label: 'All Green [Pass]',
      protocol: 'Merge Gate',
      animated: true
    },
    {
      id: 'wfe-6',
      source: 'wf-commit',
      target: 'wf-end',
      label: 'Deploy Release',
      protocol: 'Webhook',
      animated: true
    },
    {
      id: 'wfe-7',
      source: 'wf-gate',
      target: 'wf-apply',
      label: 'Retry [Fail]',
      protocol: 'Debug Loop',
      animated: true
    }
  ]
};

// 3. Sequence Diagram (Archify Full Interaction Over Time: Request, Fallback, Trace)
export const TEMPLATE_SEQUENCE: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'sequence',
  meta: {
    title: 'Dashboard Interaction & Telemetry Sequence',
    description: 'Sequence explains one interaction over time: User, Web App, API, Auth, Redis, Postgres, and Trace.',
    version: '2.0.0',
    author: 'Archify Studio',
    updated_at: new Date().toISOString(),
    preset: 'signal-flow',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'frame-req',
      label: 'Request',
      type: 'frame',
      position: { x: 30, y: 130 },
      size: { width: 1100, height: 160 }
    },
    {
      id: 'frame-fallback',
      label: 'Fallback',
      type: 'frame',
      position: { x: 30, y: 305 },
      size: { width: 1100, height: 190 }
    },
    {
      id: 'frame-trace',
      label: 'Response + trace',
      type: 'frame',
      position: { x: 30, y: 510 },
      size: { width: 1100, height: 160 }
    }
  ],
  nodes: [
    {
      id: 'p-user',
      label: 'User',
      subtitle: 'browser session',
      role: 'client',
      shape: 'participant',
      tech: 'Browser',
      icon: 'Globe',
      position: { x: 50, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([])
      }
    },
    {
      id: 'p-webapp',
      label: 'Web App',
      subtitle: 'React UI',
      role: 'gateway',
      shape: 'participant',
      tech: 'Next.js UI',
      icon: 'Layers',
      position: { x: 210, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([
          { top: 120, height: 470, color: '#38bdf8' }
        ])
      }
    },
    {
      id: 'p-api',
      label: 'API',
      subtitle: 'request handler',
      role: 'service',
      shape: 'participant',
      tech: 'Node / Express',
      icon: 'Server',
      position: { x: 370, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([
          { top: 130, height: 430, color: '#2dd4bf' }
        ])
      }
    },
    {
      id: 'p-auth',
      label: 'Auth',
      subtitle: 'JWT verify',
      role: 'security',
      shape: 'participant',
      tech: 'Keycloak / Auth0',
      icon: 'Shield',
      position: { x: 530, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([
          { top: 170, height: 50, color: '#f43f5e' }
        ])
      }
    },
    {
      id: 'p-redis',
      label: 'Redis',
      subtitle: 'cache',
      role: 'cache',
      shape: 'participant',
      tech: 'Redis v7',
      icon: 'Database',
      position: { x: 690, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([
          { top: 260, height: 55, color: '#c084fc' }
        ])
      }
    },
    {
      id: 'p-postgres',
      label: 'Postgres',
      subtitle: 'source of truth',
      role: 'database',
      shape: 'participant',
      tech: 'Postgres 16',
      icon: 'Database',
      position: { x: 850, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([
          { top: 355, height: 60, color: '#a78bfa' }
        ])
      }
    },
    {
      id: 'p-trace',
      label: 'Trace',
      subtitle: 'async event',
      role: 'queue',
      shape: 'participant',
      tech: 'OpenTelemetry / Kafka',
      icon: 'Network',
      position: { x: 1010, y: 40 },
      metadata: {
        lifelineHeight: '620',
        activations: JSON.stringify([
          { top: 505, height: 60, color: '#fb923c' }
        ])
      }
    }
  ],
  edges: [
    {
      id: 'sq-1',
      source: 'p-user',
      target: 'p-webapp',
      label: 'open page',
      protocol: 'request',
      edge_type: 'request',
      animated: true
    },
    {
      id: 'sq-2',
      source: 'p-webapp',
      target: 'p-api',
      label: 'GET /dashboard',
      protocol: 'request',
      edge_type: 'request',
      animated: true
    },
    {
      id: 'sq-3',
      source: 'p-api',
      target: 'p-auth',
      label: 'verify JWT',
      protocol: 'security',
      edge_type: 'security',
      animated: true
    },
    {
      id: 'sq-4',
      source: 'p-auth',
      target: 'p-api',
      label: 'claims ok',
      protocol: 'return',
      edge_type: 'return',
      animated: false
    },
    {
      id: 'sq-5',
      source: 'p-api',
      target: 'p-redis',
      label: 'read cache',
      protocol: 'request',
      edge_type: 'request',
      animated: true
    },
    {
      id: 'sq-6',
      source: 'p-redis',
      target: 'p-api',
      label: 'miss',
      protocol: 'return',
      edge_type: 'return',
      animated: false
    },
    {
      id: 'sq-7',
      source: 'p-api',
      target: 'p-postgres',
      label: 'query profile + metrics',
      protocol: 'request',
      edge_type: 'request',
      animated: true
    },
    {
      id: 'sq-8',
      source: 'p-postgres',
      target: 'p-api',
      label: 'rows',
      protocol: 'return',
      edge_type: 'return',
      animated: false
    },
    {
      id: 'sq-9',
      source: 'p-api',
      target: 'p-redis',
      label: 'set cache',
      protocol: 'async',
      edge_type: 'async',
      animated: true
    },
    {
      id: 'sq-10',
      source: 'p-api',
      target: 'p-trace',
      label: 'emit trace',
      protocol: 'async',
      edge_type: 'async',
      animated: true
    },
    {
      id: 'sq-11',
      source: 'p-api',
      target: 'p-webapp',
      label: '200 JSON',
      protocol: 'return',
      edge_type: 'return',
      animated: false
    },
    {
      id: 'sq-12',
      source: 'p-webapp',
      target: 'p-user',
      label: 'render',
      protocol: 'return',
      edge_type: 'return',
      animated: false
    }
  ]
};

// 4. Dataflow Diagram (Ingestion, Transformers, Sinks, Data Warehouses)
export const TEMPLATE_DATAFLOW: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'dataflow',
  meta: {
    title: 'Real-Time Vector Search & ML Pipeline',
    description: 'High-throughput stream processing pipeline ingesting clickstream events, generating embeddings, and indexing in vector store.',
    version: '3.0.0',
    author: 'Archify Studio',
    updated_at: new Date().toISOString(),
    preset: 'signal-flow',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'b-ingest',
      label: 'Stage 1: Streaming Ingestion',
      type: 'stage',
      position: { x: 50, y: 90 },
      size: { width: 330, height: 460 }
    },
    {
      id: 'b-transform',
      label: 'Stage 2: ML Embedding & ETL',
      type: 'stage',
      position: { x: 420, y: 90 },
      size: { width: 380, height: 460 }
    },
    {
      id: 'b-serve',
      label: 'Stage 3: Vector Index & Serving',
      type: 'stage',
      position: { x: 840, y: 90 },
      size: { width: 360, height: 460 }
    }
  ],
  nodes: [
    {
      id: 'df-source',
      label: 'Clickstream Event Log',
      subtitle: 'Raw JSON Event Telemetry',
      role: 'queue',
      shape: 'box',
      tech: 'Kafka 3.6 / KRaft',
      icon: 'Network',
      status: 'healthy',
      boundary_id: 'b-ingest',
      position: { x: 90, y: 160 }
    },
    {
      id: 'df-cdc',
      label: 'Debezium CDC Stream',
      subtitle: 'Row-level DB Change Log',
      role: 'service',
      shape: 'box',
      tech: 'Debezium / Kafka Connect',
      icon: 'Layers',
      status: 'healthy',
      boundary_id: 'b-ingest',
      position: { x: 90, y: 320 }
    },
    {
      id: 'df-spark',
      label: 'Apache Flink / Spark',
      subtitle: 'Windowed Aggregations & Filter',
      role: 'worker',
      shape: 'box',
      tech: 'Flink Stateful Stream',
      icon: 'Cpu',
      status: 'healthy',
      boundary_id: 'b-transform',
      position: { x: 460, y: 160 }
    },
    {
      id: 'df-embed',
      label: 'Embedding Generator',
      subtitle: 'Text-Embedding-3 (1536 dim)',
      role: 'ai',
      shape: 'box',
      tech: 'OpenAI / FastEmbed',
      icon: 'Bot',
      status: 'healthy',
      boundary_id: 'b-transform',
      position: { x: 460, y: 320 }
    },
    {
      id: 'df-vector-db',
      label: 'Qdrant / Pinecone Index',
      subtitle: 'HNSW Cosine Similarity Index',
      role: 'database',
      shape: 'box',
      tech: 'Qdrant Vector Engine',
      icon: 'Database',
      status: 'healthy',
      boundary_id: 'b-serve',
      position: { x: 880, y: 160 }
    },
    {
      id: 'df-lake',
      label: 'Iceberg Data Lakehouse',
      subtitle: 'Parquet Columnar Cold Storage',
      role: 'storage',
      shape: 'box',
      tech: 'Apache Iceberg / S3',
      icon: 'HardDrive',
      status: 'healthy',
      boundary_id: 'b-serve',
      position: { x: 880, y: 320 }
    }
  ],
  edges: [
    {
      id: 'dfe-1',
      source: 'df-source',
      target: 'df-spark',
      label: '50k events/sec',
      protocol: 'Kafka Stream',
      animated: true
    },
    {
      id: 'dfe-2',
      source: 'df-cdc',
      target: 'df-spark',
      label: 'CDC Delta Batches',
      protocol: 'TCP Buffer',
      animated: true
    },
    {
      id: 'dfe-3',
      source: 'df-spark',
      target: 'df-embed',
      label: 'Batch Text Chunks',
      protocol: 'gRPC IPC',
      animated: true
    },
    {
      id: 'dfe-4',
      source: 'df-embed',
      target: 'df-vector-db',
      label: 'Upsert 1536d Vectors',
      protocol: 'gRPC Vectors',
      animated: true
    },
    {
      id: 'dfe-5',
      source: 'df-spark',
      target: 'df-lake',
      label: 'Write Parquet Partitions',
      protocol: 'S3 Multi-part',
      animated: true
    }
  ]
};

// 5. Lifecycle Diagram (State Machines, Transitions, Guards, Actions)
export const TEMPLATE_LIFECYCLE: ArchifyDiagramIR = {
  schema_version: '2.0.0',
  diagram_type: 'lifecycle',
  meta: {
    title: 'E-Commerce Order & Payment State Machine',
    description: 'Deterministic finite state machine governing order checkout, payment verification, fulfillment, and refund lifecycle.',
    version: '2.4.0',
    author: 'Archify Studio',
    updated_at: new Date().toISOString(),
    preset: 'classic',
    theme: 'dark'
  },
  boundaries: [
    {
      id: 'b-checkout-lane',
      label: 'Checkout & Authorization Lane',
      type: 'lane',
      position: { x: 50, y: 80 },
      size: { width: 500, height: 460 }
    },
    {
      id: 'b-fulfillment-lane',
      label: 'Fulfillment & Settlement Lane',
      type: 'lane',
      position: { x: 600, y: 80 },
      size: { width: 580, height: 460 }
    }
  ],
  nodes: [
    {
      id: 'st-created',
      label: '[CREATED]',
      subtitle: 'Initial Cart Checkout',
      role: 'state',
      shape: 'state',
      tech: 'Initial State',
      icon: 'Activity',
      status: 'healthy',
      boundary_id: 'b-checkout-lane',
      position: { x: 90, y: 150 }
    },
    {
      id: 'st-pending-payment',
      label: '[PENDING_PAYMENT]',
      subtitle: 'Awaiting Stripe Webhook',
      role: 'state',
      shape: 'state',
      tech: 'Transient State',
      icon: 'Shield',
      status: 'warning',
      boundary_id: 'b-checkout-lane',
      position: { x: 310, y: 150 }
    },
    {
      id: 'st-payment-failed',
      label: '[PAYMENT_FAILED]',
      subtitle: 'Insufficient Funds / 3DS Error',
      role: 'state',
      shape: 'state',
      tech: 'Error State',
      icon: 'Shield',
      status: 'degraded',
      boundary_id: 'b-checkout-lane',
      position: { x: 200, y: 340 }
    },
    {
      id: 'st-paid',
      label: '[PAID]',
      subtitle: 'Payment Authorized & Captured',
      role: 'state',
      shape: 'state',
      tech: 'Active State',
      icon: 'Layers',
      status: 'healthy',
      boundary_id: 'b-fulfillment-lane',
      position: { x: 650, y: 150 }
    },
    {
      id: 'st-shipping',
      label: '[SHIPPED]',
      subtitle: 'Warehouse Dispatched & In-Transit',
      role: 'state',
      shape: 'state',
      tech: 'Active State',
      icon: 'Server',
      status: 'healthy',
      boundary_id: 'b-fulfillment-lane',
      position: { x: 920, y: 150 }
    },
    {
      id: 'st-delivered',
      label: '[DELIVERED / SETTLED]',
      subtitle: 'Customer Received & Order Closed',
      role: 'state',
      shape: 'state',
      tech: 'Terminal State',
      icon: 'Database',
      status: 'healthy',
      boundary_id: 'b-fulfillment-lane',
      position: { x: 920, y: 340 }
    },
    {
      id: 'st-refunded',
      label: '[REFUNDED]',
      subtitle: 'Chargeback / Return Processed',
      role: 'state',
      shape: 'state',
      tech: 'Terminal State',
      icon: 'HardDrive',
      status: 'degraded',
      boundary_id: 'b-fulfillment-lane',
      position: { x: 650, y: 340 }
    }
  ],
  edges: [
    {
      id: 'lfe-1',
      source: 'st-created',
      target: 'st-pending-payment',
      label: 'Submit Order [Cart Valid]',
      protocol: 'Trigger',
      animated: true
    },
    {
      id: 'lfe-2',
      source: 'st-pending-payment',
      target: 'st-paid',
      label: 'Webhook: charge.succeeded',
      protocol: 'Event Trigger',
      animated: true
    },
    {
      id: 'lfe-3',
      source: 'st-pending-payment',
      target: 'st-payment-failed',
      label: 'Webhook: charge.failed',
      protocol: 'Guard Rejection',
      animated: true
    },
    {
      id: 'lfe-4',
      source: 'st-payment-failed',
      target: 'st-pending-payment',
      label: 'Retry New Card',
      protocol: 'User Action',
      animated: true
    },
    {
      id: 'lfe-5',
      source: 'st-paid',
      target: 'st-shipping',
      label: 'Dispatch Tracking ID',
      protocol: 'Warehouse Event',
      animated: true
    },
    {
      id: 'lfe-6',
      source: 'st-shipping',
      target: 'st-delivered',
      label: 'Carrier: Package Delivered',
      protocol: 'Finalize Order',
      animated: true
    },
    {
      id: 'lfe-7',
      source: 'st-paid',
      target: 'st-refunded',
      label: 'Cancel & Refund Order',
      protocol: 'Admin Override',
      animated: true
    }
  ]
};

// Aliases
export const TEMPLATE_AI_AGENT = TEMPLATE_WORKFLOW;
export const TEMPLATE_MICROSERVICES = TEMPLATE_DATAFLOW;
