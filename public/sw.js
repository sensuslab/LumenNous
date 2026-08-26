/* LumenNous — service worker (vanilla, dependency-free).
 *
 * Strategy (product brief §PWA):
 *   · App shell + seed routes are precached and served network-first with a
 *     cache fallback, so the curated library keeps working offline.
 *   · Static build assets (/_next/static, icons, fonts, manifest) are
 *     cache-first — they are content-hashed and immutable.
 *   · Everything else (same-origin GETs, e.g. seed JSON) falls back to its
 *     cached copy when the network is absent.
 *   · Create is part of the app shell and composes entirely on the device.
 *
 * Versioned cache names; old caches are purged on activate. Navigation
 * preload is used when available and handled safely.
 */

const VERSION = "v4";
const SHELL_CACHE = `lumennous-shell-${VERSION}`;
const RUNTIME_CACHE = `lumennous-runtime-${VERSION}`;

const APP_SHELL = [
  "/",
  "/explore",
  "/create",
  "/sessions",
  "/sessions/morning-setting",
  "/sessions/midday-recenter",
  "/sessions/evening-integration",
  "/sessions/challenge-reset",
  "/sessions/before-sleep",
  "/listen",
  "/learn",
  "/saved",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

const STATIC_PREFIXES = ["/_next/static/", "/icons/", "/fonts/", "/intro/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (name) =>
              (name.startsWith("pe-") || name.startsWith("lumennous-")) &&
              name !== SHELL_CACHE &&
              name !== RUNTIME_CACHE,
          )
          .map((name) => caches.delete(name)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(url) {
  return STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) ||
    url.pathname === "/manifest.webmanifest";
}

async function put(cacheName, request, response) {
  if (response && response.ok && response.type === "basic") {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* Navigations: network-first (fresh when online), cached shell offline. */
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) return put(RUNTIME_CACHE, request, preload);
          const fresh = await fetch(request);
          return put(RUNTIME_CACHE, request, fresh);
        } catch {
          const cached =
            (await caches.match(request)) ||
            (await caches.match(url.pathname)) ||
            (await caches.match("/"));
          return cached || Response.error();
        }
      })(),
    );
    return;
  }

  /* Immutable static assets: cache-first. */
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          return put(SHELL_CACHE, request, fresh);
        } catch {
          return Response.error();
        }
      })(),
    );
    return;
  }

  /* Default same-origin GETs: network, falling back to cache. */
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(request);
        return put(RUNTIME_CACHE, request, fresh);
      } catch {
        const cached = await caches.match(request);
        return cached || Response.error();
      }
    })(),
  );
});
