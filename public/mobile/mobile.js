let socket;
let faseActual = 'cuaresma';
let currentColor = '#ffffff';
let nombre = '';
let nombreIngresado = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(50);
  socket = io();
  socket.emit("registrarTipo", "mobile");

  // Escuchar fase activa
  socket.on("nuevaFase", (nuevaFase) => {
    console.log("Fase actualizada en mobile:", nuevaFase);
    faseActual = nuevaFase;
    actualizarUI();
    if (faseActual === 'cierre' && !nombreIngresado) {
      pedirNombre();
    }
  });
}

function draw() {
    background(255, 255, 255, 20);
  // nada constante, solo visual, feedback temporal con touch
}

function touchMoved() {
    console.log("👆 touchMoved detectado");
  if (faseActual === 'cuaresma' || faseActual === 'pascua') {
    enviarInteraccion(mouseX, mouseY);
    mostrarFeedback(mouseX,mouseY);


  }
  return false;
}

function touchStarted() {
    console.log("👉 touchStarted detectado");
  if (faseActual === 'semanasanta' || faseActual === 'cierre') {
    enviarInteraccion(mouseX, mouseY);
    mostrarFeedback(mouseX,mouseY);
  }
  return false;
}

function enviarInteraccion(x, y) {
  const data = {
    x,
    y,
    color: currentColor,
    nombre: nombre,
    fase: faseActual
  };
  console.log("📤 Enviando interacción:", data);
  socket.emit("interaccion", data);
}

function mostrarFeedback(x,y) {
    noStroke();
    fill(150,150,150,80);
    ellipse(x,y,30,30);
}

function actualizarUI() {
  const titulo = document.getElementById('fase');
  const indicacion = document.getElementById('indicacion');

  if (faseActual === 'cuaresma') {
    titulo.textContent = "Cuaresma";
    indicacion.textContent = "Desliza tu dedo por la pantalla para ofrecer incienso en la proyección";
  } else if (faseActual === 'semanasanta') {
    titulo.textContent = "Semana Santa";
    indicacion.textContent = "Toca la pantalla para encender una vela en la procesión";
  } else if (faseActual === 'pascua') {
    titulo.textContent = "Pascua";
    indicacion.textContent = "Dibuja flores en la fachada con tu dedo";
  } else if (faseActual === 'cierre') {
    titulo.textContent = "Cierre";
    indicacion.textContent = "Escribe tu nombre para crear una flor devocional";
  }
}

function pedirNombre() {
  nombre = prompt("Ingresa tu nombre para la flor de cierre:");
  if (nombre && nombre.trim() !== '') {
    nombreIngresado = true;
  }
}
