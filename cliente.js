// Conectar al servidor de WebSocket
const socket = io();

// Obtener el canvas y el contexto de dibujo
const canvas = document.querySelector("#lienzo");
const contexto = canvas.getContext("2d");

// Variables globales para el color y grosor de línea
let color = "#000000";
let grosor = 5;

// Registrar un oyente de eventos para el evento "cambiarColor"
socket.on("cambiarColor", (nuevoColor) => {
  color = nuevoColor;
});

// Registrar un oyente de eventos para el evento "cambiarGrosor"
socket.on("cambiarGrosor", (nuevoGrosor) => {
  grosor = nuevoGrosor;
});

// Registrar un oyente de eventos para el evento "dibujar"
socket.on("dibujar", ({ x, y, xAnterior, yAnterior }) => {
  // Dibujar una línea desde la posición anterior hasta la posición actual
  contexto.beginPath();
  contexto.moveTo(xAnterior, yAnterior);
  contexto.lineTo(x, y);
  contexto.strokeStyle = color;
  contexto.lineWidth = grosor;
  contexto.stroke();
});

// Registrar un oyente de eventos para el evento "mousemove" en el canvas
canvas.addEventListener("mousemove", (evento) => {
  // Obtener la posición actual del mouse
  const x = evento.clientX - canvas.offsetLeft;
  const y = evento.clientY - canvas.offsetTop;

  // Obtener la posición anterior del mouse
  const xAnterior = x - evento.movementX;
  const yAnterior = y - evento.movementY;

  // Dibujar una línea desde la posición anterior hasta la posición actual
  contexto.beginPath();
  contexto.moveTo(xAnterior, yAnterior);
  contexto.lineTo(x, y);
  contexto.strokeStyle = color;
  contexto.lineWidth = grosor;
  contexto.stroke();

  // Emitir el evento "dibujar" al servidor de WebSocket con los datos de dibujo
  socket.emit("dibujar", { x, y, xAnterior, yAnterior });
});

// Obtener el botón "Limpiar"
const botonLimpiar = document.querySelector("#limpiar");

// Registrar un oyente de eventos para el evento "click" en el botón "Limpiar"
botonLimpiar.addEventListener("click", () => {
  // Emitir el evento "limpiar" al servidor de WebSocket
  socket.emit("limpiar");
});

