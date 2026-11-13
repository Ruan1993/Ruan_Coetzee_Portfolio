import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const server = await createServer({ root: resolve(import.meta.dirname, '..'), server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const original = new Map();
function setGlobal(name, value) { if (!original.has(name)) original.set(name, Object.getOwnPropertyDescriptor(globalThis, name)); Object.defineProperty(globalThis, name, { configurable: true, writable: true, value }); }
try {
  const { destinationCamera, fallbackBounds, fallbackMarker, hitFallbackMarker, projectFallback, observeAtlasSize, observeAtlasVisibility } = await server.ssrLoadModule('/src/components/AtlasFallback.ts');
  for (const [lat, lon] of [[-34,22], [16,66], [34,-68], [10,160], [-25,-150]]) {
    const target = destinationCamera(lat, lon, 7);
    const camera = { ...target, zoom: .08 };
    for (const [width, height] of [[360, 300], [900, 450]]) {
      const bounds = fallbackBounds(width, height, camera.zoom);
      const point = fallbackMarker(lat, lon, camera, width, height);
      const drawn = projectFallback(lat, lon, camera.yaw, camera.pitch, bounds.radius);
      assert.ok(point.visible && drawn.z > .999999, `destination ${lon} is on the front`);
      assert.ok(Math.abs(point.x - bounds.cx) < 1e-8 && Math.abs(point.y - bounds.cy) < 1e-8, 'destination is centered');
      assert.ok(Math.abs(point.x - (bounds.cx + drawn.x)) < 1e-8 && Math.abs(point.y - (bounds.cy + drawn.y)) < 1e-8, 'button and drawn point align');
      const destinations = [{lat: -lat, lon: lon + 180}, {lat, lon}];
      assert.equal(hitFallbackMarker(destinations, camera, width, height, point.x, point.y), 1, 'tap selects visible destination');
      assert.equal(hitFallbackMarker(destinations, camera, width, height, 0, 0, 2), -1, 'tap away selects nothing');
    }
  }
  const windowMock = { listeners: new Set(), addEventListener(type, fn) { assert.equal(type, 'resize'); this.listeners.add(fn); }, removeEventListener(type, fn) { this.listeners.delete(fn); } };
  setGlobal('window', windowMock);
  let changes = 0, disconnected = 0;
  for (const mode of ['missing', 'constructor', 'observe']) {
    for (let i = 0; i < 3; i++) {
      setGlobal('ResizeObserver', mode === 'missing' ? undefined : class { constructor() { if (mode === 'constructor') throw Error(); } observe() { if (mode === 'observe') throw Error(); } disconnect() { disconnected++; } });
      setGlobal('IntersectionObserver', mode === 'missing' ? undefined : class { constructor() { if (mode === 'constructor') throw Error(); } observe() { if (mode === 'observe') throw Error(); } disconnect() { disconnected++; } });
      const stopSize = observeAtlasSize({}, () => changes++);
      const stopVisibility = observeAtlasVisibility({}, () => {});
      assert.equal(windowMock.listeners.size, 1, 'resize fallback registered once');
      for (const listener of windowMock.listeners) listener();
      stopSize(); stopVisibility();
      assert.equal(windowMock.listeners.size, 0, 'unmount removes resize listener');
    }
  }
  assert.equal(changes, 9); assert.equal(disconnected, 6, 'partially initialized observers disconnected');
  console.log('Living Atlas fallback geometry and observer tests passed.');
} finally {
  for (const [name, descriptor] of original) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  await server.close();
}
