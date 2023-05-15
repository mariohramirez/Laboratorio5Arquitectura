// Importar los módulos necesarios
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// Crear la aplicación de Express y el servidor HTTP
const app = express();
const server = http.createServer(app);

// Configurar la carpeta "public" como carpeta estática
app.use(express.static("public"));

// Configurar Socket.IO en el servidor HTTP
const io = socketIO(server);

// Variables globales para el color y grosor de línea
let color = "#000000";
let grosor = 5;

// Registrar un oyente de eventos para el evento "connection" en Socket.IO
io.on("connection", (socket) => {
  console.log(`El socket ${socket.id} se ha conectado.`);

  // Emitir el evento "cambiarColor" al socket que se acaba de conectar
  socket.emit("cambiarColor", color);

  // Emitir el evento "cambiarGrosor" al socket que se acaba de conectar
  socket.emit("cambiarGrosor", grosor);

  // Emitir el evento "limpiarCanvas" a todos los sockets conectados
  socket.on("limpiarCanvas", () => {
    // Borrar el canvas
    io.emit("limpiarCanvas");
  });

  // Registrar un oyente de eventos para el evento "dibujar"
  socket.on("dibujar", ({ x, y, xAnterior, yAnterior, color }) => {
    // Emitir el evento "dibujar" a todos los demás sockets conectados
    socket.broadcast.emit("dibujar", { x, y, xAnterior, yAnterior, color });
  });

  // Registrar un oyente de eventos para el evento "disconnect" en el socket
  socket.on("disconnect", () => {
    console.log(`El socket ${socket.id} se ha desconectado.`);
  });
});

// Iniciar el servidor HTTP en el puerto 3000
server.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});
