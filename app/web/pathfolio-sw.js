// Local-first app shell. No user records pass through this worker or a server.
const CACHE = 'pathfolio-app-v1';
const APP = '/app/';
const SHELL = [
  '', 'index.html', 'flutter_bootstrap.js', 'flutter.js', 'main.dart.js',
  'manifest.json', 'favicon.png', 'assets/AssetManifest.bin',
  'assets/FontManifest.json', 'assets/fonts/MaterialIcons-Regular.otf',
  'assets/packages/cupertino_icons/assets/CupertinoIcons.ttf',
  'assets/shaders/ink_sparkle.frag', 'assets/shaders/stretch_effect.frag',
  'canvaskit/canvaskit.js', 'canvaskit/canvaskit.wasm',
  'canvaskit/chromium/canvaskit.js', 'canvaskit/chromium/canvaskit.wasm',
  'canvaskit/skwasm.js', 'canvaskit/skwasm.wasm',
  'canvaskit/skwasm_heavy.js', 'canvaskit/skwasm_heavy.wasm',
  'canvaskit/wimp.js', 'canvaskit/wimp.wasm',
  'canvaskit/webparagraph/canvaskit.js', 'canvaskit/webparagraph/canvaskit.wasm',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL.map((path) => APP + path)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('pathfolio-app-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(APP)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const shell = await cache.match(APP);
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
