import { ArchifyDiagramIR } from '../../types/archify';

export function generateCleanSVG(ir: ArchifyDiagramIR): string {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  ir.nodes.forEach(n => {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + 240);
    maxY = Math.max(maxY, n.position.y + 140);
  });

  const width = Math.max(800, maxX - minX + 160);
  const height = Math.max(600, maxY - minY + 160);
  const offsetX = minX - 80;
  const offsetY = minY - 80;

  let nodesSvg = '';
  ir.nodes.forEach(n => {
    const x = n.position.x - offsetX;
    const y = n.position.y - offsetY;
    nodesSvg += `
      <g transform="translate(${x}, ${y})" class="node">
        <rect width="220" height="100" rx="12" fill="#111726" stroke="#1e293b" stroke-width="1.5" filter="url(#shadow)" />
        <rect x="12" y="12" width="50" height="18" rx="4" fill="rgba(56, 189, 248, 0.15)" />
        <text x="37" y="24" fill="#38bdf8" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle">${n.role.toUpperCase()}</text>
        <text x="12" y="52" fill="#f8fafc" font-size="14" font-weight="600" font-family="sans-serif">${n.label}</text>
        <text x="12" y="70" fill="#94a3b8" font-size="11" font-family="sans-serif">${n.subtitle || ''}</text>
        ${n.tech ? `<text x="12" y="88" fill="#38bdf8" font-size="10" font-family="monospace">${n.tech}</text>` : ''}
      </g>
    `;
  });

  let edgesSvg = '';
  ir.edges.forEach(e => {
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
    ${edgesSvg}
    ${nodesSvg}
  </svg>`;
}
