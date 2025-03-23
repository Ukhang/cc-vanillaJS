// Game class - main controller
class Game {
  constructor() {
    this.score = 0;
    this.gameOver = false;
    this.penguin = new Penguin();
    this.windowsLogos = [];
    this.lastLogoTime = 0;
    this.spawnInterval = 2000; // milliseconds
    this.spawnIntervalReduction = 50;
    this.minSpawnInterval = 500;
    this.scoreDisplay = document.getElementById("score-display");
    this.gameOverScreen = document.getElementById("game-over");
    this.finalScoreDisplay = document.getElementById("final-score");
    this.restartButton = document.getElementById("restart-button");

    this.setupEventListeners();
    this.gameLoop();
  }

  setupEventListeners() {
    this.restartButton.addEventListener("click", () => this.restartGame());

    // Mouse/touch events
    document.addEventListener("mousemove", (e) => {
      if (!this.gameOver) this.penguin.move(e.clientX, e.clientY);
    });

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!this.gameOver && e.touches.length > 0) {
          e.preventDefault();
          this.penguin.move(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: false }
    );
  }

  gameLoop() {
    if (this.gameOver) return;

    const now = Date.now();

    // Spawn new logos
    if (now - this.lastLogoTime > this.spawnInterval) {
      this.spawnWindowsLogo();
      this.lastLogoTime = now;
    }

    // Update logos
    for (let i = this.windowsLogos.length - 1; i >= 0; i--) {
      const logo = this.windowsLogos[i];
      logo.update();

      // Check collisions
      if (this.penguin.checkCollision(logo)) {
        this.score++;
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        this.penguin.eat();
        logo.remove();
        this.windowsLogos.splice(i, 1);

        // Increase difficulty
        if (this.spawnInterval > this.minSpawnInterval) {
          this.spawnInterval -= this.spawnIntervalReduction;
        }
      }

      // Remove logos that go off-screen
      if (logo.y > window.innerHeight) {
        logo.remove();
        this.windowsLogos.splice(i, 1);
        this.endGame();
      }
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  spawnWindowsLogo() {
    const logo = new WindowsLogo();
    this.windowsLogos.push(logo);
  }

  endGame() {
    this.gameOver = true;
    this.finalScoreDisplay.textContent = this.score;
    this.gameOverScreen.style.display = "block";
  }

  restartGame() {
    // Clean up
    for (const logo of this.windowsLogos) {
      logo.remove();
    }

    // Reset game state
    this.score = 0;
    this.gameOver = false;
    this.windowsLogos = [];
    this.lastLogoTime = 0;
    this.spawnInterval = 2000;
    this.scoreDisplay.textContent = "Score: 0";
    this.gameOverScreen.style.display = "none";

    // Restart game loop
    this.gameLoop();
  }
}

// Penguin class - player character
class Penguin {
  constructor() {
    this.element = document.getElementById("penguin");
    this.width = 100;
    this.height = 100;
    this.x = window.innerWidth / 2 - this.width / 2;
    this.y = window.innerHeight - this.height - 20;
    this.updatePosition();
  }

  move(x, y) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;

    // Keep penguin within bounds
    this.x = Math.max(0, Math.min(window.innerWidth - this.width, this.x));
    this.y = Math.max(0, Math.min(window.innerHeight - this.height, this.y));

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  checkCollision(logo) {
    return (
      this.x < logo.x + logo.width &&
      this.x + this.width > logo.x &&
      this.y < logo.y + logo.height &&
      this.y + this.height > logo.y
    );
  }

  eat() {
    this.element.classList.remove("eat");
    // Trigger reflow
    void this.element.offsetWidth;
    this.element.classList.add("eat");
  }
}

// WindowsLogo class - game objects
class WindowsLogo {
  constructor() {
    this.element = document.createElement("div");
    this.element.className = "windows-logo";
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (window.innerWidth - this.width);
    this.y = -this.height;
    this.speed = 2 + Math.random() * 3;
    this.updatePosition();
    document.getElementById("game-container").appendChild(this.element);
  }

  update() {
    this.y += this.speed;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  remove() {
    this.element.remove();
  }
}

// Start the game when page loads
window.addEventListener("load", () => {
  new Game();
});
