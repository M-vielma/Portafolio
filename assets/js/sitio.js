// miguelvielma.com v4. Sin dependencias ni peticiones externas.
// Todo el texto dinamico entra con textContent: nunca innerHTML.
"use strict";

/* ----------------------------------------------------------- menu movil */
(function menu() {
  const boton = document.querySelector(".menu__abrir");
  const lista = document.getElementById("menu");
  if (!boton || !lista) return;
  const cerrar = () => {
    lista.classList.remove("menu--abierto");
    boton.setAttribute("aria-expanded", "false");
  };
  boton.addEventListener("click", () => {
    const abierto = lista.classList.toggle("menu--abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });
  lista.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lista.classList.contains("menu--abierto")) { cerrar(); boton.focus(); }
  });
})();

/* ----------------------------------------------------------- ano del pie */
document.querySelectorAll("[data-ano]").forEach((n) => { n.textContent = String(new Date().getFullYear()); });

/* ----------------------------------------------------------- demo del bot */
(function demo() {
  const chat = document.querySelector("[data-demo-chat]");
  const opciones = document.querySelector("[data-demo-opciones]");
  const terminal = document.querySelector("[data-demo-terminal]");
  if (!chat || !opciones || !terminal) return;

  // Guion de la demo. Pedido, comuna y montos son ficticios.
  const GUION = {
    inicio: {
      cliente: "Hola, hice un pedido en la tienda",
      bot: ["¡Hola, Camila! Encontré tu pedido #1042: 2 poleras talla M, total $24.990, con entrega mañana en Maipú.",
            "¿Lo confirmas?"],
      log: [["$", "pedido 1042 encontrado"], ["·", "cliente reconocido por su número"]],
      opciones: [["confirmar", "Confirmar pedido"], ["direccion", "Cambiar dirección"], ["persona", "Hablar con una persona"]],
    },
    confirmar: {
      cliente: "Confirmar pedido",
      bot: ["Listo, quedó confirmado. Te aviso por aquí cuando salga a reparto."],
      log: [["✓", "pedido 1042 confirmado"], ["✓", "planilla de pedidos actualizada"], ["✓", "aviso enviado al dueño"]],
      opciones: [],
    },
    direccion: {
      cliente: "Cambiar dirección",
      bot: ["Claro. ¿A qué dirección lo enviamos?"],
      log: [["$", "esperando dirección nueva"]],
      opciones: [["direccion_ok", "Av. Pajaritos 1234, Maipú"]],
    },
    direccion_ok: {
      cliente: "Av. Pajaritos 1234, Maipú",
      bot: ["Anotado: Av. Pajaritos 1234, Maipú. Tu pedido quedó confirmado con la dirección nueva."],
      log: [["✓", "dirección actualizada"], ["✓", "pedido 1042 confirmado"], ["✓", "aviso enviado al dueño"]],
      opciones: [],
    },
    persona: {
      cliente: "Hablar con una persona",
      bot: ["Te escribe alguien del equipo en unos minutos. Mientras tanto, tu pedido queda reservado."],
      log: [["✓", "conversación marcada como prioritaria"], ["✓", "aviso al dueño por WhatsApp"]],
      opciones: [],
    },
  };

  const crear = (etiqueta, clase, texto) => {
    const n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  };

  const burbuja = (texto, quien) => {
    chat.appendChild(crear("p", `burbuja burbuja--${quien} burbuja--nueva`, texto));
  };

  const linea = (signo, texto) => {
    const fila = crear("p");
    fila.appendChild(crear("span", signo === "$" ? "prompt" : "ok", `${signo} `));
    fila.appendChild(document.createTextNode(texto));
    terminal.appendChild(fila);
  };

  const ponerOpciones = (lista) => {
    opciones.replaceChildren();
    if (!lista.length) {
      const otra = crear("button", "chip", "Ver la demo otra vez");
      otra.type = "button";
      otra.addEventListener("click", reiniciar);
      opciones.appendChild(otra);
      return;
    }
    for (const [clave, texto] of lista) {
      const b = crear("button", "chip", texto);
      b.type = "button";
      b.addEventListener("click", () => paso(clave, true));
      opciones.appendChild(b);
    }
  };

  function paso(clave, porUsuario) {
    const p = GUION[clave];
    if (!p) return;
    if (porUsuario) burbuja(p.cliente, "cliente");
    p.bot.forEach((t) => burbuja(t, "bot"));
    p.log.forEach(([s, t]) => linea(s, t));
    ponerOpciones(p.opciones);
    // El foco pasa a la primera opcion nueva para seguir con teclado sin perderse.
    if (porUsuario) {
      const primera = opciones.querySelector("button");
      if (primera) primera.focus({ preventScroll: true });
    }
  }

  function reiniciar() {
    chat.querySelectorAll(".burbuja").forEach((n) => n.remove());
    terminal.replaceChildren();
    burbuja(GUION.inicio.cliente, "cliente");
    paso("inicio", false);
    const primera = opciones.querySelector("button");
    if (primera && document.activeElement && document.activeElement.classList.contains("chip")) primera.focus({ preventScroll: true });
  }

  reiniciar();
})();
