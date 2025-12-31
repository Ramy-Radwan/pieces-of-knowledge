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
  if (!ctx) return;

  // ---------- DPI FIX (makes canvas sharp) ----------
  function fixDPI() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // If rect is 0, something is wrong (hidden canvas)
    if (!rect.width || !rect.height) return;

    // set real pixel size
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // scale drawing so our math uses "CSS pixels"
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clarke(a, b) {
    const alpha = a;
    const beta = (a + 2 * b) / Math.sqrt(3);
    return { alpha, beta };
  }

  function drawAxes(center, R) {
    ctx.save();
    ctx.strokeStyle = "rgba(183,195,214,0.45)"; // muted axis
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(center.x - R, center.y);
    ctx.lineTo(center.x + R, center.y);
    ctx.moveTo(center.x, center.y - R);
    ctx.lineTo(center.x, center.y + R);
    ctx.stroke();
    ctx.restore();
  }

  function drawVector(center, R, alpha, beta) {
    const ax = clamp(alpha / 100, -1, 1) * R;
    const by = clamp(beta / 100, -1, 1) * R;

    const x = center.x + ax;
    const y = center.y - by;

    ctx.save();
    ctx.strokeStyle = "rgba(124,192,255,0.95)";
    ctx.fillStyle = "rgba(124,192,255,0.95)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function update() {
    // 1) make canvas sharp and match its displayed size
    fixDPI();

    // 2) use the displayed size (CSS pixels) for math
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const center = vec(W / 2, H / 2);
    const R = Math.min(W, H) * 0.35;

    // 3) read sliders
    const a = Number(aSlider.value);
    const b = Number(bSlider.value);
    const c = -a - b;

    // 4) compute alpha/beta
    const { alpha, beta } = clarke(a, b);

    // 5) clear + draw
    ctx.clearRect(0, 0, W, H);
    drawAxes(center, R);
    drawVector(center, R, alpha, beta);

    // 6) text
    readout.textContent =
      `a=${a}, b=${b}, c=${c} (balanced: a+b+c=0) | α=${alpha.toFixed(1)}, β=${beta.toFixed(1)}`;
  }

  aSlider.addEventListener("input", update);
  bSlider.addEventListener("input", update);

  // redraw when window resizes (important)
  window.addEventListener("resize", update);

  update();
}
