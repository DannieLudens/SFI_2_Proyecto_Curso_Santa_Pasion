let socket = io();
socket.emit("registrarTipo", "control");
let faseActual = 'cuaresma';
actualizarUI();

socket.on('connect', () => {
  document.getElementById("status").textContent = "Conectado";
  console.log('🔌 Control conectado al servidor');
});

// Mostrar conexión perdida
socket.on("disconnect", () => {
  document.getElementById("status").textContent = "Desconectado";
  console.log('Desconectado del servidor');
});

// Recibir y mostrar conteo de clientes
socket.on("conteoClientes", (conteo) => {
  document.getElementById("countMobile").textContent = conteo.mobile;
  document.getElementById("countOverlay").textContent = conteo.overlay;
  document.getElementById("countControl").textContent = conteo.control;
});

// Escuchar fase actual del servidor al conectar o al cambiar
socket.on('faseActual', (nuevaFase) => {
  console.log("🔄 Fase actualizada desde el servidor:", nuevaFase);
  faseActual = nuevaFase;
  actualizarUI();
});

function cambiarFase(nuevaFase) {
  faseActual = nuevaFase;
  socket.emit("cambiarFase", nuevaFase);
  actualizarUI();
}

function actualizarUI() {
  document.getElementById("faseActual").textContent =
    "Fase actual: " + faseActual.toUpperCase();
}
