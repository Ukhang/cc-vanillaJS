document.addEventListener("DOMContentLoaded", function () {
  // Canvas setup
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const cellSize = 10;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);

  // Game state
  let grid = createEmptyGrid();
  let generation = 0;
  let isRunning = false;
  let animationId = null;
  let speed = parseInt(document.getElementById("speed-selector").value);
  let lastUpdateTime = 0;

  // UI elements
  const startBtn = document.getElementById("start-btn");
  const stopBtn = document.getElementById("stop-btn");
  const stepBtn = document.getElementById("step-btn");
  const clearBtn = document.getElementById("clear-btn");
  const randomBtn = document.getElementById("random-btn");
  const gliderBtn = document.getElementById("glider-btn");
  const blinkerBtn = document.getElementById("blinker-btn");
  const pulsarBtn = document.getElementById("pulsar-btn");
  const gosperBtn = document.getElementById("gosper-btn");
  const speedSelector = document.getElementById("speed-selector");
  const generationElement = document.getElementById("generation");
  const populationElement = document.getElementById("population");

  // Initialize grid
  function createEmptyGrid() {
    const arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows).fill(0);
    }
    return arr;
  }

  // Draw grid
  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) {
          ctx.fillStyle = "#4CAF50";
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }

        // Draw cell border
        ctx.strokeStyle = "#f0f0f0";
        ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }

    // Update stats
    let population = countPopulation();
    generationElement.textContent = `Generation: ${generation}`;
    populationElement.textContent = `Population: ${population}`;
  }

  function countPopulation() {
    let count = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        count += grid[i][j];
      }
    }
    return count;
  }

  // Count neighbors of a cell
  function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        // Skip the cell itself
        if (i === 0 && j === 0) continue;

        // Handle edge wrapping
        const col = (x + i + cols) % cols;
        const row = (y + j + rows) % rows;

        sum += grid[col][row];
      }
    }
    return sum;
  }

  // Compute next generation
  function nextGeneration() {
    const next = createEmptyGrid();

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const state = grid[i][j];
        const neighbors = countNeighbors(grid, i, j);

        // Apply Game of Life rules
        if (state === 0 && neighbors === 3) {
          next[i][j] = 1; // Reproduction
        } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0; // Death by under/overpopulation
        } else {
          next[i][j] = state; // Stay the same
        }
      }
    }

    grid = next;
    generation++;
    drawGrid();
  }

  // Animation loop
  function animate(timestamp) {
    if (!isRunning) return;

    if (timestamp - lastUpdateTime >= speed) {
      nextGeneration();
      lastUpdateTime = timestamp;
    }

    animationId = requestAnimationFrame(animate);
  }

  // Handle canvas clicks
  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const i = Math.floor(x / cellSize);
    const j = Math.floor(y / cellSize);

    if (i >= 0 && i < cols && j >= 0 && j < rows) {
      grid[i][j] = grid[i][j] ? 0 : 1; // Toggle cell state
      drawGrid();
    }
  });

  // Button handlers
  startBtn.addEventListener("click", function () {
    if (!isRunning) {
      isRunning = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      stepBtn.disabled = true;
      lastUpdateTime = performance.now();
      animationId = requestAnimationFrame(animate);
    }
  });

  stopBtn.addEventListener("click", function () {
    if (isRunning) {
      isRunning = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      stepBtn.disabled = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    }
  });

  stepBtn.addEventListener("click", function () {
    if (!isRunning) {
      nextGeneration();
    }
  });

  clearBtn.addEventListener("click", function () {
    grid = createEmptyGrid();
    generation = 0;
    drawGrid();
  });

  randomBtn.addEventListener("click", function () {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.random() > 0.7 ? 1 : 0;
      }
    }
    generation = 0;
    drawGrid();
  });

  speedSelector.addEventListener("change", function () {
    speed = parseInt(this.value);
  });

  // Pattern buttons
  gliderBtn.addEventListener("click", function () {
    grid = createEmptyGrid();

    // Glider pattern
    const centerX = Math.floor(cols / 4);
    const centerY = Math.floor(rows / 4);

    grid[centerX + 1][centerY] = 1;
    grid[centerX + 2][centerY + 1] = 1;
    grid[centerX][centerY + 2] = 1;
    grid[centerX + 1][centerY + 2] = 1;
    grid[centerX + 2][centerY + 2] = 1;

    generation = 0;
    drawGrid();
  });

  blinkerBtn.addEventListener("click", function () {
    grid = createEmptyGrid();

    // Blinker pattern
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    grid[centerX - 1][centerY] = 1;
    grid[centerX][centerY] = 1;
    grid[centerX + 1][centerY] = 1;

    generation = 0;
    drawGrid();
  });

  pulsarBtn.addEventListener("click", function () {
    grid = createEmptyGrid();

    // Pulsar pattern
    const centerX = Math.floor(cols / 2) - 6;
    const centerY = Math.floor(rows / 2) - 6;

    // Define offsets for the pulsar pattern
    const points = [
      // Top rows
      [2, 0],
      [3, 0],
      [4, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      // Top block left
      [0, 2],
      [5, 2],
      [0, 3],
      [5, 3],
      [0, 4],
      [5, 4],
      // Top block right
      [7, 2],
      [12, 2],
      [7, 3],
      [12, 3],
      [7, 4],
      [12, 4],
      // Middle top
      [2, 5],
      [3, 5],
      [4, 5],
      [8, 5],
      [9, 5],
      [10, 5],
      // Middle bottom
      [2, 7],
      [3, 7],
      [4, 7],
      [8, 7],
      [9, 7],
      [10, 7],
      // Bottom block left
      [0, 8],
      [5, 8],
      [0, 9],
      [5, 9],
      [0, 10],
      [5, 10],
      // Bottom block right
      [7, 8],
      [12, 8],
      [7, 9],
      [12, 9],
      [7, 10],
      [12, 10],
      // Bottom rows
      [2, 12],
      [3, 12],
      [4, 12],
      [8, 12],
      [9, 12],
      [10, 12],
    ];

    // Place the pulsar pattern
    for (const [x, y] of points) {
      if (centerX + x < cols && centerY + y < rows) {
        grid[centerX + x][centerY + y] = 1;
      }
    }

    generation = 0;
    drawGrid();
  });

  gosperBtn.addEventListener("click", function () {
    grid = createEmptyGrid();

    // Gosper Glider Gun
    const startX = 10;
    const startY = Math.floor(rows / 2) - 5;

    // Left block
    grid[startX][startY + 4] = 1;
    grid[startX][startY + 5] = 1;
    grid[startX + 1][startY + 4] = 1;
    grid[startX + 1][startY + 5] = 1;

    // Right block
    grid[startX + 34][startY + 2] = 1;
    grid[startX + 34][startY + 3] = 1;
    grid[startX + 35][startY + 2] = 1;
    grid[startX + 35][startY + 3] = 1;

    // Left part
    grid[startX + 10][startY + 4] = 1;
    grid[startX + 10][startY + 5] = 1;
    grid[startX + 10][startY + 6] = 1;
    grid[startX + 11][startY + 3] = 1;
    grid[startX + 11][startY + 7] = 1;
    grid[startX + 12][startY + 2] = 1;
    grid[startX + 12][startY + 8] = 1;
    grid[startX + 13][startY + 2] = 1;
    grid[startX + 13][startY + 8] = 1;
    grid[startX + 14][startY + 5] = 1;
    grid[startX + 15][startY + 3] = 1;
    grid[startX + 15][startY + 7] = 1;
    grid[startX + 16][startY + 4] = 1;
    grid[startX + 16][startY + 5] = 1;
    grid[startX + 16][startY + 6] = 1;
    grid[startX + 17][startY + 5] = 1;

    // Right part
    grid[startX + 20][startY + 2] = 1;
    grid[startX + 20][startY + 3] = 1;
    grid[startX + 20][startY + 4] = 1;
    grid[startX + 21][startY + 2] = 1;
    grid[startX + 21][startY + 3] = 1;
    grid[startX + 21][startY + 4] = 1;
    grid[startX + 22][startY + 1] = 1;
    grid[startX + 22][startY + 5] = 1;
    grid[startX + 24][startY] = 1;
    grid[startX + 24][startY + 1] = 1;
    grid[startX + 24][startY + 5] = 1;
    grid[startX + 24][startY + 6] = 1;

    generation = 0;
    drawGrid();
  });

  // Initial draw
  drawGrid();
});
