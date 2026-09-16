import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

function localScanPlugin(): Plugin {
  return {
    name: 'local-fs-scan-plugin',
    configureServer(server) {
      server.middlewares.use('/api/scan-local-dir', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { dirPath } = JSON.parse(body || '{}');
            if (!dirPath || typeof dirPath !== 'string') {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'dirPath parameter required' }));
              return;
            }

            const cleanPath = path.resolve(dirPath.trim().replace(/^"|"$/g, ''));
            if (!fs.existsSync(cleanPath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: `Directory "${cleanPath}" does not exist on local disk.` }));
              return;
            }

            const foundFiles: { path: string; content: string }[] = [];
            const rootName = path.basename(cleanPath) || 'Local Project';

            function scan(current: string, relative: string = '') {
              if (foundFiles.length > 50) return; // Safety limit
              const entries = fs.readdirSync(current, { withFileTypes: true });

              for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.next') {
                  continue;
                }

                const fullPath = path.join(current, entry.name);
                const relPath = relative ? path.join(relative, entry.name) : entry.name;

                if (entry.isDirectory()) {
                  scan(fullPath, relPath);
                } else if (entry.isFile()) {
                  const lower = entry.name.toLowerCase();
                  if (
                    lower.includes('docker-compose') ||
                    lower.endsWith('package.json') ||
                    lower.endsWith('go.mod') ||
                    lower.endsWith('requirements.txt') ||
                    lower.endsWith('.tf') ||
                    lower.endsWith('cargo.toml') ||
                    lower.endsWith('pom.xml')
                  ) {
                    try {
                      const text = fs.readFileSync(fullPath, 'utf8');
                      foundFiles.push({ path: relPath.replace(/\\/g, '/'), content: text });
                    } catch (e) {
                      // ignore read error
                    }
                  }
                }
              }
            }

            scan(cleanPath);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ rootName, files: foundFiles }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Scan error' }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localScanPlugin()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('@xyflow')) {
            return 'xyflow-vendor'
          }
          if (id.includes('lucide-react')) {
            return 'lucide-icons'
          }
          if (id.includes('html-to-image') || id.includes('canvas-confetti')) {
            return 'export-tools'
          }
        }
      }
    }
  }
})

