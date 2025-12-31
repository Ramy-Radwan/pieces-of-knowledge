export function setupCanvas(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // If hidden or not laid out yet, skip safely
  if (!rect.width || !rect.height) return { W: 0, H: 0, dpr };

  // Set internal pixel buffer to match displayed size * DPR
  canvas.width  = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  // Make drawing coordinates use CSS pixels (not device pixels)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Return "math size" in CSS pixels (what you should use everywhere)
  return { W: rect.width, H: rect.height, dpr };
}
