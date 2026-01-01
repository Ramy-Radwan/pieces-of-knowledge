import { qs } from "../utils/dom.js";
import { degToRad } from "../utils/math.js";
import { vec, rotate } from "../utils/vector.js";
import { setupCanvas } from "../utils/canvas.js";

export function mountSvmHexagon(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const canvas = qs("canvas", root);
  const angleSlider = qs("[data-angle]", root);
  const magSlider = qs("[data-mag]", root);
  const readout = qs("[data-readout]", root);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function draw(angleDeg, m) {
    const { W, H } = setupCanvas(canvas, ctx);
    if (!W || !H) return;

    const center = vec(W / 2, H / 2);
    const R = Math.min(W, H) * 0.35;

    ctx.clearRect(0, 0, W, H);

    // Colors (dark theme safe)
    const colorGrid = "rgba(183,195,214,0.45)";
    const colorActive = "rgba(183,195,214,0.35)";
    const colorResult = "rgba(124,192,255,0.95)";

    // Hexagon (SVM boundary)
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = degToRad(60 * i - 90);
      const x = center.x + R * Math.cos(a);
      const y = center.y + R * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorGrid;
    ctx.stroke();

    // Active vectors (6)
    ctx.strokeStyle = colorActive;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = degToRad(60 * i - 90);
      const x = center.x + R * Math.cos(a);
      const y = center.y + R * Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Resultant vector
    const base = vec(R * m, 0);
    const v = rotate(base, degToRad(angleDeg - 90));

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + v.x, center.y + v.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = colorResult;
    ctx.stroke();

    // Dot at tip
    ctx.beginPath();
    ctx.arc(center.x + v.x, center.y + v.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = colorResult;
    ctx.fill();
  }

  function update() {
    const angleDeg = Number(angleSlider.value);
    const m = Number(magSlider.value) / 100;
    draw(angleDeg, m);
    readout.textContent =
      `angle=${angleDeg}°, magnitude=${m.toFixed(2)} (normalized)`;
  }

  angleSlider.addEventListener("input", update);
  magSlider.addEventListener("input", update);

  update();
}
