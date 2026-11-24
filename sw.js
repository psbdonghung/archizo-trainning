// Gỡ service worker cũ của Archizo Training.
// Bản trước dùng service worker để mở khi mất mạng; trên iPhone nó có thể giữ
// bản cũ và làm app chỉ hiện nền đen. File này thay thế nó: xóa mọi bản lưu
// tạm, tự gỡ đăng ký, rồi tải lại trang để lấy bản mới từ mạng.
// Không đụng tới dữ liệu người dùng (lưu ở bộ nhớ trình duyệt, không ở cache).
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key);
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
