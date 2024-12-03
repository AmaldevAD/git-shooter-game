const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restart-btn");
const scoreElement = document.getElementById("score");
const missedElement = document.getElementById("missed");

canvas.width = 400;
canvas.height = 600;

// Player variables
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  width: 40,
  height: 40,
  color: "white",
  speed: 5,
};

// Bullets
const bullets = [];
const bulletSpeed = 7;

// Enemies
const enemies = [];
const enemySpeed = 2;
const enemySize = 30;

// Game controls
let keys = {};
let score = 0;
let missedBlocks = 0;
let gameOver = false;

// Event listeners for controls
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Restart game
restartButton.addEventListener("click", () => {
  score = 0;
  missedBlocks = 0;
  enemies.length = 0;
  bullets.length = 0;
  gameOver = false;
  restartButton.style.display = "none"; // Hide the button
  player.x = canvas.width / 2 - 20;
  clearCanvas(); // Clear the canvas before restarting
  update();
});

// Spawn enemies
setInterval(() => {
  if (!gameOver) {
    const x = Math.random() * (canvas.width - enemySize);
    enemies.push({ x, y: -enemySize, width: enemySize, height: enemySize, color: "green" });
  }
}, 1000);

// Draw objects
function drawRect({ x, y, width, height, color }) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function update() {
  if (gameOver) {
    clearCanvas();
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    // Show restart button
    restartButton.style.display = "block";
    return;
  }

  clearCanvas();

  // Move player
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

  // Fire bullets
  if (keys[" "] && bullets.length < 5) {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, color: "red" });
    keys[" "] = false; // Prevent holding space for continuous fire
  }

  // Update bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bulletSpeed;
    if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
  });

  // Update enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.y += enemySpeed;

    // Remove off-screen enemies and count missed blocks
    if (enemy.y > canvas.height) {
      enemies.splice(enemyIndex, 1);
      missedBlocks++;
      if (missedBlocks >= 5) {
        gameOver = true;
      }
    }

    // Check collisions with bullets
    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Collision detected
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score++;
      }
    });
  });

  // Draw everything
  drawRect(player);
  bullets.forEach(drawRect);
  enemies.forEach(drawRect);

  // Update score and missed blocks in the HTML
  scoreElement.textContent = `Score: ${score}`;
  missedElement.textContent = `Missed: ${missedBlocks}/5`;

  requestAnimationFrame(update);
}

update();
