import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const server = await createServer({ root: resolve(import.meta.dirname, '..'), server: { middlewareMode: true }, appType: 'custom' });
const original = new Map();
function globalValue(name, value) { original.set(name, Object.getOwnPropertyDescriptor(globalThis, name)); Object.defineProperty(globalThis, name, { configurable: true, writable: true, value }); }
class Target {
  listeners = new Map();
  addEventListener(type, fn) { if (!this.listeners.has(type)) this.listeners.set(type, new Set()); this.listeners.get(type).add(fn); }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  dispatch(type) { let prevented = false; for (const fn of this.listeners.get(type) || []) fn({ preventDefault() { prevented = true; } }); return prevented; }
  count() { return [...this.listeners.values()].reduce((n, set) => n + set.size, 0); }
}
let frames = new Map(), nextFrame = 1, observers = new Set();
class Observer { constructor(fn) { this.fn = fn; observers.add(this); } observe() {} disconnect() { observers.delete(this); } }
const documentMock = new Target(); documentMock.hidden = false;
globalValue('document', documentMock); globalValue('window', { innerWidth: 1024, devicePixelRatio: 1 });
globalValue('navigator', { hardwareConcurrency: 8, deviceMemory: 8 });
globalValue('IntersectionObserver', Observer); globalValue('ResizeObserver', Observer);
globalValue('requestAnimationFrame', fn => { const id = nextFrame++; frames.set(id, fn); return id; });
globalValue('cancelAnimationFrame', id => frames.delete(id));
function flush() { const pending = [...frames.values()]; frames.clear(); for (const fn of pending) fn(100); }
function createGL() {
  const state = { compileFail: false, linkFail: false, shaders: new Set(), programs: new Set(), vaos: new Set(), draws: 0 };
  const gl = { VERTEX_SHADER: 1, FRAGMENT_SHADER: 2, COMPILE_STATUS: 3, LINK_STATUS: 4, TRIANGLES: 5,
    createShader() { const x = {}; state.shaders.add(x); return x; }, deleteShader(x) { state.shaders.delete(x); }, shaderSource() {}, compileShader() {}, getShaderParameter() { return !state.compileFail; }, getShaderInfoLog() { return 'mock compile failure'; },
    createProgram() { const x = {}; state.programs.add(x); return x; }, deleteProgram(x) { state.programs.delete(x); }, attachShader() {}, linkProgram() {}, getProgramParameter() { return !state.linkFail; }, getProgramInfoLog() { return 'mock link failure'; },
    getUniformLocation() { return {}; }, createVertexArray() { const x = {}; state.vaos.add(x); return x; }, deleteVertexArray(x) { state.vaos.delete(x); }, bindVertexArray() {}, useProgram() {}, viewport() {}, uniform2f() {}, uniform1f() {}, drawArrays() { state.draws++; }
  };
  return { gl, state };
}
function canvasFor(gl) { const canvas = new Target(); canvas.dataset = {}; canvas.getContext = () => gl; canvas.getBoundingClientRect = () => ({ width: 400, height: 300 }); return canvas; }
const camera = () => ({ yaw: 0, pitch: 0, zoom: 0, destination: 0 });
const quiet = console.warn; console.warn = () => {};
try {
  const { startAtlasWebGL } = await server.ssrLoadModule('/src/components/AtlasWebGL.ts');
  let called = 0;
  assert.equal(startAtlasWebGL(canvasFor(null), camera, () => false, () => called++), null, 'unavailable WebGL signals fallback');
  const throwing = canvasFor(null); throwing.getContext = () => { throw Error('context failed'); };
  assert.equal(startAtlasWebGL(throwing, camera, () => false, () => called++), null, 'context exceptions signal fallback');
  for (const failure of ['compileFail', 'linkFail']) {
    const { gl, state } = createGL(); state[failure] = true;
    const canvas = canvasFor(gl);
    assert.equal(startAtlasWebGL(canvas, camera, () => false, () => called++), null, failure);
    assert.equal(state.shaders.size + state.programs.size + state.vaos.size, 0, 'partial GPU allocations are freed');
    assert.equal(canvas.count(), 0); assert.equal(documentMock.count(), 0); assert.equal(observers.size, 0); assert.equal(frames.size, 0);
  }
  {
    const { gl, state } = createGL(), canvas = canvasFor(gl);
    const stop = startAtlasWebGL(canvas, camera, () => false, () => called++);
    assert.ok(stop); flush(); const draws = state.draws;
    assert.equal(canvas.dispatch('webglcontextlost'), true, 'loss is prevented for restoration');
    assert.equal(frames.size, 0); canvas.dispatch('atlas-camera-change'); assert.equal(frames.size, 0, 'no frames while lost');
    // Browser discards GPU objects on loss.
    state.programs.clear(); state.vaos.clear();
    canvas.dispatch('webglcontextrestored'); flush(); assert.ok(state.draws > draws, 'restoration redraws');
    canvas.dispatch('webglcontextlost'); state.programs.clear(); state.vaos.clear(); canvas.dispatch('webglcontextrestored'); flush();
    assert.ok(state.draws > draws + 1, 'repeated restoration redraws');
    canvas.dispatch('webglcontextlost'); state.programs.clear(); state.vaos.clear(); state.compileFail = true; canvas.dispatch('webglcontextrestored');
    assert.equal(called, 1, 'restoration failure activates fallback once');
    canvas.dispatch('webglcontextrestored'); assert.equal(called, 1);
    stop(); assert.equal(canvas.count(), 0); assert.equal(documentMock.count(), 0); assert.equal(observers.size, 0); assert.equal(frames.size, 0);
    assert.equal(state.shaders.size + state.programs.size + state.vaos.size, 0);
  }
  {
    const realSetTimeout = globalThis.setTimeout, realClearTimeout = globalThis.clearTimeout;
    let timeout;
    globalThis.setTimeout = fn => { timeout = fn; return 7; };
    globalThis.clearTimeout = () => { timeout = undefined; };
    try {
      const { gl, state } = createGL(), canvas = canvasFor(gl);
      const stop = startAtlasWebGL(canvas, camera, () => false, () => called++); assert.ok(stop);
      canvas.dispatch('webglcontextlost'); state.programs.clear(); state.vaos.clear();
      assert.ok(timeout, 'loss starts a bounded restoration timer');
      timeout(); assert.equal(called, 2, 'unrestored context activates fallback');
      assert.equal(canvas.count() + documentMock.count() + observers.size + frames.size, 0);
      stop();
    } finally { globalThis.setTimeout = realSetTimeout; globalThis.clearTimeout = realClearTimeout; }
  }
  {
    const realSetTimeout = globalThis.setTimeout, realClearTimeout = globalThis.clearTimeout;
    const callbacks = new Map(); let nextTimer = 0;
    globalThis.setTimeout = fn => { const id = ++nextTimer; callbacks.set(id, fn); return id; };
    globalThis.clearTimeout = id => callbacks.delete(id);
    try {
      const { gl, state } = createGL(), canvas = canvasFor(gl);
      const before = called;
      const stop = startAtlasWebGL(canvas, camera, () => false, () => called++); assert.ok(stop);
      canvas.dispatch('webglcontextlost'); state.programs.clear(); state.vaos.clear();
      const oldCallback = callbacks.get(nextTimer);
      canvas.dispatch('webglcontextrestored'); assert.equal(callbacks.size, 0, 'recovery cancels timeout');
      oldCallback(); assert.equal(called, before, 'stale timer after recovery has no effect');
      canvas.dispatch('webglcontextlost'); state.programs.clear(); state.vaos.clear();
      const unmountCallback = callbacks.get(nextTimer);
      oldCallback(); assert.equal(called, before, 'old loss cannot terminate a newer recovery');
      stop(); assert.equal(callbacks.size, 0, 'unmount cancels timeout');
      unmountCallback(); assert.equal(called, before, 'stale timer after unmount has no effect');
      assert.equal(canvas.count() + documentMock.count() + observers.size + frames.size, 0);
    } finally { globalThis.setTimeout = realSetTimeout; globalThis.clearTimeout = realClearTimeout; }
  }
  for (let i = 0; i < 5; i++) {
    const { gl, state } = createGL(), canvas = canvasFor(gl);
    const stop = startAtlasWebGL(canvas, camera, () => false, () => called++); assert.ok(stop); stop(); stop();
    assert.equal(canvas.count() + documentMock.count() + observers.size + frames.size, 0, 'mount/unmount removes listeners, observers and frames');
    assert.equal(state.shaders.size + state.programs.size + state.vaos.size, 0);
  }
  console.log('Living Atlas WebGL lifecycle tests passed with mocked contexts.');
} finally {
  console.warn = quiet;
  for (const [name, descriptor] of original) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  await server.close();
}
