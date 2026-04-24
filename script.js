const canvas = document.querySelector("#countrySignal");
const ctx = canvas?.getContext("2d");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");

let width = 0;
let height = 0;
let points = [];
let pointer = { x: 0, y: 0, active: false };

const palette = ["#1f6f52", "#205b7a", "#b23a48", "#b9643a", "#7a8d48"];

function resize() {
  if (!canvas || !ctx) return;

  const scale = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  createPoints();
}

function createPoints() {
  const count = Math.max(42, Math.min(96, Math.floor(width / 15)));
  points = Array.from({ length: count }, (_, index) => {
    const verticalBias = index / count;
    const chileCurve = Math.sin(verticalBias * Math.PI * 2.4) * 42;
    return {
      x: width * 0.58 + chileCurve + (Math.random() - 0.5) * width * 0.32,
      y: height * 0.04 + verticalBias * height * 0.92 + (Math.random() - 0.5) * 58,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 1.4 + Math.random() * 2.8,
      color: palette[index % palette.length],
    };
  });
}

function drawChileTrace() {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width * 0.56, height * 0.08);

  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    const x = width * 0.56 + Math.sin(t * Math.PI * 3.2) * 34;
    const y = height * 0.08 + t * height * 0.84;
    ctx.lineTo(x, y);
  }

  ctx.lineWidth = Math.max(22, width * 0.03);
  ctx.strokeStyle = "rgba(31, 111, 82, 0.08)";
  ctx.stroke();
  ctx.restore();
}

function animate() {
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  drawChileTrace();

  points.forEach((point, index) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < width * 0.18 || point.x > width * 0.96) point.vx *= -1;
    if (point.y < 20 || point.y > height - 20) point.vy *= -1;

    for (let j = index + 1; j < points.length; j += 1) {
      const other = points[j];
      const dx = point.x - other.x;
      const dy = point.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 138) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(22, 33, 31, ${0.13 * (1 - distance / 138)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (pointer.active) {
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 190) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = `rgba(178, 58, 72, ${0.18 * (1 - distance / 190)})`;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fillStyle = point.color;
    ctx.globalAlpha = 0.38;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

menuToggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("nav-open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (canvas && ctx) {
  resize();
  animate();
}
