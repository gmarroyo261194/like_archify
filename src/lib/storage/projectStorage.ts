import { ArchifyProject } from '../../types/project';
import { ArchifyDiagramIR } from '../../types/archify';
import { TEMPLATE_WEB_APP } from '../templates/defaultTemplates';

const STORAGE_KEY = 'archify_projects_v2';
const ACTIVE_PROJECT_KEY = 'archify_active_project_id';

export function getAllProjects(): ArchifyProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default initial project
      const initialProject: ArchifyProject = {
        id: 'proj-default-1',
        title: TEMPLATE_WEB_APP.meta.title,
        description: TEMPLATE_WEB_APP.meta.description || '3-Tier Cloud Architecture',
        diagram_type: TEMPLATE_WEB_APP.diagram_type,
        tags: ['web', 'cloud', 'architecture'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ir: TEMPLATE_WEB_APP
      };
      saveProjects([initialProject]);
      setActiveProjectId(initialProject.id);
      return [initialProject];
    }
    return JSON.parse(raw);
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
  diagramType: ArchifyProject['diagram_type'] = 'architecture',
  templateIR?: ArchifyDiagramIR
): ArchifyProject {
  const id = `proj-${Date.now()}`;
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
    diagram_type: diagramType,
    tags: [diagramType],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ir
  };

  const all = getAllProjects();
  all.unshift(newProj);
  saveProjects(all);
  setActiveProjectId(id);
  return newProj;
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
    ir: {
      ...original.ir,
      meta: {
        ...original.ir.meta,
        title: `${original.title} (Copy)`,
        updated_at: new Date().toISOString()
      }
    }
  };

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
          // Imported raw Archify IR
          project = {
            id: `proj-${Date.now()}`,
            title: parsed.meta?.title || 'Imported Diagram',
            description: parsed.meta?.description || '',
            diagram_type: parsed.diagram_type || 'architecture',
            tags: ['imported'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ir: parsed
          };
        } else if (parsed.id && parsed.ir) {
          // Imported ArchifyProject format
          project = {
            ...parsed,
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
