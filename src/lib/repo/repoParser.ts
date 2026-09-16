import { ArchifyDiagramIR, NodeRole } from '../../types/archify';

export interface RepoAnalysisResult {
  detectedTechs: string[];
  manifestsFound: string[];
  diagramIR: ArchifyDiagramIR;
}

export function parseManifestsToDiagram(
  files: { path: string; content: string }[],
  repoName: string = 'Imported Repository'
): RepoAnalysisResult {
  const detectedTechs = new Set<string>();
  const manifestsFound: string[] = [];

  const nodes: ArchifyDiagramIR['nodes'] = [];
  const edges: ArchifyDiagramIR['edges'] = [];

  // Default client & ingress
  nodes.push({
    id: 'client_app',
    label: `${repoName} Client`,
    subtitle: 'Frontend Application',
    role: 'client',
    shape: 'box',
    tech: 'TypeScript / Web',
    position: { x: 50, y: 180 }
  });

  nodes.push({
    id: 'api_gateway',
    label: 'API Gateway / Ingress',
    subtitle: 'Traffic Controller',
    role: 'gateway',
    shape: 'box',
    tech: 'Nginx / Ingress',
    position: { x: 300, y: 180 }
  });

  edges.push({
    id: 'e_client_gw',
    source: 'client_app',
    target: 'api_gateway',
    label: 'HTTPS',
    protocol: 'HTTPS',
    edge_type: 'solid',
    animated: true
  });

  let hasCustomBackend = false;

  files.forEach(f => {
    const filename = f.path.toLowerCase();
    const content = f.content.toLowerCase();

    // 1. Docker Compose Parser
    if (filename.includes('docker-compose') || filename.endsWith('.compose.yml')) {
      manifestsFound.push(f.path);
      detectedTechs.add('Docker Compose');

      if (content.includes('postgres') || content.includes('postgresql')) {
        detectedTechs.add('PostgreSQL');
        nodes.push({
          id: 'postgres_db',
          label: 'PostgreSQL Database',
          subtitle: 'Relational DB Container',
          role: 'database',
          shape: 'box',
          tech: 'PostgreSQL 16',
          position: { x: 880, y: 100 }
        });
      }

      if (content.includes('redis')) {
        detectedTechs.add('Redis');
        nodes.push({
          id: 'redis_cache',
          label: 'Redis Cache Cluster',
          subtitle: 'In-Memory Store Container',
          role: 'cache',
          shape: 'box',
          tech: 'Redis 7',
          position: { x: 880, y: 260 }
        });
      }

      if (content.includes('kafka') || content.includes('rabbitmq')) {
        detectedTechs.add('Message Broker');
        nodes.push({
          id: 'event_broker',
          label: 'Event Stream Broker',
          subtitle: 'Message Queue Container',
          role: 'queue',
          shape: 'box',
          tech: content.includes('kafka') ? 'Apache Kafka' : 'RabbitMQ',
          position: { x: 880, y: 400 }
        });
      }
    }

    // 2. Package.json / JS / TS ecosystem
    if (filename.endsWith('package.json')) {
      manifestsFound.push(f.path);
      if (content.includes('next')) detectedTechs.add('Next.js');
      if (content.includes('express') || content.includes('fastify') || content.includes('nestjs')) {
        detectedTechs.add('Node.js Backend');
        hasCustomBackend = true;
      }
      if (content.includes('prisma') || content.includes('typeorm') || content.includes('drizzle')) {
        detectedTechs.add('ORM Database Client');
      }
    }

    // 3. Go ecosystem
    if (filename.endsWith('go.mod')) {
      manifestsFound.push(f.path);
      detectedTechs.add('Go Microservice');
      hasCustomBackend = true;
    }

    // 4. Python ecosystem
    if (filename.endsWith('requirements.txt') || filename.endsWith('pyproject.toml')) {
      manifestsFound.push(f.path);
      if (content.includes('fastapi')) detectedTechs.add('FastAPI Service');
      if (content.includes('django')) detectedTechs.add('Django App');
      if (content.includes('torch') || content.includes('openai') || content.includes('langchain')) {
        detectedTechs.add('AI / ML Pipeline');
      }
      hasCustomBackend = true;
    }

    // 5. Terraform / Cloud IaC
    if (filename.endsWith('.tf')) {
      manifestsFound.push(f.path);
      detectedTechs.add('Terraform Cloud Infrastructure');
      if (content.includes('aws_s3_bucket')) {
        nodes.push({
          id: 's3_storage',
          label: 'AWS S3 Object Store',
          subtitle: 'Static & Asset Storage',
          role: 'storage',
          shape: 'box',
          tech: 'AWS S3',
          position: { x: 1150, y: 180 }
        });
      }
    }
  });

  // Add backend service
  nodes.push({
    id: 'backend_service',
    label: `${repoName} Core API`,
    subtitle: Array.from(detectedTechs).slice(0, 2).join(' / ') || 'Application Service',
    role: 'service',
    shape: 'box',
    tech: Array.from(detectedTechs)[0] || 'Node.js / Go',
    position: { x: 580, y: 180 }
  });

  edges.push({
    id: 'e_gw_backend',
    source: 'api_gateway',
    target: 'backend_service',
    label: 'Proxy Route',
    protocol: 'gRPC / HTTP',
    edge_type: 'solid',
    animated: true
  });

  // Connect backend to DBs/Caches if present
  nodes.forEach(n => {
    if (n.id === 'postgres_db') {
      edges.push({
        id: 'e_backend_db',
        source: 'backend_service',
        target: 'postgres_db',
        label: 'SQL Queries',
        protocol: 'PostgreSQL TCP',
        edge_type: 'solid',
        animated: false
      });
    }
    if (n.id === 'redis_cache') {
      edges.push({
        id: 'e_backend_cache',
        source: 'backend_service',
        target: 'redis_cache',
        label: 'Cache Hits',
        protocol: 'RESP',
        edge_type: 'solid',
        animated: false
      });
    }
    if (n.id === 'event_broker') {
      edges.push({
        id: 'e_backend_queue',
        source: 'backend_service',
        target: 'event_broker',
        label: 'Emit Events',
        protocol: 'AMQP',
        edge_type: 'solid',
        animated: false
      });
    }
    if (n.id === 's3_storage') {
      edges.push({
        id: 'e_backend_s3',
        source: 'backend_service',
        target: 's3_storage',
        label: 'Uploads',
        protocol: 'HTTPS',
        edge_type: 'solid',
        animated: false
      });
    }
  });

  const diagramIR: ArchifyDiagramIR = {
    schema_version: '2.0.0',
    diagram_type: 'architecture',
    meta: {
      title: `${repoName} Reverse Engineered Architecture`,
      description: `Synthesized from ${manifestsFound.length} manifest file(s). Techs: ${Array.from(detectedTechs).join(', ')}`,
      version: '1.0.0',
      preset: 'signal-flow',
      theme: 'dark',
      updated_at: new Date().toISOString()
    },
    boundaries: [
      {
        id: 'repo_vpc',
        label: `${repoName} Infrastructure Scope`,
        type: 'vpc',
        position: { x: 260, y: 40 },
        size: { width: 950, height: 440 }
      }
    ],
    nodes,
    edges
  };

  return {
    detectedTechs: Array.from(detectedTechs),
    manifestsFound,
    diagramIR
  };
}
