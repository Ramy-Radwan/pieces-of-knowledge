import { qs } from "../utils/dom.js";
import { degToRad } from "../utils/math.js";
import { vec, rotate } from "../utils/vector.js";

export function mountSvmHexagon(rootId) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const canvas = qs("canvas", root);
    const angleSlider = qs("[data-angle]", root);
    const magSlider = qs("[data-mag]", root);
    const readout = qs("[data-readout]", root);

    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const center = vec(W / 2, H / 2);
    const R = Math.min(W, H) * 0.35;

    function draw(angleDeg, m) {
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(124,192,255,0.95)";
        ctx.fillStyle = "rgba(124,192,255,0.95)";


        // Hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = degToRad(60 * i - 90);
            const x = center.x + R * Math.cos(a);
            const y = center.y + R * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();

        // Active vectors (6)
        for (let i = 0; i < 6; i++) {
            const a = degToRad(60 * i - 90);
            const x = center.x + R * Math.cos(a);
            const y = center.y + R * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(x, y);
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Resultant vector
        const base = vec(R * m, 0);
        const v = rotate(base, degToRad(angleDeg - 90));
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + v.x, center.y + v.y);
        ctx.lineWidth = 4;
        ctx.stroke();

        // Dot at tip
        ctx.beginPath();
        ctx.arc(center.x + v.x, center.y + v.y, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    function update() {
        const angleDeg = Number(angleSlider.value);
        const m = Number(magSlider.value) / 100;
        draw(angleDeg, m);
        readout.textContent = `angle=${angleDeg}°, magnitude=${m.toFixed(2)} (normalized)`;
    }

    angleSlider.addEventListener("input", update);
    magSlider.addEventListener("input", update);
    update();
}
