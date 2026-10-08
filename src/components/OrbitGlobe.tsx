import { useEffect, useRef, useState } from 'react';

/** Lightweight canvas globe: no map tiles, tracking, external libraries or API keys. */
export function OrbitGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const rotationRef = useRef(0.4);
  const dragRef = useRef<{ x: number; active: boolean } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionPreference.matches;
    let frame = 0;
    let lastTime = 0;
    let size = 0;
    const resize = () => {
      size = Math.max(220, Math.round(canvas.getBoundingClientRect().width));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const project = (latitude: number, longitude: number, angle: number, radius: number) => {
      const lat = latitude * Math.PI / 180;
      const lon = longitude * Math.PI / 180 + angle;
      const depth = Math.cos(lat) * Math.cos(lon);
      return { x: Math.sin(lon) * Math.cos(lat) * radius, y: -Math.sin(lat) * radius, depth };
    };
    const draw = () => {
      if (!size) return;
      const center = size / 2;
      const radius = size * 0.344;
      ctx.clearRect(0, 0, size, size);
      const halo = ctx.createRadialGradient(center, center, radius * .3, center, center, radius * 1.5);
      halo.addColorStop(0, 'rgba(35,165,190,.10)');
      halo.addColorStop(.65, 'rgba(27,123,175,.13)');
      halo.addColorStop(1, 'rgba(18,90,170,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);
      const sphere = ctx.createRadialGradient(center - radius * .4, center - radius * .5, radius * .04, center, center, radius * 1.2);
      sphere.addColorStop(0, '#153c57');
      sphere.addColorStop(.55, '#091c32');
      sphere.addColorStop(1, '#020a18');
      ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphere; ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2); ctx.clip();
      const angle = rotationRef.current;
      const drawCurve = (coordinates: [number, number][], opacity: number, width = .8) => {
        ctx.strokeStyle = `rgba(79,218,223,${opacity})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        let started = false;
        for (const [lat, lon] of coordinates) {
          const p = project(lat, lon, angle, radius);
          if (p.depth < 0) { started = false; continue; }
          if (!started) ctx.moveTo(center + p.x, center + p.y);
          else ctx.lineTo(center + p.x, center + p.y);
          started = true;
        }
        ctx.stroke();
      };
      for (let lat = -75; lat <= 75; lat += 15) {
        drawCurve(Array.from({ length: 241 }, (_, i) => [lat, -180 + i * 1.5]), lat === 0 ? .43 : .19);
      }
      for (let lon = -180; lon < 180; lon += 15) {
        drawCurve(Array.from({ length: 121 }, (_, i) => [-90 + i * 1.5, lon]), .19);
      }
      // Representative geospatial points, not political boundaries or precise mapping data.
      const points: [number, number][] = [[-34,22],[-26,28],[51,0],[40,-74],[35,139],[-33,151],[28,77],[48,2],[-23,-46],[1,104],[30,31],[37,-122]];
      for (const [lat, lon] of points) {
        const p = project(lat, lon, angle, radius);
        if (p.depth < 0) continue;
        ctx.beginPath(); ctx.arc(center + p.x, center + p.y, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#9df9e4'; ctx.shadowColor = '#51f5df'; ctx.shadowBlur = 11; ctx.fill(); ctx.shadowBlur = 0;
      }
      ctx.restore();
      ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(119,232,241,.48)'; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(center, center, radius * 1.29, radius * .38, -.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(112,205,239,.25)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(center, center, radius * 1.27, radius * .38, -.4, Math.PI * .12, Math.PI * .76);
      ctx.strokeStyle = 'rgba(128,249,228,.7)'; ctx.lineWidth = 2; ctx.stroke();
    };
    const tick = (time: number) => {
      if (!pausedRef.current && !reduced && lastTime) rotationRef.current += Math.min(time - lastTime, 50) * .00012;
      lastTime = time;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const updateMotion = () => { reduced = motionPreference.matches; draw(); };
    motionPreference.addEventListener('change', updateMotion);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); motionPreference.removeEventListener('change', updateMotion); };
  }, []);

  return (
    <div className="orbit-globe">
      <div className="orbit-globe__top"><span className="orbit-globe__pulse"/> SPATIAL PERSPECTIVE <span>01 / EARTH</span></div>
      <canvas
        ref={canvasRef}
        className="orbit-globe__canvas"
        role="img"
        aria-label="Interactive rotating digital globe representing geography and spatial thinking"
        onPointerDown={(event) => { dragRef.current = { x: event.clientX, active: true }; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => { if (dragRef.current?.active) { rotationRef.current += (event.clientX - dragRef.current.x) * .009; dragRef.current.x = event.clientX; } }}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
      />
      <div className="orbit-globe__bottom"><span>DRAG TO EXPLORE</span><button type="button" onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }} aria-pressed={paused}>{paused ? 'RESUME ROTATION' : 'PAUSE ROTATION'}</button></div>
    </div>
  );
}
