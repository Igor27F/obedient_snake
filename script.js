const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let promise = navigator.mediaDevices.getUserMedia({ audio: true });
promise
  .then(function (signal) {
    startRecognition();
    animate();
  })
  .catch(function (err) {
    alert("Microphone error: " + err);
  });
const recognitionSvc =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new recognitionSvc();
let listening = false;
let result = "";

recognition.lang = "pt-BR";
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 3;

const mapWidth = 40;
const mapHeight = 20;
const pixelSize = 30;
canvas.width = pixelSize * mapWidth;
canvas.height = pixelSize * mapHeight;
let snakeSpeed = 300;

function startRecognition() {
  // listening ? recognition.stop() : recognition.start();
  // listening = !listening;
  recognition.start();
}

var square = {
  x: 0,
  y: 0,
  direction: "right",
};
var food = {
  x: Math.floor(Math.random() * mapWidth) * pixelSize,
  y: Math.floor(Math.random() * mapHeight) * pixelSize,
};
var snake = [
  {
    x: 0,
    y: 0,
    direction: "right",
  },
];
for (i = 0; i < snake.length; i++) {
  snake[i].x = canvas.width / 2 - pixelSize * (1 + i);
  snake[i].y = canvas.height / 2 - pixelSize;
}
function animate(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (snake[0].x == food.x && snake[0].y == food.y) {
    AddSize();
    food.x = Math.floor(Math.random() * mapWidth) * pixelSize;
    food.y = Math.floor(Math.random() * mapHeight) * pixelSize;
  }
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, pixelSize, pixelSize);
  for (i = 0; i < snake.length; i++) {
    pixel = snake[i];
    switch (pixel.direction) {
      case "up":
        pixel.y -= pixelSize;
        break;
      case "right":
        pixel.x += pixelSize;
        break;
      case "down":
        pixel.y += pixelSize;
        break;
      case "left":
        pixel.x -= pixelSize;
        break;
      case "stop":
        break;
    }
    if (pixel.x == canvas.width) {
      pixel.x = 0;
    } else if (pixel.x == -pixelSize) {
      pixel.x = canvas.width - pixelSize;
    }
    if (pixel.y == canvas.height) {
      pixel.y = 0;
    } else if (pixel.y == -pixelSize) {
      pixel.y = canvas.height - pixelSize;
    }
    ctx.fillStyle = "white";
    ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
  }
  if (snake.length > 0) {
    for (i = snake.length - 1; i > 0; i--) {
      snake[i].direction = snake[i - 1].direction;
    }
  }
  //ctx.lineDashOffset = time / 10000;
  //requestAnimationFrame(animate);
  setTimeout(animate, snakeSpeed);
}
function AddSize() {
  snake.push({
    x: snake[snake.length - 1].x,
    y: snake[snake.length - 1].y,
    direction: null,
  });
}
function draw() {}
recognition.onresult = (event) => {
  result = event.results[event.results.length - 1];
  for (i = 0; i < result.length; i++) {
    words = result[i].transcript.toUpperCase().split(" ");
    for (j = 0; j < words.length; j++) {
      word = words[j];
      console.log(word);
      if (
        word == "CIMA" ||
        word == "CYMA" ||
        word == "ENCIMA" ||
        word == "ACIMA"
      ) {
        snake[0].direction = "up";
      } else if (word == "DIREITA" || word == "DIREITO") {
        snake[0].direction = "right";
      } else if (word == "ESQUERDA" || word == "ESQUERDO") {
        snake[0].direction = "left";
      } else if (
        word == "BAIXO" ||
        word == "BAIXA" ||
        word == "EMBAIXO" ||
        word == "ABAIXO" ||
        word == "ABAIXA"
      ) {
        snake[0].direction = "down";
      } else if (word == "PARA" || word == "CHEGA" || word == "PAROU") {
        snake[0].direction = "stop";
      }
      if (word == "ACELERA" || word == "RAPIDO" || word == "RÁPIDO") {
        snakeSpeed = 100;
      }
      if (
        word == "DEVAGAR" ||
        word == "LENTO" ||
        word == "LENTA" ||
        word == "DESACELERA" ||
        word == "CALMA"
      ) {
        snakeSpeed = 500;
      }
    }
  }
};
