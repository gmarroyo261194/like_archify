import { ArchifyDiagramIR } from '../../types/archify';

export function generateStandaloneHTML(ir: ArchifyDiagramIR): string {
  const jsonString = JSON.stringify(ir, null, 2);

  return `<!DOCTYPE html>
<html lang="en" class="${ir.meta.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ir.meta.title} — Archify Map</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0a0d14;
      --card-bg: #111726;
      --card-border: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --grid: rgba(255, 255, 255, 0.05);
    }
    .light {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --accent: #0284c7;
      --grid: rgba(0, 0, 0, 0.05);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      padding: 12px 24px;
      background: var(--card-bg);
      border-bottom: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 20;
    }
    .badge {
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 6px;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }
    .btn {
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      color: var(--text);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--accent);
    }
    #canvas-container {
      flex: 1;
      position: relative;
      background-image: radial-gradient(var(--grid) 1.5px, transparent 1.5px);
      background-size: 24px 24px;
      overflow: hidden;
      cursor: grab;
    }
    #canvas-container:active {
      cursor: grabbing;
    }
    #viewport {
      position: absolute;
      transform-origin: 0 0;
      transition: transform 0.05s ease-out;
    }
    svg.edges-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 4000px;
      height: 4000px;
      pointer-events: none;
      z-index: 2;
    }
    .node-card {
      position: absolute;
      width: 230px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      z-index: 5;
    }
    .node-card:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
      box-shadow: 0 15px 30px -5px rgba(56, 189, 248, 0.25);
    }
    .node-card.highlighted {
      border-color: #22d3ee !important;
      box-shadow: 0 0 25px rgba(34, 211, 238, 0.6) !important;
    }
    .node-card.dimmed {
      opacity: 0.2 !important;
      filter: grayscale(1);
    }
    .boundary-box {
      position: absolute;
      border: 2px dashed rgba(100, 116, 139, 0.4);
      background: rgba(15, 23, 42, 0.3);
      border-radius: 16px;
      padding: 12px;
      pointer-events: none;
      z-index: 1;
    }
    .boundary-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .flow-line {
      stroke: #475569;
      stroke-width: 2;
      fill: none;
    }
    .flow-signal {
      stroke: var(--accent);
      stroke-width: 2;
      stroke-dasharray: 6 6;
      fill: none;
      animation: signalMove 1.2s linear infinite;
    }
    @keyframes signalMove {
      to { stroke-dashoffset: -12; }
    }
    #details-panel {
      position: absolute;
      bottom: 24px;
      right: 24px;
      width: 320px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      z-index: 30;
      display: none;
    }
  </style>
</head>
<body>
  <header>
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #38bdf8, #0284c7); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: white;">A</div>
      <div>
        <h1 style="font-size: 15px; font-weight: 700;">${ir.meta.title}</h1>
        <p style="font-size: 12px; color: var(--text-muted);">${ir.meta.description || 'Interactive Archify System Map'}</p>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="badge">Preset: ${ir.meta.preset}</span>
      <span class="badge">${ir.nodes.length} Nodes · ${ir.edges.length} Edges</span>
      <button class="btn" onclick="toggleTheme()">🌓 Theme</button>
      <button class="btn" onclick="resetZoom()">⟲ Reset View</button>
      <button class="btn" onclick="copyJSON()">📋 Copy JSON</button>
    </div>
  </header>

  <div id="canvas-container">
    <div id="viewport">
      <svg class="edges-layer" id="svg-edges"></svg>
      <div id="boundaries-layer"></div>
      <div id="nodes-layer"></div>
    </div>
  </div>

  <div id="details-panel">
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
      <div>
        <span id="p-role" class="badge" style="text-transform: uppercase;"></span>
        <h3 id="p-title" style="font-size: 16px; font-weight: 700; margin-top: 6px;"></h3>
        <p id="p-subtitle" style="font-size: 12px; color: var(--text-muted);"></p>
      </div>
      <button class="btn" onclick="closeDetails()" style="padding: 2px 6px;">✕</button>
    </div>
    <div style="border-top: 1px solid var(--card-border); padding-top: 10px; font-size: 12px;">
      <p style="margin-bottom: 6px;"><strong>Tech Stack:</strong> <span id="p-tech" style="font-family: monospace; color: var(--accent);"></span></p>
      <p style="margin-bottom: 6px;"><strong>Status:</strong> <span id="p-status"></span></p>
      <p id="p-port-row" style="margin-bottom: 6px;"><strong>Port:</strong> <span id="p-port" style="font-family: monospace;"></span></p>
    </div>
    <div style="margin-top: 12px; display: flex; gap: 6px;">
      <button class="btn" style="flex: 1; justify-content: center;" onclick="traceReach('upstream')">↑ Upstream</button>
      <button class="btn" style="flex: 1; justify-content: center;" onclick="traceReach('downstream')">↓ Downstream</button>
    </div>
  </div>

  <script>
    const diagram = ${jsonString};
    let scale = 1, panX = 40, panY = 40, isPanning = false, startX = 0, startY = 0;
    let selectedNodeId = null;

    const viewport = document.getElementById('viewport');
    const container = document.getElementById('canvas-container');

    function updateTransform() {
      viewport.style.transform = \`translate(\${panX}px, \${panY}px) scale(\${scale})\`;
    }

    // Render Boundaries
    const bLayer = document.getElementById('boundaries-layer');
    diagram.boundaries.forEach(b => {
      const el = document.createElement('div');
      el.className = 'boundary-box';
      el.style.left = b.position.x + 'px';
      el.style.top = b.position.y + 'px';
      el.style.width = b.size.width + 'px';
      el.style.height = b.size.height + 'px';
      el.innerHTML = \`<div class="boundary-title">\${b.label} [\${b.type}]</div>\`;
      bLayer.appendChild(el);
    });

    // Render Nodes
    const nLayer = document.getElementById('nodes-layer');
    diagram.nodes.forEach(n => {
      const el = document.createElement('div');
      el.className = 'node-card';
      el.id = 'node-' + n.id;
      el.style.left = n.position.x + 'px';
      el.style.top = n.position.y + 'px';
      el.innerHTML = \`
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge" style="font-size: 9px;">\${n.role}</span>
          <span style="font-size: 11px; font-family: monospace; color: var(--text-muted);">\${n.port ? ':' + n.port : ''}</span>
        </div>
        <div style="font-size: 14px; font-weight: 700; color: var(--text);">\${n.label}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">\${n.subtitle || ''}</div>
        \${n.tech ? \`<div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--card-border); font-size: 11px; font-family: monospace; color: var(--accent);">\${n.tech}</div>\` : ''}
      \`;
      el.onclick = (e) => {
        e.stopPropagation();
        selectNode(n);
      };
      nLayer.appendChild(el);
    });

    // Render Edges
    const svgLayer = document.getElementById('svg-edges');
    diagram.edges.forEach(e => {
      const src = diagram.nodes.find(n => n.id === e.source);
      const tgt = diagram.nodes.find(n => n.id === e.target);
      if (!src || !tgt) return;

      const sx = src.position.x + 230;
      const sy = src.position.y + 40;
      const tx = tgt.position.x;
      const ty = tgt.position.y + 40;
      const mx = (sx + tx) / 2;

      const pathData = \`M \${sx} \${sy} C \${mx} \${sy}, \${mx} \${ty}, \${tx} \${ty}\`;

      const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      bgPath.setAttribute('d', pathData);
      bgPath.setAttribute('class', 'flow-line');
      bgPath.id = 'edge-bg-' + e.id;
      svgLayer.appendChild(bgPath);

      if (e.animated !== false) {
        const animPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        animPath.setAttribute('d', pathData);
        animPath.setAttribute('class', 'flow-signal');
        animPath.id = 'edge-anim-' + e.id;
        svgLayer.appendChild(animPath);
      }
    });

    function selectNode(node) {
      selectedNodeId = node.id;
      document.getElementById('p-role').innerText = node.role;
      document.getElementById('p-title').innerText = node.label;
      document.getElementById('p-subtitle').innerText = node.subtitle || '';
      document.getElementById('p-tech').innerText = node.tech || 'N/A';
      document.getElementById('p-status').innerText = node.status || 'healthy';
      if (node.port) {
        document.getElementById('p-port-row').style.display = 'block';
        document.getElementById('p-port').innerText = node.port;
      } else {
        document.getElementById('p-port-row').style.display = 'none';
      }
      document.getElementById('details-panel').style.display = 'block';
    }

    function closeDetails() {
      document.getElementById('details-panel').style.display = 'none';
      clearHighlights();
    }

    function traceReach(direction) {
      if (!selectedNodeId) return;
      const reachable = new Set([selectedNodeId]);
      
      if (direction === 'downstream') {
        diagram.edges.forEach(e => {
          if (reachable.has(e.source)) reachable.add(e.target);
        });
      } else {
        diagram.edges.forEach(e => {
          if (reachable.has(e.target)) reachable.add(e.source);
        });
      }

      diagram.nodes.forEach(n => {
        const el = document.getElementById('node-' + n.id);
        if (el) {
          if (reachable.has(n.id)) {
            el.classList.add('highlighted');
            el.classList.remove('dimmed');
          } else {
            el.classList.add('dimmed');
            el.classList.remove('highlighted');
          }
        }
      });
    }

    function clearHighlights() {
      diagram.nodes.forEach(n => {
        const el = document.getElementById('node-' + n.id);
        if (el) {
          el.classList.remove('highlighted');
          el.classList.remove('dimmed');
        }
      });
    }

    // Pan & Zoom
    container.onmousedown = (e) => {
      isPanning = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
    };
    window.onmousemove = (e) => {
      if (!isPanning) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateTransform();
    };
    window.onmouseup = () => { isPanning = false; };
    container.onwheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.min(Math.max(0.4, scale * zoomFactor), 2.5);
      updateTransform();
    };

    function resetZoom() {
      scale = 1; panX = 40; panY = 40;
      updateTransform();
      clearHighlights();
    }

    function toggleTheme() {
      document.documentElement.classList.toggle('light');
    }

    function copyJSON() {
      navigator.clipboard.writeText(JSON.stringify(diagram, null, 2));
      alert('Archify JSON copied to clipboard!');
    }

    updateTransform();
  </script>
</body>
</html>`;
}
