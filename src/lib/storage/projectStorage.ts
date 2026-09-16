import { ArchifyProject, ProjectDiagram } from '../../types/project';
import { ArchifyDiagramIR, DiagramType } from '../../types/archify';
import { 
  TEMPLATE_WEB_APP, TEMPLATE_WORKFLOW, TEMPLATE_SEQUENCE, 
  TEMPLATE_DATAFLOW, TEMPLATE_LIFECYCLE 
} from '../templates/defaultTemplates';

const STORAGE_KEY = 'archify_projects_v2';
const ACTIVE_PROJECT_KEY = 'archify_active_project_id';

export function normalizeProject(p: any): ArchifyProject {
  // If already valid multi-diagram format
  if (Array.isArray(p.diagrams) && p.diagrams.length > 0) {
    const activeId = p.active_diagram_id && p.diagrams.some((d: any) => d.id === p.active_diagram_id)
      ? p.active_diagram_id
      : p.diagrams[0].id;
    return {
      id: p.id || `proj-${Date.now()}`,
      title: p.title || 'Untitled Project',
      description: p.description || '',
      tags: p.tags || [],
      created_at: p.created_at || new Date().toISOString(),
      updated_at: p.updated_at || new Date().toISOString(),
      active_diagram_id: activeId,
      diagrams: p.diagrams.map((d: any, idx: number) => ({
        id: d.id || `diag-${idx + 1}-${Date.now()}`,
        title: d.title || `Diagram ${idx + 1}`,
        diagram_type: d.diagram_type || d.ir?.diagram_type || 'architecture',
        created_at: d.created_at || new Date().toISOString(),
        updated_at: d.updated_at || new Date().toISOString(),
        ir: d.ir || TEMPLATE_WEB_APP
      }))
    };
  }

  // Migrate legacy single-IR project to multi-diagram
  const singleIR: ArchifyDiagramIR = p.ir || TEMPLATE_WEB_APP;
  const singleType: DiagramType = p.diagram_type || singleIR.diagram_type || 'architecture';
  const diagId = `diag-1-${Date.now()}`;

  return {
    id: p.id || `proj-${Date.now()}`,
    title: p.title || singleIR.meta?.title || 'System Architecture',
    description: p.description || singleIR.meta?.description || '',
    tags: p.tags || [singleType],
    created_at: p.created_at || new Date().toISOString(),
    updated_at: p.updated_at || new Date().toISOString(),
    active_diagram_id: diagId,
    diagrams: [
      {
        id: diagId,
        title: p.title || singleIR.meta?.title || 'Main Architecture',
        diagram_type: singleType,
        created_at: p.created_at || new Date().toISOString(),
        updated_at: p.updated_at || new Date().toISOString(),
        ir: singleIR
      }
    ]
  };
}

export function getAllProjects(): ArchifyProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed rich default enterprise multi-diagram system project
      const initialProject: ArchifyProject = {
        id: 'proj-default-enterprise',
        title: 'Archify Cloud Platform Suite',
        description: 'Comprehensive enterprise system containing Architecture, Agentic Workflow, OAuth Sequence, Vector Dataflow, and Lifecycle state machines.',
        tags: ['enterprise', 'cloud', 'multi-diagram'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active_diagram_id: 'diag-arch',
        diagrams: [
          {
            id: 'diag-arch',
            title: '🌐 3-Tier Web App',
            diagram_type: 'architecture',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ir: TEMPLATE_WEB_APP
          },
          {
            id: 'diag-workflow',
            title: '🤖 AI Agent Cycle',
            diagram_type: 'workflow',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ir: TEMPLATE_WORKFLOW
          },
          {
            id: 'diag-sequence',
            title: '🔐 OAuth2 & JWT',
            diagram_type: 'sequence',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ir: TEMPLATE_SEQUENCE
          },
          {
            id: 'diag-dataflow',
            title: '⚡ Vector Pipeline',
            diagram_type: 'dataflow',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ir: TEMPLATE_DATAFLOW
          },
          {
            id: 'diag-lifecycle',
            title: '🔄 Order Lifecycle',
            diagram_type: 'lifecycle',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ir: TEMPLATE_LIFECYCLE
          }
        ]
      };

      saveProjects([initialProject]);
      setActiveProjectId(initialProject.id);
      return [initialProject];
    }
    const parsed = JSON.parse(raw);
    const normalized = (Array.isArray(parsed) ? parsed : [parsed]).map(normalizeProject);
    return normalized;
  } catch (e) {
    console.error('Error reading projects from storage', e);
    return [];
  }
}

export function saveProjects(projects: ArchifyProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects to storage', e);
  }
}

export function getProjectById(id: string): ArchifyProject | null {
  const all = getAllProjects();
  return all.find(p => p.id === id) || null;
}

export function saveProject(project: ArchifyProject): void {
  const all = getAllProjects();
  const idx = all.findIndex(p => p.id === project.id);
  const updated = {
    ...project,
    updated_at: new Date().toISOString()
  };

  if (idx >= 0) {
    all[idx] = updated;
  } else {
    all.unshift(updated);
  }
  saveProjects(all);
}

export function createNewProject(
  title: string,
  diagramType: DiagramType = 'architecture',
  templateIR?: ArchifyDiagramIR
): ArchifyProject {
  const id = `proj-${Date.now()}`;
  const diagId = `diag-${Date.now()}`;
  
  const ir: ArchifyDiagramIR = templateIR ? {
    ...templateIR,
    meta: {
      ...templateIR.meta,
      title,
      updated_at: new Date().toISOString()
    }
  } : {
    schema_version: '2.0.0',
    diagram_type: diagramType,
    meta: {
      title,
      description: 'System map created in Archify Studio',
      version: '1.0.0',
      author: 'Archify Studio',
      updated_at: new Date().toISOString(),
      preset: 'signal-flow',
      theme: 'dark'
    },
    boundaries: [],
    nodes: [],
    edges: []
  };

  const newProj: ArchifyProject = {
    id,
    title,
    description: ir.meta.description || '',
    tags: [diagramType],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    active_diagram_id: diagId,
    diagrams: [
      {
        id: diagId,
        title: `${title}`,
        diagram_type: diagramType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ir
      }
    ]
  };

  const all = getAllProjects();
  all.unshift(newProj);
  saveProjects(all);
  setActiveProjectId(id);
  return newProj;
}

export function addDiagramToProject(
  projectId: string,
  title: string,
  diagramType: DiagramType,
  templateIR?: ArchifyDiagramIR
): { project: ArchifyProject; newDiagram: ProjectDiagram } | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const diagId = `diag-${Date.now()}`;
  const ir: ArchifyDiagramIR = templateIR ? {
    ...templateIR,
    meta: {
      ...templateIR.meta,
      title,
      updated_at: new Date().toISOString()
    }
  } : {
    schema_version: '2.0.0',
    diagram_type: diagramType,
    meta: {
      title,
      description: '',
      version: '1.0.0',
      author: 'Archify Studio',
      updated_at: new Date().toISOString(),
      preset: 'signal-flow',
      theme: 'dark'
    },
    boundaries: [],
    nodes: [],
    edges: []
  };

  const newDiagram: ProjectDiagram = {
    id: diagId,
    title,
    diagram_type: diagramType,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ir
  };

  project.diagrams.push(newDiagram);
  project.active_diagram_id = diagId;
  project.updated_at = new Date().toISOString();

  saveProject(project);
  return { project, newDiagram };
}

export function duplicateDiagram(
  projectId: string,
  diagramId: string
): { project: ArchifyProject; duplicated: ProjectDiagram } | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const target = project.diagrams.find(d => d.id === diagramId);
  if (!target) return null;

  const newId = `diag-${Date.now()}`;
  const duplicated: ProjectDiagram = {
    ...target,
    id: newId,
    title: `${target.title} (Copy)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ir: {
      ...target.ir,
      meta: {
        ...target.ir.meta,
        title: `${target.title} (Copy)`,
        updated_at: new Date().toISOString()
      }
    }
  };

  const idx = project.diagrams.findIndex(d => d.id === diagramId);
  project.diagrams.splice(idx + 1, 0, duplicated);
  project.active_diagram_id = newId;
  project.updated_at = new Date().toISOString();

  saveProject(project);
  return { project, duplicated };
}

export function deleteDiagram(
  projectId: string,
  diagramId: string
): { project: ArchifyProject; activeDiagram: ProjectDiagram } | null {
  const project = getProjectById(projectId);
  if (!project || project.diagrams.length <= 1) return null;

  project.diagrams = project.diagrams.filter(d => d.id !== diagramId);
  if (project.active_diagram_id === diagramId) {
    project.active_diagram_id = project.diagrams[0].id;
  }
  project.updated_at = new Date().toISOString();

  saveProject(project);
  const activeDiagram = project.diagrams.find(d => d.id === project.active_diagram_id) || project.diagrams[0];
  return { project, activeDiagram };
}

export function updateDiagramTitle(
  projectId: string,
  diagramId: string,
  newTitle: string
): ArchifyProject | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  const diag = project.diagrams.find(d => d.id === diagramId);
  if (diag) {
    diag.title = newTitle;
    diag.ir.meta.title = newTitle;
    diag.updated_at = new Date().toISOString();
    project.updated_at = new Date().toISOString();
    saveProject(project);
  }
  return project;
}

export function duplicateProject(id: string): ArchifyProject | null {
  const original = getProjectById(id);
  if (!original) return null;

  const newId = `proj-${Date.now()}`;
  const duplicated: ArchifyProject = {
    ...original,
    id: newId,
    title: `${original.title} (Copy)`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    diagrams: original.diagrams.map((d, i) => ({
      ...d,
      id: `diag-${i + 1}-${Date.now()}`,
      title: d.title,
      ir: JSON.parse(JSON.stringify(d.ir))
    }))
  };
  duplicated.active_diagram_id = duplicated.diagrams[0].id;

  const all = getAllProjects();
  all.unshift(duplicated);
  saveProjects(all);
  return duplicated;
}

export function deleteProject(id: string): boolean {
  const all = getAllProjects();
  const filtered = all.filter(p => p.id !== id);
  if (filtered.length === all.length) return false;

  saveProjects(filtered);
  const activeId = getActiveProjectId();
  if (activeId === id && filtered.length > 0) {
    setActiveProjectId(filtered[0].id);
  }
  return true;
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

export function exportProjectToFile(project: ArchifyProject): void {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}.project.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectFromFile(file: File): Promise<ArchifyProject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        let project: ArchifyProject;
        if (parsed.schema_version === '2.0.0' && parsed.nodes) {
          // Imported raw single Archify IR
          const diagId = `diag-${Date.now()}`;
          project = {
            id: `proj-${Date.now()}`,
            title: parsed.meta?.title || 'Imported Diagram',
            description: parsed.meta?.description || '',
            tags: ['imported'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            active_diagram_id: diagId,
            diagrams: [
              {
                id: diagId,
                title: parsed.meta?.title || 'Imported Diagram',
                diagram_type: parsed.diagram_type || 'architecture',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ir: parsed
              }
            ]
          };
        } else if (parsed.id && (parsed.diagrams || parsed.ir)) {
          // Imported ArchifyProject format (v1 or v2)
          project = {
            ...normalizeProject(parsed),
            id: `proj-${Date.now()}`,
            title: `${parsed.title} (Imported)`,
            updated_at: new Date().toISOString()
          };
        } else {
          throw new Error('Unrecognized project format');
        }

        const all = getAllProjects();
        all.unshift(project);
        saveProjects(all);
        setActiveProjectId(project.id);
        resolve(project);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

