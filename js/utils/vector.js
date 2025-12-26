export function vec(x, y) { return { x, y }; }

export function add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; }
export function sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; }
export function mul(a, k) { return { x: a.x * k, y: a.y * k }; }

export function mag(a) { return Math.hypot(a.x, a.y); }

export function rotate(a, angleRad) {
  const c = Math.cos(angleRad), s = Math.sin(angleRad);
  return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
}
