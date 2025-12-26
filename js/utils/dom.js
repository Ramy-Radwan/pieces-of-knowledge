export function qs(sel, root = document) {
  return root.querySelector(sel);
}
export function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}
