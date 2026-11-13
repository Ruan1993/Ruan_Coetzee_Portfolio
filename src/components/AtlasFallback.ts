export function destinationCamera(lat: number, lon: number, currentYaw: number) {
  const latitude = lat * Math.PI / 180, longitude = lon * Math.PI / 180;
  const qx = Math.cos(latitude) * Math.sin(longitude), qy = Math.sin(latitude), qz = Math.cos(latitude) * Math.cos(longitude);
  const targetPitch = -Math.atan2(qy, qz);
  const targetYaw = Math.atan2(qx, Math.hypot(qy, qz));
  const tau = Math.PI * 2;
  const wrapped = ((targetYaw - currentYaw + Math.PI) % tau + tau) % tau - Math.PI;
  return { yaw: currentYaw + wrapped, pitch: targetPitch };
}

/** Geometry shared by the 2D globe, its marker buttons and canvas hit testing. */
export function projectFallback(lat: number, lon: number, yaw: number, pitch: number, radius: number) {
  const latitude = lat * Math.PI / 180, longitude = lon * Math.PI / 180;
  const qx = Math.cos(latitude) * Math.sin(longitude), qy = Math.sin(latitude), qz = Math.cos(latitude) * Math.cos(longitude);
  // Match the inverse of the WebGL sphere rotation so its camera targets also work here.
  const ry = Math.cos(pitch) * qy + Math.sin(pitch) * qz;
  const rz = -Math.sin(pitch) * qy + Math.cos(pitch) * qz;
  const x = Math.cos(yaw) * qx - Math.sin(yaw) * rz;
  const z = Math.sin(yaw) * qx + Math.cos(yaw) * rz;
  return { x: x * radius, y: -ry * radius, z };
}

export function fallbackBounds(width: number, height: number, zoom: number) {
  return { cx: width * (width < 700 ? .5 : .47), cy: height * .48,
    radius: Math.min(width * (width < 700 ? .34 : .28), height * .34) * (1 + zoom * 2.25) };
}

export function fallbackMarker(lat: number, lon: number, camera: { yaw: number; pitch: number; zoom: number }, width: number, height: number) {
  const { cx, cy, radius } = fallbackBounds(width, height, camera.zoom);
  const point = projectFallback(lat, lon, camera.yaw, camera.pitch, radius);
  return { x: cx + point.x, y: cy + point.y, visible: point.z > 0 };
}

export function hitFallbackMarker(destinations: readonly { lat: number; lon: number }[], camera: { yaw: number; pitch: number; zoom: number }, width: number, height: number, x: number, y: number, limit = 30) {
  let nearest = -1, distance = limit;
  destinations.forEach((destination, index) => {
    const point = fallbackMarker(destination.lat, destination.lon, camera, width, height);
    if (!point.visible) return;
    const candidate = Math.hypot(x - point.x, y - point.y);
    if (candidate < distance) { nearest = index; distance = candidate; }
  });
  return nearest;
}

/** Observe element size, falling back to window resize when the API cannot be used. */
export function observeAtlasSize(element: Element, onResize: () => void): () => void {
  let observer: ResizeObserver | undefined;
  try {
    if (typeof ResizeObserver === 'undefined') throw new Error('ResizeObserver unavailable');
    observer = new ResizeObserver(onResize);
    observer.observe(element);
    return () => observer?.disconnect();
  } catch {
    observer?.disconnect();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }
}

/** Without intersection observation, keep drawing while the document is visible. */
export function observeAtlasVisibility(element: Element, onVisibility: (visible: boolean) => void): () => void {
  let observer: IntersectionObserver | undefined;
  try {
    if (typeof IntersectionObserver === 'undefined') throw new Error('IntersectionObserver unavailable');
    observer = new IntersectionObserver(([entry]) => onVisibility(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(element);
    return () => observer?.disconnect();
  } catch {
    observer?.disconnect();
    return () => {};
  }
}
