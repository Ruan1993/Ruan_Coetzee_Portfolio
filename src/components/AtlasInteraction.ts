export type AtlasDrag = { pointerId: number; startX: number; startY: number; x: number; y: number; moved: boolean; touch: boolean };
export function beginAtlasDrag(pointerId: number, x: number, y: number, touch: boolean): AtlasDrag {
  return { pointerId, startX: x, startY: y, x, y, moved: false, touch };
}
export function moveAtlasDrag(drag: AtlasDrag, pointerId: number, x: number, y: number) {
  if (drag.pointerId !== pointerId) return null;
  if (!drag.moved && Math.hypot(x - drag.startX, y - drag.startY) < 5) return null;
  const first = !drag.moved;
  drag.moved = true;
  const dx = x - drag.x, dy = y - drag.y;
  drag.x = x; drag.y = y;
  return { first, yaw: -dx * .006, pitch: drag.touch ? 0 : -dy * .004 };
}
export function finishAtlasDrag(drag: AtlasDrag | null, pointerId: number) {
  return drag?.pointerId === pointerId ? { moved: drag.moved } : null;
}

// Pitch is applied in world coordinates; its screen direction reverses on the far side.
export function pitchForView(delta: number, yaw: number) {
  return delta * (Math.cos(yaw) < 0 ? -1 : 1);
}
