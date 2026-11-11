import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript',
  '.wasm':'application/wasm','.json':'application/json','.png':'image/png','.svg':'image/svg+xml',
  '.css':'text/css','.ttf':'font/ttf','.woff2':'font/woff2','.bin':'application/octet-stream'};
export function createPreviewServer() {
  const distRoot = path.resolve(project, 'dist');
  const siteRoot = path.resolve(project, 'site');
  return createServer((request, response) => {
    try {
      if (!['GET','HEAD'].includes(request.method)) {response.writeHead(405).end();return;}
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const isAppRoute = pathname === '/app' || pathname.startsWith('/app/');
      const root = isAppRoute ? distRoot : (existsSync(siteRoot) ? siteRoot : distRoot);
      let target = path.resolve(root, '.' + pathname);
      if (target !== root && !target.startsWith(root + path.sep)) {response.writeHead(403).end();return;}
      if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target,'index.html');
      if (!existsSync(target) && !isAppRoute && existsSync(target + '.html')) target = target + '.html';
      if (!existsSync(target) && !isAppRoute && existsSync(target.replace(/\/$/, '') + '.html')) target = target.replace(/\/$/, '') + '.html';
      if (!existsSync(target) && pathname.startsWith('/app/') && !path.extname(pathname)) target = path.join(distRoot,'app/index.html');
      if (!existsSync(target)) {
        const fallback = path.resolve(distRoot, '.' + pathname);
        if (fallback === distRoot || fallback.startsWith(distRoot + path.sep)) {
          let fbTarget = fallback;
          if (existsSync(fbTarget) && statSync(fbTarget).isDirectory()) fbTarget = path.join(fbTarget, 'index.html');
          if (existsSync(fbTarget) && statSync(fbTarget).isFile()) target = fbTarget;
        }
      }
      if (!existsSync(target) || !statSync(target).isFile()) {response.writeHead(404).end('Not found');return;}
      response.writeHead(200, {'content-type':types[path.extname(target)] || 'application/octet-stream','cache-control':'no-cache'});
      response.end(request.method === 'HEAD' ? undefined : readFileSync(target));
    } catch {response.writeHead(400).end('Invalid request');}
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const defaultPort = Number(process.env.PORT || 3001);
  const startServer = (port) => {
    const srv = createPreviewServer();
    srv.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        startServer(port + 1);
      } else {
        console.error(err);
        process.exit(1);
      }
    });
    srv.listen(port, () => {
      console.log(`Pathfolio running at: http://localhost:${port}/ (App at: http://localhost:${port}/app/)`);
    });
  };
  startServer(defaultPort);
}
