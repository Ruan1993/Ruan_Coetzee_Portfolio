import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';
const server = await createServer({ root: resolve(import.meta.dirname, '..'), server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { beginAtlasDrag, moveAtlasDrag, finishAtlasDrag, pitchForView } = await server.ssrLoadModule('/src/components/AtlasInteraction.ts');
  const { projectFallback } = await server.ssrLoadModule('/src/components/AtlasFallback.ts');
  const front = () => projectFallback(0, 0, 0, 0, 100);
  for (const [dx, dy] of [[30,0],[-30,0],[0,30],[0,-30]]) {
    const d = beginAtlasDrag(1, 100, 100, false);
    const delta = moveAtlasDrag(d, 1, 100 + dx, 100 + dy);
    const projected = projectFallback(0, 0, delta.yaw, delta.pitch, 100);
    if (dx) assert.equal(Math.sign(projected.x - front().x), Math.sign(dx), 'visible point follows mouse horizontally');
    if (dy) assert.equal(Math.sign(projected.y - front().y), Math.sign(dy), 'visible point follows mouse vertically');
    assert.deepEqual(finishAtlasDrag(d, 1), { moved: true });
  }
  for (const yaw of [0, Math.PI]) {
    const start = projectFallback(0, yaw * 180 / Math.PI, yaw, 0, 100);
    const end = projectFallback(0, yaw * 180 / Math.PI, yaw, pitchForView(-.1, yaw), 100);
    assert.ok(end.y > start.y, 'downward pitch follows the pointer on both sides of the globe');
  }
  const touch = beginAtlasDrag(7, 20, 30, true);
  assert.equal(moveAtlasDrag(touch, 8, 70, 60), null, 'other pointer ignored');
  const swipe = moveAtlasDrag(touch, 7, 70, 60);
  assert.ok(swipe.yaw < 0 && swipe.pitch === 0, 'touch swipe rotates horizontally while browser owns vertical scrolling');
  assert.equal(finishAtlasDrag(touch, 8), null, 'other pointer cannot end drag');
  assert.deepEqual(finishAtlasDrag(touch, 7), { moved: true });
  const click = beginAtlasDrag(3, 20, 30, false);
  assert.equal(moveAtlasDrag(click, 3, 22, 31), null);
  assert.deepEqual(finishAtlasDrag(click, 3), { moved: false }, 'small stationary movement remains a click');
  const incremental = beginAtlasDrag(4, 0, 0, false);
  const a = moveAtlasDrag(incremental, 4, 10, 0), b = moveAtlasDrag(incremental, 4, 20, 0);
  assert.equal(a.yaw, b.yaw, 'consistent pointer distance has consistent rotation');
  assert.equal(finishAtlasDrag(null, 4), null, 'cancelled drag cannot finish or click');
  console.log('Living Atlas pointer and projected drag direction tests passed.');
} finally { await server.close(); }
