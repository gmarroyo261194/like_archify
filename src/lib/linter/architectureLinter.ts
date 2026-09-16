import { ArchifyDiagramIR, NodeRole } from '../../types/archify';

export type LintSeverity = 'error' | 'warning' | 'info';

export interface LintIssue {
  id: string;
  title: string;
  description: string;
  severity: LintSeverity;
  affectedNodeIds: string[];
  affectedEdgeIds?: string[];
  recommendation: string;
}

export function lintArchitecture(ir: ArchifyDiagramIR): LintIssue[] {
  const issues: LintIssue[] = [];
  const nodes = ir.nodes || [];
  const edges = ir.edges || [];

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Rule 1: Client connecting directly to Database or Storage without Backend/Gateway
  edges.forEach(edge => {
    const src = nodeMap.get(edge.source);
    const tgt = nodeMap.get(edge.target);
    if (!src || !tgt) return;

    if (src.role === 'client' && (tgt.role === 'database' || tgt.role === 'cache' || tgt.role === 'storage')) {
      issues.push({
        id: `direct-db-access-${edge.id}`,
        title: 'Direct Database/Storage Access from Client',
        description: `Client node "${src.label}" connects directly to data store "${tgt.label}".`,
        severity: 'error',
        affectedNodeIds: [src.id, tgt.id],
        affectedEdgeIds: [edge.id],
        recommendation: 'Route traffic through an API Gateway or Backend Service with proper authentication and queries.'
      });
    }
  });

  // Rule 2: Single Point of Failure (SPOF) on critical Database without Cache / Replica
  const databaseNodes = nodes.filter(n => n.role === 'database');
  const cacheNodes = nodes.filter(n => n.role === 'cache');

  if (databaseNodes.length > 0 && cacheNodes.length === 0 && nodes.length > 4) {
    issues.push({
      id: 'spof-database-no-cache',
      title: 'High Database Load Risk (No Cache Layer)',
      description: 'System has relational/NoSQL databases without a Redis or in-memory cache layer.',
      severity: 'warning',
      affectedNodeIds: databaseNodes.map(d => d.id),
      recommendation: 'Add a Redis or Memcached node to reduce read latency and shield database from spikes.'
    });
  }

  // Rule 3: Unconnected / Orphan Nodes
  const connectedNodeIds = new Set<string>();
  edges.forEach(e => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  const orphanNodes = nodes.filter(n => !connectedNodeIds.has(n.id));
  if (orphanNodes.length > 0) {
    issues.push({
      id: 'orphan-nodes',
      title: 'Isolated / Unconnected Nodes',
      description: `${orphanNodes.length} node(s) have no incoming or outgoing connections.`,
      severity: 'info',
      affectedNodeIds: orphanNodes.map(n => n.id),
      recommendation: 'Connect these nodes to adjacent services or remove them if deprecated.'
    });
  }

  // Rule 4: Service missing Security / Auth boundary
  const hasAuth = nodes.some(n => n.role === 'security' || n.label.toLowerCase().includes('auth'));
  const hasGateway = nodes.some(n => n.role === 'gateway');
  if (nodes.length > 4 && !hasAuth && !hasGateway) {
    issues.push({
      id: 'missing-auth-gateway',
      title: 'Missing Authentication Gateway',
      description: 'Microservices architecture lacks a dedicated API Gateway or Identity Provider.',
      severity: 'warning',
      affectedNodeIds: [],
      recommendation: 'Implement an API Gateway (Kong, Envoy) or Auth Service (OAuth2/JWT).'
    });
  }

  // Rule 5: Heavy Queue worker without message broker
  const workers = nodes.filter(n => n.role === 'worker');
  const queues = nodes.filter(n => n.role === 'queue');
  if (workers.length > 0 && queues.length === 0) {
    issues.push({
      id: 'worker-no-queue',
      title: 'Background Worker without Event Queue',
      description: 'Async workers found without a Message Broker (Kafka/RabbitMQ/SQS).',
      severity: 'warning',
      affectedNodeIds: workers.map(w => w.id),
      recommendation: 'Decouple async job triggers with a message queue broker.'
    });
  }

  return issues;
}
