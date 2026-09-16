import { ArchifyDiagramIR } from '../../types/archify';

export function generateCleanSVG(ir: ArchifyDiagramIR): string {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  (ir.boundaries || []).forEach(b => {
    minX = Math.min(minX, b.position.x);
    minY = Math.min(minY, b.position.y);
    maxX = Math.max(maxX, b.position.x + b.size.width);
    maxY = Math.max(maxY, b.position.y + b.size.height);
  });

  (ir.nodes || []).forEach(n => {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + 240);
    maxY = Math.max(maxY, n.position.y + 140);
  });

  if (!isFinite(minX)) {
    minX = 0; minY = 0; maxX = 800; maxY = 600;
  }

  const width = Math.max(900, maxX - minX + 160);
  const height = Math.max(650, maxY - minY + 160);
  const offsetX = minX - 80;
  const offsetY = minY - 80;

  // Boundaries SVG
  let boundariesSvg = '';
  (ir.boundaries || []).forEach(b => {
    const bx = b.position.x - offsetX;
    const by = b.position.y - offsetY;
    boundariesSvg += `
      <g class="boundary">
        <rect x="${bx}" y="${by}" width="${b.size.width}" height="${b.size.height}" rx="16" fill="rgba(15, 23, 42, 0.4)" stroke="#334155" stroke-dasharray="6 6" stroke-width="1.5" />
        <text x="${bx + 16}" y="${by + 24}" fill="#94a3b8" font-size="11" font-weight="bold" font-family="sans-serif" letter-spacing="1">${b.label.toUpperCase()} [${b.type.toUpperCase()}]</text>
      </g>
    `;
  });

  // Nodes SVG
  let nodesSvg = '';
  (ir.nodes || []).forEach(n => {
    const x = n.position.x - offsetX;
    const y = n.position.y - offsetY;

    if (n.shape === 'circle') {
      nodesSvg += `
        <g transform="translate(${x}, ${y})" class="node">
          <circle cx="50" cy="50" r="45" fill="#111726" stroke="#10b981" stroke-width="2" filter="url(#shadow)" />
          <text x="50" y="54" fill="#f8fafc" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">${n.label}</text>
        </g>
      `;
    } else if (n.shape === 'diamond') {
      nodesSvg += `
        <g transform="translate(${x + 60}, ${y + 60})" class="node">
          <rect x="-45" y="-45" width="90" height="90" rx="8" transform="rotate(45)" fill="#111726" stroke="#f59e0b" stroke-width="2" filter="url(#shadow)" />
          <text x="0" y="4" fill="#f8fafc" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">${n.label}</text>
        </g>
      `;
    } else if (n.shape === 'state') {
      nodesSvg += `
        <g transform="translate(${x}, ${y})" class="node">
          <rect width="200" height="80" rx="20" fill="#111726" stroke="#8b5cf6" stroke-width="2" filter="url(#shadow)" />
          <text x="16" y="32" fill="#a78bfa" font-size="9" font-family="monospace" font-weight="bold">STATE</text>
          <text x="16" y="52" fill="#f8fafc" font-size="13" font-weight="600" font-family="monospace">${n.label}</text>
          <text x="16" y="68" fill="#94a3b8" font-size="10" font-family="sans-serif">${n.subtitle || ''}</text>
        </g>
      `;
    } else {
      nodesSvg += `
        <g transform="translate(${x}, ${y})" class="node">
          <rect width="220" height="100" rx="12" fill="#111726" stroke="#1e293b" stroke-width="1.5" filter="url(#shadow)" />
          <rect x="12" y="12" width="60" height="18" rx="4" fill="rgba(56, 189, 248, 0.15)" />
          <text x="42" y="24" fill="#38bdf8" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">${n.role.toUpperCase()}</text>
          <text x="12" y="52" fill="#f8fafc" font-size="13" font-weight="600" font-family="sans-serif">${n.label}</text>
          <text x="12" y="70" fill="#94a3b8" font-size="11" font-family="sans-serif">${n.subtitle || ''}</text>
          ${n.tech ? `<text x="12" y="88" fill="#38bdf8" font-size="10" font-family="monospace">${n.tech}</text>` : ''}
        </g>
      `;
    }
  });

  // Edges SVG
  let edgesSvg = '';
  (ir.edges || []).forEach(e => {
    const src = ir.nodes.find(n => n.id === e.source);
    const tgt = ir.nodes.find(n => n.id === e.target);
    if (!src || !tgt) return;

    const sx = src.position.x - offsetX + 220;
    const sy = src.position.y - offsetY + 50;
    const tx = tgt.position.x - offsetX;
    const ty = tgt.position.y - offsetY + 50;
    const mx = (sx + tx) / 2;

    edgesSvg += `
      <g class="edge">
        <path d="M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)" />
        ${e.label ? `<text x="${mx}" y="${(sy + ty)/2 - 8}" fill="#94a3b8" font-size="10" font-family="sans-serif" text-anchor="middle">${e.label}</text>` : ''}
      </g>
    `;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #0a0d14;">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.5)" />
      </filter>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
      </marker>
    </defs>
    ${boundariesSvg}
    ${edgesSvg}
    ${nodesSvg}
  </svg>`;
}
