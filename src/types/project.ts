import { ArchifyDiagramIR, DiagramType } from './archify';

export interface ProjectDiagram {
  id: string;
  title: string;
  diagram_type: DiagramType;
  created_at: string;
  updated_at: string;
  ir: ArchifyDiagramIR;
}

export interface ArchifyProject {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  active_diagram_id: string;
  diagrams: ProjectDiagram[];
  // Backward compatibility legacy fields:
  diagram_type?: DiagramType;
  ir?: ArchifyDiagramIR;
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  diagramCount: number;
  activeDiagramType: DiagramType;
  nodeCount: number;
  edgeCount: number;
}
