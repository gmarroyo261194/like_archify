import { ArchifyDiagramIR, DiagramType } from './archify';

export interface ArchifyProject {
  id: string;
  title: string;
  description: string;
  diagram_type: DiagramType;
  tags: string[];
  created_at: string;
  updated_at: string;
  ir: ArchifyDiagramIR;
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  diagram_type: DiagramType;
  tags: string[];
  created_at: string;
  updated_at: string;
  nodeCount: number;
  edgeCount: number;
}
