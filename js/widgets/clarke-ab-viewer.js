import { qs, clamp } from "../utils/dom.js";
import { vec } from "../utils/vector.js";

export function mountClarkeABViewer(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const canvas = qs("canvas", root);
  const aSlider = qs("[data-a]", root);
  const bSlider = qs("[data-b]", root);
  const readout = qs("[data-readout]", root);

  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const center = vec(W / 2, H / 2);
  const R = Math.min(W, H) * 0.35;

  function clarke(a, b) {
    // balanced assumption: c = -a - b
    // Simple common form:
    // alpha = a
    // beta  = (a + 2b)/sqrt(3)
    const alpha = a;
    const beta = (a + 2 * b) / Math.sqrt(3);
    return { alpha, beta };
  }

  function drawAxes() {
    ctx.beginPath();
    ctx.moveTo(center.x - R, center.y);
    ctx.lineTo(center.x + R, center.y);
    ctx.moveTo(center.x, center.y - R);
    ctx.lineTo(center.x, center.y + R);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawVector(alpha, beta) {
    // Normalize so sliders [-100..100] map nicely
    const ax = clamp(alpha / 100, -1, 1) * R;
    const by = clamp(beta / 100, -1, 1) * R;

    // Canvas Y is downwards, so invert beta for visual intuition
    const x = center.x + ax;
    const y = center.y - by;

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(x, y);
    ctx.lineWidth = 4;
    ctx.stroke();

    // dot at tip
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  function update() {
    const a = Number(aSlider.value);
    const b = Number(bSlider.value);
    const c = -a - b;

    const { alpha, beta } = clarke(a, b);

    ctx.clearRect(0, 0, W, H);
    drawAxes();
    drawVector(alpha, beta);

    readout.textContent =
      `a=${a}, b=${b}, c=${c} (balanced: a+b+c=0) | α=${alpha.toFixed(1)}, β=${beta.toFixed(1)}`;
  }

  aSlider.addEventListener("input", update);
  bSlider.addEventListener("input", update);
  update();
}
