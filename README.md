# Archify Visual Studio 🚀

> **Interactive Visual Diagram & System Architecture Builder** based on and inspired by [**Archify**](https://github.com/tt-a1i/archify) (`tt-a1i/archify`).

Turn complex system architectures, cloud infrastructures, and AI workflows into beautiful, interactive, and verifiable system maps with an intuitive drag-and-drop visual interface.

---

## 🌟 Overview & Attribution

**Archify Visual Studio** brings a visual web GUI to the ecosystem established by [**Archify**](https://github.com/tt-a1i/archify). While the original Archify operates as a CLI / Agent skill compiling typed JSON IR into deterministic HTML/SVG, **Archify Visual Studio** provides an interactive canvas to construct, inspect, trace, and manage system maps visually with real-time 2-way synchronization with Archify's typed **Schema v2 JSON IR**.

---

## ✨ Key Features

### 🎨 1. Archify Design Presets & Finite Motion
- **4 Visual Presets**:
  - `Signal Flow`: Neon glow cards with moving signal packet animation.
  - `Blueprint`: Technical grid layout with monospaced typography.
  - `Classic`: Polished enterprise shadow cards.
  - `Minimal`: Clean, modern, distraction-free view.
- **Dark & Light Mode**: Instant toggle with contrast and color palette optimization.
- **Finite Particle Motion**: Flowing signal packets along directional connections.

### 🖱️ 2. Visual Drag-and-Drop Canvas & Collapsible Palette
- **Components Library**: Clients, API Gateways, Microservices, Background Workers, PostgreSQL/MySQL Databases, Redis Caches, Kafka/RabbitMQ Queues, AI Reasoning Engines, S3 Object Storage, and Auth Services.
- **Zone Boundaries**: Resizable VPC, Subnet, Cluster, and Security Group containers.
- **Collapsible Palette**: Toggle between expanded component drawer and icon-only bar.
- **4-Way Connection Handles**: Connect components with directional flow, protocol assignment, latency tags, and animation controls.

### 🔍 3. Interactive Route & Reach Tracing
- **Route Probe**: Select a Start Node and End Node to compute the shortest directed path and highlight involved nodes and connections.
- **Reach Inspection**: Inspect **Upstream** (dependencies/callers) and **Downstream** (consumers/data sinks) reach with one click.

### 💾 4. Multi-Project Management & Real-Time Auto-Save
- **LocalStorage Persistence**: Full multi-project manager with real-time debounced auto-saving.
- **Projects Modal**: Create blank projects, start from templates, duplicate, rename, or delete projects.
- **JSON Backup Import / Export**: Export and restore entire project files (`.project.json`).
- **Inline Title Renaming**: Click the active project title in the top toolbar to edit inline.

### 🔄 5. 2-Way Typed JSON IR Sync
- Full compatibility with Archify Schema v2 JSON IR (`schema_version: '2.0.0'`).
- Live bidirectional synchronization: Canvas changes update the JSON IR; JSON edits update the canvas instantly.

### 📦 6. Multi-Format Exporters
- **Standalone Interactive HTML**: 100% self-contained single-file HTML viewer with embedded zoom/pan, theme toggle, node inspector, and reach tracer.
- **Vector SVG**: Scalable vector graphic with embedded styling.
- **1200×630 Canonical Share Card**: High-resolution PNG banner ready for GitHub README, release notes, and social media.
- **Schema JSON**: Downloadable raw typed JSON intermediate representation.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Canvas Engine**: [@xyflow/react (React Flow v12)](https://reactflow.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Export & Rendering**: [html-to-image](https://github.com/bubkoo/html-to-image), [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm / yarn / pnpm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/gmarroyo261194/like_archify.git
cd like_archify

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📜 License & Credits

- Based on and inspired by the concepts, schemas, and design philosophy of [**Archify**](https://github.com/tt-a1i/archify) created by [`tt-a1i`](https://github.com/tt-a1i).
- Licensed under the [MIT License](LICENSE).
