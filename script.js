// Game variables
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const bullets = [];
const targets = [];
const shootSound = document.getElementById('shootSound');
const hitSound = document.getElementById('hitSound');
let playerX = window.innerWidth / 2; // Start player in the middle
let score = 0;
let timeLeft = 60; // 60-second timer
let gameInterval;
let targetInterval;

// Update player position
function updatePlayerPosition() {
  player.style.left = `${playerX}px`;
}

// Move player left and right
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft': // Move left
      playerX -= 10;
      break;
    case 'ArrowRight': // Move right
      playerX += 10;
      break;
    case ' ': // Shoot bullet
      shootBullet();
      break;
  }
  updatePlayerPosition();
});

// Shoot bullet
function shootBullet() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerX + 25}px`; // Center bullet on player
  bullet.style.bottom = '80px'; // Start bullet above player
  document.querySelector('.game-container').appendChild(bullet);
  bullets.push(bullet);
  shootSound.play();
}

// Move bullets and check for collisions
function updateBullets() {
  bullets.forEach((bullet, bulletIndex) => {
    const bulletY = parseFloat(bullet.style.bottom);
    bullet.style.bottom = `${bulletY + 10}px`; // Move bullet upward

    // Check collision with targets
    targets.forEach((target, targetIndex) => {
      const bulletRect = bullet.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      if (
        bulletRect.left < targetRect.right &&
        bulletRect.right > targetRect.left &&
        bulletRect.top < targetRect.bottom &&
        bulletRect.bottom > targetRect.top
      ) {
        // Hit target
        hitSound.play();
        bullet.remove();
        bullets.splice(bulletIndex, 1);
        target.remove();
        targets.splice(targetIndex, 1);
        score += 10; // Increase score
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });

    // Remove bullet if it goes off-screen
    if (bulletY > window.innerHeight) {
      bullet.remove();
      bullets.splice(bulletIndex, 1);
    }
  });
}

// Create a new target
function createTarget() {
  const target = document.createElement('div');
  target.classList.add('target');
  target.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Random X position
  target.style.top = `${Math.random() * 100}px`; // Random Y position
  document.querySelector('.game-container').appendChild(target);
  targets.push(target);

  // Move target horizontally
  let direction = Math.random() > 0.5 ? 1 : -1; // Random direction
  const moveTarget = () => {
    const targetX = parseFloat(target.style.left);
    if (targetX < 0 || targetX > window.innerWidth - 50) {
      direction *= -1; // Reverse direction at edges
    }
    target.style.left = `${targetX + direction * 2}px`; // Move target
    requestAnimationFrame(moveTarget);
  };
  moveTarget();
}

// Update timer
function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) {
    endGame();
  }
}

// End the game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(targetInterval);
  alert(`Game Over! Your score is ${score}`);
  location.reload(); // Restart the game
}

// Game loop
function gameLoop() {
  updateBullets();
  requestAnimationFrame(gameLoop);
}

// Initialize game
function startGame() {
  updatePlayerPosition();
  gameLoop();
  gameInterval = setInterval(updateTimer, 1000); // Update timer every second
  targetInterval = setInterval(createTarget, 2000); // Create a new target every 2 seconds
}

startGame();