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

    con
