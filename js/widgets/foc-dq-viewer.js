import { qs } from "../utils/dom.js";
import { degToRad } from "../utils/math.js";
import { vec, rotate } from "../utils/vector.js";
import { setupCanvas } from "../utils/canvas.js";

export function mountFocDqViewer(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const canvas = qs("canvas", root);
  const thetaSlider = qs("[data-theta]", root);
  const idSlider = qs("[data-id]", root);
  const iqSlider = qs("[data-iq]", root);
  const readout = qs("[data-readout]", root);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;



  function drawAxes(center, R) {
    ctx.save();
    ctx.strokeStyle = "rgba(183,195,214,0.45)";
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

  function draw(thetaDeg, id, iq) {
    const { W, H } = setupCanvas(canvas, ctx);
    if (!W || !H) return;

    const center = vec(W / 2, H / 2);
    const R = Math.min(W, H) * 0.35;

    ctx.clearRect(0, 0, W, H);

    // Colors (dark theme safe)
    const colorDQ = "rgba(183,195,214,0.85)"; // dq reference (muted)
    const colorAB = "rgba(124,192,255,0.95)"; // alpha-beta (accent)

    drawAxes(center, R);

    // dq vector in dq frame: d along +x, q along +y
    // Canvas y is
