// Service worker của Archizo Training (bản web).
// Ưu tiên tải mới từ mạng để luôn có bản mới nhất; mất mạng thì dùng bản đã
// lưu, nhờ vậy app trên màn hình chính vẫn mở được khi không có mạng.
// Đường dẫn đều tương đối nên chạy đúng ở thư mục con của GitHub Pages.
const CACHE = 'archizo-training-v1';
const CORE = [
  './',
  'index.html',
  'main.dart.js',
  'flutter_bootstrap.js',
  'manifest.json',
  'favicon.png',
  'icons/apple-touch-icon.png',
  'canvaskit/canvaskit.js',
  'canvaskit/canvaskit.wasm',
  'canvaskit/chromium/canvaskit.js',
  'canvaskit/chromium/canvaskit.wasm',
  'assets/AssetManifest.bin.json',
  'assets/FontManifest.json',
  'assets/fonts/MaterialIcons-Regular.otf',
  'assets/fonts/fallback/Roboto-Regular.ttf',
  'assets/assets/images/logo.png',
  'assets/packages/wakelock_plus/assets/no_sleep.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(CORE.map((url) => cache.add(url))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match(req, { ignoreSearch: true });
        if (hit) return hit;
        throw err;
      }
    })(),
  );
});
