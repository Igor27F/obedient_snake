const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const recognitionSvc =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new recognitionSvc();
let listening = false;
let result = "";

recognition.lang = "pt-BR";
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 3;

const pixelSize = 30;
canvas.width = pixelSize * 40;
canvas.height = pixelSize * 20;
let snakeSpeed = 500;

var snakeDirection = "right";

function startRecognition() {
  // listening ? recognition.stop() : recognition.start();
  // listening = !listening;
  recognition.start();
}
var headX = canvas.width / 2 - pixelSize;
var headY = canvas.height / 2 - pixelSize;
animate();

function animate(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  switch (snakeDirection) {
    case "up":
      headY -= pixelSize;
      break;
    case "right":
      headX += pixelSize;
      break;
    case "down":
      headY += pixelSize;
      break;
    case "left":
      headX -= pixelSize;
      break;
    case "stop":
      break;
  }
  if (headX == canvas.width) {
    headX = 0;
  } else if (headX == -pixelSize) {
    headX = canvas.width - pixelSize;
  }
  if (headY == canvas.height) {
    headY = 0;
  } else if (headY == -pixelSize) {
    headY = canvas.height - pixelSize;
  }
  ctx.fillStyle = "white";
  ctx.fillRect(headX, headY, pixelSize, pixelSize);
  //ctx.lineDashOffset = time / 10000;
  //requestAnimationFrame(animate);
  setTimeout(animate, snakeSpeed);
}
recognition.onresult = (event) => {
  result = event.results[event.results.length - 1];
  for (i = 0; i < result.length; i++) {
    word = result[i].transcript.toUpperCase();
    console.log(word);
    if (word.includes("CIMA")) {
      snakeDirection = "up";
    } else if (word.includes("DIREITA")) {
      snakeDirection = "right";
    } else if (word.includes("ESQUERDA")) {
      snakeDirection = "left";
    } else if (word.includes("BAIXO")) {
      snakeDirection = "down";
    } else if (
      word.includes("PARA") ||
      word.includes("CHEGA") ||
      word.includes("PAROU")
    ) {
      snakeDirection = "stop";
    }
    if (
      word.includes("ACELERA") ||
      word.includes("RAPIDO") ||
      word.includes("RÁPIDO")
    ) {
      snakeSpeed = 100;
    }
    if (
      word.includes("DEVAGAR") ||
      word.includes("LENTO") ||
      word.includes("LENTA") ||
      word.includes("DESACELERA") ||
      word.includes("CALMA")
    ) {
      snakeSpeed = 500;
    }
  }
};
