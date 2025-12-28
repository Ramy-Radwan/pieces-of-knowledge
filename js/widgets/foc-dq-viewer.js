import { qs } from "../utils/dom.js";
import { degToRad } from "../utils/math.js";
import { vec, rotate } from "../utils/vector.js";

export function mountFocDqViewer(rootId) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const canvas = qs("canvas", root);
    const thetaSlider = qs("[data-theta]", root);
    const idSlider = qs("[data-id]", root);
    const iqSlider = qs("[data-iq]", root);
    const readout = qs("[data-readout]", root);

    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const center = vec(W / 2, H / 2);
    const R = Math.min(W, H) * 0.35;

    function axis() {
        ctx.beginPath();
        ctx.moveTo(center.x - R, center.y);
        ctx.lineTo(center.x + R, center.y);
        ctx.moveTo(center.x, center.y - R);
        ctx.lineTo(center.x, center.y + R);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function draw(thetaDeg, id, iq) {
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(124,192,255,0.95)"; // visible light blue
        ctx.fillStyle = "rgba(124,192,255,0.95)";
        axis();

        // dq vector in dq frame (d along x, q along y)
        const dq = vec((id / 100) * R, -(iq / 100) * R); // invert y for canvas
        // rotate dq into alpha-beta (conceptually inverse Park)
        const ab = rotate(dq, degToRad(thetaDeg));

        // Draw dq vector (in its own frame) as reference arrow on screen
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + dq.x, center.y + dq.y);
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw alpha-beta (rotated) vector
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + ab.x, center.y + ab.y);
        ctx.lineWidth = 4;
        ctx.stroke();

        readout.textContent =
            `theta=${thetaDeg}°, Id=${(id / 100).toFixed(2)}, Iq=${(iq / 100).toFixed(2)} (normalized)`;
    }

    function update() {
        const thetaDeg = Number(thetaSlider.value);
        const id = Number(idSlider.value);
        const iq = Number(iqSlider.value);
        draw(thetaDeg, id, iq);
    }

    thetaSlider.addEventListener("input", update);
    idSlider.addEventListener("input", update);
    iqSlider.addEventListener("input", update);
    update();
}
