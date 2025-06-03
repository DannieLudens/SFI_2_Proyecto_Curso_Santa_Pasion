const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 3000;

// Servir archivos estáticos desde /public
app.use(express.static("public"));

// Rutas para HTML (sirviendo los archivos desde subcarpetas)
app.get('/mobile', (req, res) => res.sendFile(__dirname + '/public/mobile/mobile.html'));
app.get('/overlay', (req, res) => res.sendFile(__dirname + '/public/overlay/overlay.html'));
app.get('/control', (req, res) => res.sendFile(__dirname + '/public/control/control.html'));

// Mapas de clientes conectados por tipo
let clientes = {
  mobile: new Set(),
  overlay: new Set(),
  control: new Set()
};

// Variable global para la fase actual
let nuevaFase = 'cuaresma';

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  // Por defecto los clientes no dicen qué tipo son, así que lo esperamos
  socket.on('registrarTipo', (tipo) => {
    if (clientes[tipo]) {
      clientes[tipo].add(socket.id);
      console.log(`✅ Cliente ${socket.id} registrado como ${tipo}`);
      emitirConteo();
    }
  });

  // Enviar la fase actual al nuevo cliente
  socket.emit('nuevaFase', nuevaFase);

  // Escuchar cambio de fase desde control
  socket.on('cambiarFase', (nuevaFase) => {
    console.log(`⚙️ Fase cambiada a: ${nuevaFase}`);
    io.emit('nuevaFase', nuevaFase); // reenviar a todos
  });

  // Reenviar interacciones de mobile al overlay
  socket.on('interaccion', (data) => {
    console.log("🛰 Interacción recibida del cliente:", data);
    socket.broadcast.emit('interaccion', data);
  });

  // Reenviar nombres del cierre
  socket.on('nombre', (data) => {
    socket.broadcast.emit('nombre', data);
  });

  socket.on('disconnect', () => {
      for (let tipo in clientes) {
      clientes[tipo].delete(socket.id);
    }
    console.log('❌ Cliente desconectado:', socket.id);
    emitirConteo();
  });

    // Emitir número de clientes
  function emitirConteo() {
    io.emit('conteoClientes', {
      mobile: clientes.mobile.size,
      overlay: clientes.overlay.size,
      control: clientes.control.size
    });
  }
});

http.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
