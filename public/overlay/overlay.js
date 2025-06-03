let socket;
let faseActual = 'cuaresma'; // valor inicial
let efectos = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  clear(); // limpia y asegura transparencia inicial asegurarse de que el servidor/proyector acepta transparencia o tenga chroma key bien configurado.
  socket = io();
  socket.emit("registrarTipo", "overlay");

  socket.on("faseActual", (nuevaFase) => {
    console.log("Fase actualizada en overlay:", nuevaFase);
    faseActual = nuevaFase;
  });

  socket.on("interaccion", (data) => {
    efectos.push({ ...data, createdAt: millis() });
    console.log("🎯 Overlay recibió interacción:", data);
  });
}

function draw() {
    clear(); // limpiar el canvas sin dejar estelas
 noStroke();
  for (let i = efectos.length - 1; i >= 0; i--) {
    let efecto = efectos[i];
    switch (efecto.fase) {
      case 'cuaresma':
        dibujarIncienso(efecto);
        break;
      case 'semanasanta':
        dibujarVela(efecto);
        break;
      case 'pascua':
        dibujarFlor(efecto);
        break;
      case 'cierre':
        dibujarFlorConNombre(efecto);
        break;
      default:
        console.warn('⚠️ Fase desconocida:', efecto.fase);
    }


    // Remover efectos viejos (3 segundos de vida)
    if (millis() - efecto.createdAt > 3000) {
        efectos.splice(i, 1);
    }
  }
}

// 🔸 Ejemplos simples de visuales por fase
function dibujarIncienso(d) {
  fill(200, 200, 255, 80);
  ellipse(d.x, d.y - random(10, 30), 20, 40);
}

function dibujarVela(d) {
  fill(255, 200, 150);
  rect(d.x - 5, d.y - 20, 10, 20);
  fill(255, 255, 0, 200);
  ellipse(d.x, d.y - 25, 10, 10); // llama
}

function dibujarFlor(flor) {
  push();
  translate(flor.x, flor.y);
  let petalos = 6;
  let radio = 10 + random(3); // tamaño aleatorio sutil

  fill(flor.color || randomFlorColor());
  noStroke();

  for (let i = 0; i < petalos; i++) {
    ellipse(0, radio, 15, 25);
    rotate(TWO_PI / petalos);
  }

  fill(255, 220, 100); // centro
  ellipse(0, 0, 10, 10);
  pop();
}


function dibujarFlorConNombre(flor) {
  dibujarFlor(flor); // misma flor que en Pascua
  fill(255);
  textSize(12);
  textAlign(CENTER);
  text(flor.nombre || '', flor.x, flor.y - 30); // nombre encima
}


function randomFlorColor() {
  const coloresFlores = [
    '#ff4d6d', // clavel
    '#f9c74f', // lirio
    '#9d4edd', // crisantemo
    '#48cae4', // hortensia
    '#ffffff'  // blancas devocionales
  ];
  return random(coloresFlores);
}

