// script.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

// Set up canvas size
canvas.width = 400;
canvas.height = 400;

// Game variables
let snake = [{ x: 200, y: 200 }];
let snakeDirection = { x: 20, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;
let gameInterval = null; // To control the game loop
let gameStarted = false; // To check if the game has started

// Watermark variables
let watermarkX = canvas.width / 2;
let watermarkY = canvas.height / 2;
let watermarkDX = 1;
let watermarkDY = 1;
let watermarkColor = [128, 128, 128]; // Initial RGB
let colorChangeSpeed = [1, 2, 3]; // Speed of color change for R, G, B

// Draw snake
function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, 20, 20);
  });
}

// Move snake
function moveSnake() {
  const head = {
    x: snake[0].x + snakeDirection.x,
    y: snake[0].y + snakeDirection.y,
  };
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    placeFood();
  } else {
    snake.pop();
  }
}

// Draw food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

// Place food
function placeFood() {
  food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
  food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}

// Check for collision
function checkCollision() {
  const head = snake[0];
  // Wall collision
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    endGame();
  }
  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// End game
function endGame() {
  alert(`Game Over! Your score: ${score}`);
  clearInterval(gameInterval);
  gameStarted = false;
  startButton.style.display = "block"; // Show the Start button
  snake = [{ x: 200, y: 200 }];
  snakeDirection = { x: 20, y: 0 };
  score = 0;
  placeFood();
}

// Draw score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Update watermark color
function updateWatermarkColor() {
  for (let i = 0; i < 3; i++) {
    watermarkColor[i] += colorChangeSpeed[i];
    if (watermarkColor[i] > 255 || watermarkColor[i] < 50) {
      colorChangeSpeed[i] *= -1; // Reverse color direction
    }
  }
}

// Draw watermark
function drawWatermark() {
  updateWatermarkColor();
  const color = `rgb(${watermarkColor[0]}, ${watermarkColor[1]}, ${watermarkColor[2]})`;
  ctx.fillStyle = color;
  ctx.font = "30px Arial";
  ctx.globalAlpha = 0.1; // Set transparency for watermark
  ctx.fillText("Ashraf Ben Lashher", watermarkX, watermarkY);
  ctx.globalAlpha = 1; // Reset transparency

  // Move watermark
  watermarkX += watermarkDX;
  watermarkY += watermarkDY;

  // Bounce off edges
  if (watermarkX <= 0 || watermarkX >= canvas.width) {
    watermarkDX *= -1;
  }
  if (watermarkY <= 30 || watermarkY >= canvas.height) { // 30 accounts for font height
    watermarkDY *= -1;
  }
}

// Draw game
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWatermark();
  drawSnake();
  drawFood();
  drawScore();
}

// Update game
function updateGame() {
  moveSnake();
  checkCollision();
  drawGame();
}

// Change direction
function changeDirection(event) {
  const keyPressed = event.key;
  const goingUp = snakeDirection.y === -20;
  const goingDown = snakeDirection.y === 20;
  const goingRight = snakeDirection.x === 20;
  const goingLeft = snakeDirection.x === -20;

  if (keyPressed === "ArrowUp" && !goingDown) {
    snakeDirection = { x: 0, y: -20 };
  } else if (keyPressed === "ArrowDown" && !goingUp) {
    snakeDirection = { x: 0, y: 20 };
  } else if (keyPressed === "ArrowRight" && !goingLeft) {
    snakeDirection = { x: 20, y: 0 };
  } else if (keyPressed === "ArrowLeft" && !goingRight) {
    snakeDirection = { x: -20, y: 0 };
  }
}

// Start game on button click
startButton.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    startButton.style.display = "none"; // Hide the Start button
    placeFood();
    gameInterval = setInterval(updateGame, 150); // Start the game loop
  }
});

// Event listener for key press
document.addEventListener("keydown", changeDirection);
