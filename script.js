const canvas = document.querySelector("#countrySignal");
const ctx = canvas?.getContext("2d");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const radarGrid = document.querySelector("#radarGrid");
const radarCount = document.querySelector("#radarCount");
const radarFilters = document.querySelectorAll("[data-radar-filter]");
const radarReset = document.querySelector("[data-radar-reset]");

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

const radarItems = [
  {
    title: "Oportunidades de valorización de residuos",
    challenge: "Medioambiente",
    industry: "Economía circular",
    capability: "Análisis documental",
    pilot: "Analizar reportes, planillas y contratos para detectar residuos valorizables y posibles usos secundarios.",
    impact: "Reduce disposición final, abre nuevos ingresos y mejora trazabilidad ambiental.",
  },
  {
    title: "Agente de cumplimiento ambiental",
    challenge: "Conocimiento",
    industry: "Minería sostenible",
    capability: "Búsqueda semántica",
    pilot: "Cruzar permisos, RCA, reportes operacionales y normativa para responder preguntas con evidencia.",
    impact: "Disminuye riesgo regulatorio y acelera revisión técnica en equipos ambientales.",
  },
  {
    title: "Predicción de demanda energética",
    challenge: "Productividad",
    industry: "Energía",
    capability: "Predicción",
    pilot: "Combinar históricos de consumo, clima y operación para anticipar demanda y optimizar compras.",
    impact: "Mejora eficiencia, reduce costos y apoya la transición energética.",
  },
  {
    title: "Copiloto de riego y estrés hídrico",
    challenge: "Medioambiente",
    industry: "Agroindustria",
    capability: "Copilotos",
    pilot: "Asistir decisiones de riego usando clima, suelo, cultivo, imágenes y reglas agronómicas.",
    impact: "Ahorra agua, protege producción y fortalece adaptación climática.",
  },
  {
    title: "Optimización de rutas portuarias",
    challenge: "Productividad",
    industry: "Logística",
    capability: "Automatización",
    pilot: "Coordinar ventanas, rutas, cargas y restricciones operacionales con agentes de planificación.",
    impact: "Reduce tiempos muertos, emisiones y costos de coordinación logística.",
  },
  {
    title: "Radar de transferencia tecnológica",
    challenge: "Conocimiento",
    industry: "I+D y talento",
    capability: "Agentes",
    pilot: "Explorar papers, patentes, fondos y capacidades universitarias para detectar proyectos transferibles.",
    impact: "Conecta investigación con industria y acelera innovación aplicada.",
  },
  {
    title: "Simbiosis industrial territorial",
    challenge: "Territorio",
    industry: "Economía circular",
    capability: "Agentes",
    pilot: "Relacionar residuos de una empresa con insumos potenciales de otra dentro de una misma zona productiva.",
    impact: "Crea colaboración territorial, reduce residuos y mejora competitividad local.",
  },
  {
    title: "Copiloto de seguridad operacional",
    challenge: "Productividad",
    industry: "Minería sostenible",
    capability: "Copilotos",
    pilot: "Leer incidentes, procedimientos y reportes para sugerir controles preventivos antes de una tarea.",
    impact: "Apoya mejores decisiones en terreno y reduce exposición a riesgos críticos.",
  },
  {
    title: "Asistente de reconversión laboral",
    challenge: "Territorio",
    industry: "I+D y talento",
    capability: "Búsqueda semántica",
    pilot: "Mapear brechas de habilidades entre industrias locales, cursos disponibles y nuevos roles con IA.",
    impact: "Facilita movilidad laboral y formación pertinente para cambios productivos.",
  },
  {
    title: "Detección de pérdidas en cadenas de alimentos",
    challenge: "Medioambiente",
    industry: "Agroindustria",
    capability: "Predicción",
    pilot: "Analizar calidad, tiempos, temperatura y logística para anticipar pérdidas y mermas.",
    impact: "Reduce desperdicio, mejora margen y fortalece seguridad alimentaria.",
  },
];

function getRadarState() {
  return Array.from(radarFilters).reduce((state, filter) => {
    state[filter.dataset.radarFilter] = filter.value;
    return state;
  }, {});
}

function matchesRadarFilters(item, filters) {
  return Object.entries(filters).every(([key, value]) => value === "all" || item[key] === value);
}

function renderRadar() {
  if (!radarGrid || !radarCount) return;

  const filters = getRadarState();
  const visibleItems = radarItems.filter((item) => matchesRadarFilters(item, filters));

  radarCount.textContent = String(visibleItems.length);

  if (visibleItems.length === 0) {
    radarGrid.innerHTML = `
      <article class="radar-empty">
        <h3>No hay pilotos con esa combinación.</h3>
        <p>Prueba limpiar filtros o combinar otro desafío con otra industria.</p>
      </article>
    `;
    return;
  }

  radarGrid.innerHTML = visibleItems
    .map(
      (item) => `
        <article class="radar-card">
          <header>
            <div class="radar-meta">
              <span>${item.challenge}</span>
              <span>${item.industry}</span>
              <span>${item.capability}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.pilot}</p>
          </header>
          <div class="radar-impact">
            <strong>Impacto esperado</strong>
            <p>${item.impact}</p>
          </div>
        </article>
      `
    )
    .join("");
}

radarFilters.forEach((filter) => filter.addEventListener("change", renderRadar));
radarReset?.addEventListener("click", () => {
  radarFilters.forEach((filter) => {
    filter.value = "all";
  });
  renderRadar();
});

renderRadar();
