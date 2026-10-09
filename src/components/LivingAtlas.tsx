import { useEffect, useRef, useState } from 'react';
import { startAtlasWebGL } from './AtlasWebGL';

type Destination = { id: string; name: string; kicker: string; detail: string; href: string; lat: number; lon: number; color: string };
const destinations: Destination[] = [
  { id: 'teaching', name: 'Teaching', kicker: 'THE WORLD IS MY CLASSROOM', detail: 'Geography and Social Sciences teaching, classroom practice and a PGCE in progress.', href: '#teaching', lat: -34, lon: 22, color: '#f8cc8b' },
  { id: 'gis', name: 'Geography & GIS', kicker: 'READ THE LANDSCAPE', detail: 'Geospatial analysis, remote sensing, aerial surveying and geographic research.', href: '#projects-gis-maps', lat: 16, lon: 66, color: '#73f5e1' },
  { id: 'digital', name: 'Digital Creation', kicker: 'BUILD BEYOND THE SCREEN', detail: 'Web experiences and creative projects developed through RC Digital Creations.', href: '#projects-websites', lat: 34, lon: -68, color: '#92b8ff' },
];
const TAU = Math.PI * 2;
const latitudeLines = Array.from({ length: 11 }, (_, line) => {
  const lat = -75 + line * 15;
  return { lat, coordinates: Array.from({ length: 181 }, (_, i) => [lat, -180 + i * 2] as [number, number]) };
});
const longitudeLines = Array.from({ length: 24 }, (_, line) => {
  const lon = -180 + line * 15;
  return Array.from({ length: 91 }, (_, i) => [-90 + i * 2, lon] as [number, number]);
});
function project(lat: number, lon: number, yaw: number, pitch: number, radius: number) {
  const a = lat * Math.PI / 180, b = lon * Math.PI / 180 + yaw;
  const x = Math.cos(a) * Math.sin(b), y = Math.sin(a), z = Math.cos(a) * Math.cos(b);
  return { x: x * radius, y: -(y * Math.cos(pitch) - z * Math.sin(pitch)) * radius, z: y * Math.sin(pitch) + z * Math.cos(pitch) };
}

export function LivingAtlas() {
  const [active, setActive] = useState(0);
  const [displayedActive, setDisplayedActive] = useState(0);
  const [cardPhase, setCardPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [approached, setApproached] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [travelling, setTravelling] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const camera = useRef({ yaw: 0.2, pitch: 0.1, zoom: 0, targetYaw: 0.2, targetPitch: 0.1, targetZoom: 0 });
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const activeRef = useRef(0);
  const approachedRef = useRef(false);
  const reducedRef = useRef(false);
  const frameRef = useRef(0);
  const journeyRef = useRef(0);
  const lastFrameRef = useRef(0);
  const updateMarkersRef = useRef<() => void>(() => undefined);
  const cardTransitionRef = useRef(0);
  const cardTimersRef = useRef<number[]>([]);
  const points = useRef(Array.from({ length: 170 }, (_, i) => ({ x: Math.sin(i * 127.1) * 0.49 + 0.5, y: Math.sin(i * 41.37) * 0.49 + 0.5, r: (i % 5 + 1) * 0.35 })));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { reducedRef.current = media.matches; setMotionReduced(media.matches); };
    change(); media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => () => cardTimersRef.current.forEach(window.clearTimeout), []);
  useEffect(() => {
    const updateMarkers = () => {
      const canvas = canvasRef.current;
      const root = markersRef.current;
      if (canvas && root) {
        const { width, height } = canvas.getBoundingClientRect();
        const cam = camera.current;
        const distance = width / Math.max(height, 1) < .8 ? 10.5 : 6.4;
        const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
        const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
        Array.from(root.children).forEach((child, i) => {
          const marker = child as HTMLElement;
          const d = destinations[i];
          const lat = d.lat * Math.PI / 180, lon = d.lon * Math.PI / 180;
          const qx = Math.cos(lat) * Math.sin(lon);
          const qy = Math.sin(lat);
          const qz = Math.cos(lat) * Math.cos(lon);
          // Inverse shader rotation: q = rotX(pitch) * rotY(yaw) * n.
          const ry = cp * qy + sp * qz;
          const rz = -sp * qy + cp * qz;
          const nx = cy * qx - sy * rz;
          const nz = sy * qx + cy * rz;
          const visible = nz > 1 / distance + .045;
          marker.style.opacity = visible ? '1' : '0';
          marker.setAttribute('aria-hidden', visible ? 'false' : 'true');
          marker.tabIndex = visible ? 0 : -1;
          marker.style.pointerEvents = visible ? 'auto' : 'none';
          marker.style.transform = `translate(-50%, -50%) translate(${width / 2 + height * (2 * nx / (distance - nz))}px, ${height / 2 - height * (2 * ry / (distance - nz))}px)`;
        });
      }
    };
    updateMarkersRef.current = updateMarkers;
    const observer = new ResizeObserver(updateMarkers);
    if (canvasRef.current) observer.observe(canvasRef.current);
    updateMarkers();
    return () => { observer.disconnect(); updateMarkersRef.current = () => undefined; };
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const webglStop = startAtlasWebGL(canvas, () => ({ ...camera.current, destination: activeRef.current }), () => reducedRef.current);
    if (webglStop) {
      let raf = 0;
      const easeCamera = (now: number) => {
        const elapsed = lastFrameRef.current ? Math.min(64, now - lastFrameRef.current) : 16.67;
        lastFrameRef.current = now;
        // Frame-rate independent travel: ~2.5 seconds for a typical half-world journey.
        const ease = reducedRef.current ? 1 : 1 - Math.exp(-elapsed / 650);
        const cam = camera.current;
        cam.yaw += (cam.targetYaw - cam.yaw) * ease;
        cam.pitch += (cam.targetPitch - cam.pitch) * ease;
        cam.zoom += (cam.targetZoom - cam.zoom) * ease;
        updateMarkersRef.current();
        canvas.dispatchEvent(new Event('atlas-render-frame'));
        const remaining = Math.abs(cam.targetYaw - cam.yaw) + Math.abs(cam.targetPitch - cam.pitch) + Math.abs(cam.targetZoom - cam.zoom);
        if (journeyRef.current && approachedRef.current && remaining < .0015) {
          cam.yaw = cam.targetYaw;
          cam.pitch = cam.targetPitch;
          cam.zoom = cam.targetZoom;
          journeyRef.current = 0;
          setTravelling(false);
          return;
        }
        if (remaining > .0015) raf = requestAnimationFrame(easeCamera);
      };
      const beginEase = () => { cancelAnimationFrame(raf); lastFrameRef.current = 0; raf = requestAnimationFrame(easeCamera); };
      canvas.addEventListener('atlas-camera-change', beginEase);
      beginEase();
      return () => { cancelAnimationFrame(raf); canvas.removeEventListener('atlas-camera-change', beginEase); webglStop(); };
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0, height = 0, tick = 0, inViewport = true, visible = !document.hidden, lastPaint = 0;
    const schedule = () => { if (inViewport && visible && !frameRef.current) frameRef.current = requestAnimationFrame(render); };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      width = bounds.width; height = bounds.height;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
    const intersection = new IntersectionObserver(([entry]) => { inViewport = entry.isIntersecting; if (inViewport) schedule(); else { cancelAnimationFrame(frameRef.current); frameRef.current = 0; } }, { rootMargin: '120px' });
    intersection.observe(canvas);
    const onVisibilityChange = () => { visible = !document.hidden; if (visible) schedule(); else { cancelAnimationFrame(frameRef.current); frameRef.current = 0; } };
    document.addEventListener('visibilitychange', onVisibilityChange);
    function render(now: number) {
      frameRef.current = 0;
      if (!ctx) return;
      if (!width || !height) { schedule(); return; }
      if (width < 700 && now - lastPaint < 1000 / 30) { schedule(); return; }
      lastPaint = now;
      const cam = camera.current, ease = reducedRef.current ? 1 : 0.055;
      cam.yaw += (cam.targetYaw - cam.yaw) * ease;
      cam.pitch += (cam.targetPitch - cam.pitch) * ease;
      cam.zoom += (cam.targetZoom - cam.zoom) * ease;
      updateMarkersRef.current();
      const remaining = Math.abs(cam.targetYaw - cam.yaw) + Math.abs(cam.targetPitch - cam.pitch) + Math.abs(cam.targetZoom - cam.zoom);
      if (journeyRef.current && approachedRef.current && remaining < .0015) {
        cam.yaw = cam.targetYaw;
        cam.pitch = cam.targetPitch;
        cam.zoom = cam.targetZoom;
        journeyRef.current = 0;
        setTravelling(false);
      }
      tick++;
      ctx.clearRect(0, 0, width, height);
      const backdrop = ctx.createRadialGradient(width * .5, height * .48, 10, width * .5, height * .5, Math.max(width, height) * .65);
      backdrop.addColorStop(0, '#10344a'); backdrop.addColorStop(.55, '#061726'); backdrop.addColorStop(1, '#020711');
      ctx.fillStyle = backdrop; ctx.fillRect(0, 0, width, height);
      points.current.forEach((p, i) => {
        const px = p.x * width, py = p.y * height;
        ctx.fillStyle = `rgba(189,231,250,${.16 + (i % 7) * .055})`;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, TAU); ctx.fill();
      });
      const cx = width * (width < 700 ? .5 : .47), cy = height * .48;
      const baseRadius = Math.min(width * (width < 700 ? .34 : .28), height * .34);
      const radius = baseRadius * (1 + cam.zoom * 2.25);
      const halo = ctx.createRadialGradient(cx, cy, radius * .5, cx, cy, radius * 1.55);
      halo.addColorStop(0, 'rgba(62,206,226,.13)'); halo.addColorStop(1, 'rgba(62,206,226,0)');
      ctx.fillStyle = halo; ctx.fillRect(0, 0, width, height);
      const globe = ctx.createRadialGradient(cx - radius * .38, cy - radius * .44, radius * .08, cx, cy, radius * 1.2);
      globe.addColorStop(0, '#266b7a'); globe.addColorStop(.35, '#123c58'); globe.addColorStop(.8, '#07182e'); globe.addColorStop(1, '#010814');
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.fillStyle = globe; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.clip();
      const line = (coordinates: Array<[number, number]>, opacity: number) => {
        ctx.beginPath(); let drawing = false;
        coordinates.forEach(([lat, lon]) => {
          const p = project(lat, lon, cam.yaw, cam.pitch, radius);
          if (p.z <= 0) { drawing = false; return; }
          if (!drawing) ctx.moveTo(cx + p.x, cy + p.y); else ctx.lineTo(cx + p.x, cy + p.y);
          drawing = true;
        });
        ctx.strokeStyle = `rgba(117,231,235,${opacity})`; ctx.lineWidth = .8; ctx.stroke();
      };
      latitudeLines.forEach(({ lat, coordinates }) => line(coordinates, lat === 0 ? .47 : .22));
      longitudeLines.forEach(coordinates => line(coordinates, .2));
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.strokeStyle = 'rgba(159,249,246,.55)'; ctx.lineWidth = 1.4; ctx.stroke();
      destinations.forEach((d, i) => {
        const p = project(d.lat, d.lon, cam.yaw, cam.pitch, radius);
        if (p.z <= 0) return;
        const x = cx + p.x, y = cy + p.y, pulse = reducedRef.current ? 0 : Math.sin(tick * .04) * 3;
        ctx.beginPath(); ctx.arc(x, y, (i === activeRef.current ? 16 : 10) + pulse, 0, TAU);
        ctx.strokeStyle = d.color; ctx.globalAlpha = i === activeRef.current ? .8 : .4; ctx.lineWidth = 1.3; ctx.stroke(); ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(x, y, i === activeRef.current ? 5 : 3, 0, TAU);
        ctx.fillStyle = d.color; ctx.shadowColor = d.color; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
      });
      schedule();
    }
    schedule();
    return () => { cancelAnimationFrame(frameRef.current); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', onVisibilityChange); };
  }, []);
  const select = (index: number) => {
    setActive(index); activeRef.current = index;
    setArrived(true); setTravelling(true);
    cardTimersRef.current.forEach(window.clearTimeout);
    cardTimersRef.current = [];
    const transition = ++cardTransitionRef.current;
    if (reducedRef.current) {
      setDisplayedActive(index);
      setCardPhase('idle');
    } else if (!arrived) {
      setDisplayedActive(index);
      setCardPhase('entering');
      cardTimersRef.current.push(window.setTimeout(() => {
        if (cardTransitionRef.current === transition) setCardPhase('idle');
      }, 150));
    } else if (displayedActive !== index) {
      setCardPhase('exiting');
      cardTimersRef.current.push(window.setTimeout(() => {
        if (cardTransitionRef.current !== transition) return;
        setDisplayedActive(index);
        setCardPhase('entering');
        cardTimersRef.current.push(window.setTimeout(() => {
          if (cardTransitionRef.current === transition) setCardPhase('idle');
        }, 150));
      }, 90));
    } else {
      setCardPhase('idle');
    }
    journeyRef.current += 1;
    const item = destinations[index];
    const latitude = item.lat * Math.PI / 180;
    const longitude = item.lon * Math.PI / 180;
    const qx = Math.cos(latitude) * Math.sin(longitude);
    const qy = Math.sin(latitude);
    const qz = Math.cos(latitude) * Math.cos(longitude);
    // Solve the inverse of the shader's Rx(pitch) * Ry(yaw) rotation.
    const targetPitch = -Math.atan2(qy, qz);
    const targetYaw = Math.atan2(qx, Math.hypot(qy, qz));
    const current = camera.current.yaw;
    // Keep each marker fixed to the sphere; rotate the planet so its world-space
    // latitude/longitude maps to the front-facing normal (0,0,1).
    const wrapped = ((targetYaw - current + Math.PI) % TAU + TAU) % TAU - Math.PI;
    camera.current.targetYaw = current + wrapped;
    camera.current.targetPitch = targetPitch;
    camera.current.targetZoom = .08;
    setApproached(true); approachedRef.current = true;
    updateMarkersRef.current();
    canvasRef.current?.dispatchEvent(new Event('atlas-camera-change'));
  };
  const reset = () => { cardTimersRef.current.forEach(window.clearTimeout); cardTimersRef.current = []; cardTransitionRef.current += 1; setCardPhase('idle'); journeyRef.current = 0; setArrived(false); setTravelling(false); camera.current.targetZoom = 0; setApproached(false); approachedRef.current = false; canvasRef.current?.dispatchEvent(new Event('atlas-camera-change')); };
  const onCanvasPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const wasDrag = drag.current.moved; drag.current = null;
    if (wasDrag) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width * .5, cy = rect.height * .5;
    const radius = Math.min(rect.width * .35, rect.height * .35);
    let nearest = -1, distance = 30;
    destinations.forEach((d, i) => {
      const p = project(d.lat, d.lon, camera.current.yaw, camera.current.pitch, radius);
      if (p.z < 0) return;
      const dist = Math.hypot(event.clientX - rect.left - cx - p.x, event.clientY - rect.top - cy - p.y);
      if (dist < distance) { distance = dist; nearest = i; }
    });
    if (nearest >= 0) select(nearest);
  };
  useEffect(() => {
    select(0);
  }, []);
  return <div className="atlas-experience" aria-labelledby="atlas-heading" aria-describedby="atlas-intro">
      <div className="atlas-experience__header"><span className="atlas-experience__brand">RC <span>/</span> THE LIVING ATLAS</span><span className="atlas-experience__status" aria-live="polite">{travelling ? 'TRAVELLING' : arrived ? 'DESTINATION LOCKED' : 'ORBITAL VIEW'}</span></div>
      <div className="atlas-experience__stage">
      <canvas ref={canvasRef} className="atlas-experience__canvas" aria-hidden="true" onPointerDown={e => { if (approachedRef.current) { journeyRef.current = 0; setArrived(false); setTravelling(false); setApproached(false); approachedRef.current = false; } drag.current = { x: e.clientX, y: e.clientY, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true; camera.current.targetYaw += dx * .006; camera.current.targetPitch = Math.max(-1.2, Math.min(1.2, camera.current.targetPitch + dy * .004)); drag.current.x = e.clientX; drag.current.y = e.clientY; updateMarkersRef.current(); e.currentTarget.dispatchEvent(new Event('atlas-camera-change')); }} onPointerUp={onCanvasPointerUp} onPointerCancel={() => { drag.current = null; }} />
      <div className="atlas-experience__markers" ref={markersRef}>{destinations.map((d, i) => <button key={d.id} type="button" className={active === i && approached ? 'atlas-marker is-selected' : 'atlas-marker'} style={{ '--atlas-color': d.color } as React.CSSProperties} onClick={() => select(i)} aria-label={`Navigate globe to ${d.name}`} title={d.name}><span className="atlas-marker__dot"/><span className="atlas-marker__label">{d.name}</span></button>)}</div>
      <div className="atlas-experience__coordinates" aria-hidden="true">GEOGRAPHIC INTERFACE <span>●</span> {travelling ? 'TRAVELLING TO DESTINATION' : arrived ? 'DESTINATION LOCKED · LIVE ATLAS' : 'ORBITAL VIEW'}<br/>LAT / LON · INTERACTIVE PROJECTION</div>
      <h2 id="atlas-heading" className="sr-only">Explore my world</h2><p id="atlas-intro" className="sr-only">Rotate the globe, select a glowing location, and discover my work.</p>
      </div>
      <div className="atlas-experience__hud">
        <div className="atlas-experience__destinations" aria-label="Choose a destination">{destinations.map((d, i) => <button key={d.id} className={active === i && approached ? 'atlas-destination is-selected' : 'atlas-destination'} style={{ '--atlas-color': d.color } as React.CSSProperties} type="button" onClick={() => select(i)} aria-pressed={active === i && approached}><span className="atlas-destination__number">0{i + 1}</span><span>{d.name}</span><span aria-hidden="true">↗</span></button>)}</div>
        <div className={arrived ? `atlas-experience__detail is-visible is-${cardPhase} atlas-experience__detail--${destinations[displayedActive].id}` : 'atlas-experience__detail'} aria-live="polite" aria-hidden={!arrived}><span>{destinations[displayedActive].kicker}</span><h3>{destinations[displayedActive].name}</h3><p>{destinations[displayedActive].detail}</p><div className="atlas-experience__detail-actions"><a href={destinations[displayedActive].href}>EXPLORE THIS CHAPTER ↗</a><button type="button" onClick={reset}>VIEW FULL GLOBE</button></div></div>
      </div>
      <div className="atlas-experience__footer"><span>DRAG TO ROTATE · SELECT A MARKER</span><span>{motionReduced ? 'REDUCED MOTION' : 'INTERACTIVE WEBGL ATLAS'}</span></div>
    </div>;
}
