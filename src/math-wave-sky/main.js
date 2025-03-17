// Canvas setup
const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Parameters with default values
let params = {
  amplitude: 30,
  frequency: 3,
  speed: 2,
  layers: 4,
  complexity: 2,
  theme: "night",
};

// Animation variables
let time = 0;
let isPlaying = true;
let stars = [];

// Theme colors
const themes = {
  night: {
    background: createGradient("#041a3b", "#2c5fa3"),
    wave: [
      "rgba(30, 144, 255, 0.5)",
      "rgba(65, 105, 225, 0.4)",
      "rgba(100, 149, 237, 0.3)",
    ],
    particles: "#ffffff",
  },
  sunset: {
    background: createGradient("#ff7e5f", "#feb47b"),
    wave: [
      "rgba(255, 69, 0, 0.6)",
      "rgba(255, 99, 71, 0.5)",
      "rgba(255, 160, 122, 0.4)",
    ],
    particles: "#ffe6b3",
  },
  day: {
    background: createGradient("#2bc0e4", "#eaecc6"),
    wave: [
      "rgba(0, 153, 204, 0.5)",
      "rgba(102, 204, 255, 0.4)",
      "rgba(153, 214, 255, 0.3)",
    ],
    particles: "#ffffff",
  },
  aurora: {
    background: createGradient("#8360c3", "#2ebf91"),
    wave: [
      "rgba(142, 68, 173, 0.5)",
      "rgba(155, 89, 182, 0.4)",
      "rgba(52, 152, 219, 0.3)",
    ],
    particles: "#b3ffff",
  },
  grayscale: {
    background: createGradient("#000000", "#434343"),
    wave: [
      "rgba(169, 169, 169, 0.6)",
      "rgba(128, 128, 128, 0.5)",
      "rgba(105, 105, 105, 0.4)",
    ],
    particles: "#ffffff",
  },
};

// Function to create gradient
function createGradient(color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

// Generate stars
function generateStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: (Math.random() * canvas.height) / 2,
      size: Math.random() * 2 + 0.5,
      blinkSpeed: Math.random() * 0.05,
    });
  }
}

// Generate initial stars
generateStars(params.theme === "night" ? 200 : 0);

// Function to draw stars
function drawStars() {
  if (params.theme !== "night" && params.theme !== "grayscale") return;

  ctx.fillStyle = themes[params.theme].particles;
  stars.forEach((star) => {
    const blinkFactor = Math.sin(time * star.blinkSpeed) * 0.5 + 0.5;
    ctx.globalAlpha = blinkFactor * 0.8;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// Function to draw wave
function drawWave(layerIndex) {
  const amplitude = params.amplitude * (1 - layerIndex * 0.15);
  const frequency = params.frequency * (1 + layerIndex * 0.1);
  const layerOffset = layerIndex * 20;
  const color =
    themes[params.theme].wave[layerIndex % themes[params.theme].wave.length];

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);

  for (let x = 0; x <= canvas.width; x += 5) {
    let y = canvas.height / 2 + canvas.height / 2 - layerOffset;

    // Base wave
    y +=
      amplitude * Math.sin((x * frequency) / 1000 + (time * params.speed) / 10);

    // Add complexity with additional sine waves
    for (let c = 1; c <= params.complexity; c++) {
      y +=
        (amplitude / (c + 1)) *
        Math.sin((x * frequency * c) / 500 + (time * params.speed * c) / 20);
    }

    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

// Main animation function
function animate() {
  // Clear canvas
  ctx.fillStyle = themes[params.theme].background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars if night theme
  drawStars();

  // Draw waves from back to front
  for (let i = params.layers - 1; i >= 0; i--) {
    drawWave(i);
  }

  // Update time if animation is playing
  if (isPlaying) {
    time += 0.03;
  }

  // Continue animation loop
  requestAnimationFrame(animate);
}

// Update formula text
function updateFormulaText() {
  const formula = document.getElementById("currentFormula");

  let formulaText = `y = A * sin(${params.frequency}x + ${params.speed}t)`;

  if (params.complexity > 1) {
    formulaText += ` + A/2 * sin(${params.frequency * 2}x + ${
      params.speed * 1.5
    }t)`;
  }

  if (params.complexity > 2) {
    formulaText += ` + A/3 * sin(${params.frequency * 3}x + ${
      params.speed * 2
    }t)`;
  }

  formula.textContent = formulaText;
}

// Event listeners for controls
document.getElementById("amplitude").addEventListener("input", function () {
  params.amplitude = parseInt(this.value);
});

document.getElementById("frequency").addEventListener("input", function () {
  params.frequency = parseInt(this.value);
  updateFormulaText();
});

document.getElementById("speed").addEventListener("input", function () {
  params.speed = parseInt(this.value);
  updateFormulaText();
});

document.getElementById("layers").addEventListener("input", function () {
  params.layers = parseInt(this.value);
});

document.getElementById("complexity").addEventListener("input", function () {
  params.complexity = parseInt(this.value);
  updateFormulaText();
});

// Theme button listeners
document.querySelectorAll(".theme-button").forEach((button) => {
  button.addEventListener("click", function () {
    document
      .querySelectorAll(".theme-button")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    params.theme = this.getAttribute("data-theme");

    // Update background gradient
    themes[params.theme].background = createGradient(
      window
        .getComputedStyle(this)
        .backgroundImage.match(/rgb\([^)]+\)|#[0-9a-f]{3,6}/gi)[0],
      window
        .getComputedStyle(this)
        .backgroundImage.match(/rgb\([^)]+\)|#[0-9a-f]{3,6}/gi)[1],
    );

    // Generate stars if night theme
    if (params.theme === "night" || params.theme === "grayscale") {
      generateStars(200);
    }
  });
});

// Randomize button
document.getElementById("randomize").addEventListener("click", function () {
  params.amplitude = Math.floor(Math.random() * 95) + 5;
  params.frequency = Math.floor(Math.random() * 19) + 1;
  params.speed = Math.floor(Math.random() * 9) + 1;
  params.layers = Math.floor(Math.random() * 7) + 2;
  params.complexity = Math.floor(Math.random() * 4) + 1;

  document.getElementById("amplitude").value = params.amplitude;
  document.getElementById("frequency").value = params.frequency;
  document.getElementById("speed").value = params.speed;
  document.getElementById("layers").value = params.layers;
  document.getElementById("complexity").value = params.complexity;

  updateFormulaText();
});

// Pause/Play button
document.getElementById("pausePlay").addEventListener("click", function () {
  isPlaying = !isPlaying;
  this.textContent = isPlaying ? "Pause" : "Play";
});

// Handle window resize
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Update gradients after resize
  Object.keys(themes).forEach((theme) => {
    const colors = window
      .getComputedStyle(document.querySelector(`[data-theme="${theme}"]`))
      .backgroundImage.match(/rgb\([^)]+\)|#[0-9a-f]{3,6}/gi);

    if (colors && colors.length >= 2) {
      themes[theme].background = createGradient(colors[0], colors[1]);
    }
  });
});

// Update formula text initially
updateFormulaText();

// Start animation
animate();
