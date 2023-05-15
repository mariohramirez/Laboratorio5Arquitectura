const socket = io();
const canvas = document.getElementById("lienzo");
const ctx = canvas.getContext("2d");
let dibujando = false;
let xAnterior;
let yAnterior;
let colorActual = "#000000";

canvas.addEventListener("mousedown", (event) => {
  dibujando = true;
  xAnterior = event.clientX;
  yAnterior = event.clientY;
});

canvas.addEventListener("mousemove", (event) => {
  if (dibujando) {
    socket.emit("dibujar", {
      x: event.clientX,
      y: event.clientY,
      xAnterior: xAnterior,
      yAnterior: yAnterior,
      color: colorActual
    });
    dibujarLinea(xAnterior, yAnterior, event.clientX, event.clientY, colorActual);
    xAnterior = event.clientX;
    yAnterior = event.clientY;
  }
});

canvas.addEventListener("mouseup", () => {
  dibujando = false;
});

function dibujarLinea(xAnt, yAnt, xAct, yAct, color) {
  ctx.beginPath();
  ctx.moveTo(xAnt, yAnt);
  ctx.lineTo(xAct, yAct);
  ctx.strokeStyle = color;
  ctx.stroke();
}

socket.on("dibujar", (data) => {
  dibujarLinea(data.xAnterior, data.yAnterior, data.x, data.y, data.color);
});

const colorRojo = document.getElementById("color-rojo");
const colorVerde = document.getElementById("color-verde");
const colorAzul = document.getElementById("color-azul");
const colorNegro = document.getElementById("color-negro");
const btnLimpiar = document.getElementById("limpiar");
const btnDescargar = document.getElementById("descargar");

colorRojo.addEventListener("click", () => {
  colorActual = "#ff0000";
});

colorVerde.addEventListener("click", () => {
  colorActual = "#00ff00";
});

colorAzul.addEventListener("click", () => {
  colorActual = "#0000ff";
});

colorNegro.addEventListener("click", () => {
  colorActual = "#000000";
});

btnLimpiar.addEventListener("click", () => {
  socket.emit("limpiar");
  limpiarCanvas(ctx, canvas);
});

function limpiarCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

socket.on("limpiar", () => {
  limpiarCanvas(ctx, canvas);
});

btnDescargar.addEventListener("click", () => {
    // Obtén la imagen del canvas como un archivo PNG
    const dataURL = canvas.toDataURL("image/png");
  
    // Crea un elemento de enlace temporal
    const enlace = document.createElement("a");
  
    // Establece la URL del enlace en la imagen del canvas
    enlace.href = dataURL;
  
    // Establece el atributo 'download' del enlace para que el archivo se descargue con un nombre específico
    enlace.download = "mi_dibujo.png";
  
    // Agrega el enlace temporal al documento
    document.body.appendChild(enlace);
  
    // Haz clic en el enlace temporal para descargar el archivo
    enlace.click();
  
    // Remueve el enlace temporal del documento
    document.body.removeChild(enlace);
  });