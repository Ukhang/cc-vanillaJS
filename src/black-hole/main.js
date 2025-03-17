        class PhysicsObject {
  constructor(x, y, mass = 1) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.mass = mass;
  }

  update(deltaTime) {
    // v = v + a*t
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;

    // p = p + v*t
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }
}

/**
 * Class for the central black hole
 */
class BlackHole extends PhysicsObject {
  constructor(x, y, mass) {
    super(x, y, mass);
    this.eventHorizonRadius = Math.sqrt(mass) / 10;
    this.influenceRadius = this.eventHorizonRadius * 20;
  }

  draw(ctx) {
    // Event horizon (black circle)
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.eventHorizonRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "black";
    ctx.fill();

    // Influence radius visualization (subtle glow)
    const gradient = ctx.createRadialGradient(
      this.position.x,
      this.position.y,
      this.eventHorizonRadius,
      this.position.x,
      this.position.y,
      this.influenceRadius
    );
    gradient.addColorStop(0, "rgba(0, 100, 255, 0.3)");
    gradient.addColorStop(1, "rgba(0, 100, 255, 0)");

    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.influenceRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  updateMass(newMass) {
    this.mass = newMass;
    this.eventHorizonRadius = Math.sqrt(newMass) / 10;
    this.influenceRadius = this.eventHorizonRadius * 20;
  }
}

/**
 * Class for particles that will orbit/fall into the black hole
 */
class Particle extends PhysicsObject {
  constructor(x, y, mass, color) {
    super(x, y, mass);
    this.radius = Math.sqrt(mass) * 0.8;
    this.color = color;
    this.alive = true;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  applyGravity(blackHole, G = 0.1) {
    // Calculate distance
    const dx = blackHole.position.x - this.position.x;
    const dy = blackHole.position.y - this.position.y;
    const distanceSquared = dx * dx + dy * dy;
    const distance = Math.sqrt(distanceSquared);

    // Check if particle is inside event horizon
    if (distance < blackHole.eventHorizonRadius) {
      this.alive = false;
      return;
    }

    // Calculate gravitational force
    const force = (G * (this.mass * blackHole.mass)) / distanceSquared;

    // Calculate acceleration components (F = ma, so a = F/m)
    const accelerationMagnitude = force / this.mass;

    // Update acceleration vector
    this.acceleration.x = (dx / distance) * accelerationMagnitude;
    this.acceleration.y = (dy / distance) * accelerationMagnitude;
  }
}

/**
 * Main class that manages the simulation
 */
class BlackHoleSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.blackHole = new BlackHole(this.centerX, this.centerY, 5000);
    this.particles = [];
    this.particleCount = 200;
    this.accretionDiskDensity = 0.5;

    this.lastTime = 0;
    this.timeStep = 1 / 60; // Target 60fps

    this.setupControls();
    this.initializeParticles();
    this.animate = this.animate.bind(this);

    // Start the animation
    this.animate(0);
  }

  setupControls() {
    const massSlider = document.getElementById("massSlider");
    const particleCountSlider = document.getElementById("particleCountSlider");
    const accretionDiskSlider = document.getElementById("accretionDiskSlider");
    const resetButton = document.getElementById("resetButton");

    massSlider.addEventListener("input", (e) => {
      const massValue = parseFloat(e.target.value);
      document.getElementById("massValue").textContent = massValue;
      this.blackHole.updateMass(massValue);
    });

    particleCountSlider.addEventListener("input", (e) => {
      this.particleCount = parseInt(e.target.value);
      document.getElementById("particleCountValue").textContent =
        this.particleCount;
    });

    accretionDiskSlider.addEventListener("input", (e) => {
      this.accretionDiskDensity = parseFloat(e.target.value);
      document.getElementById("accretionDiskValue").textContent =
        this.accretionDiskDensity;
    });

    resetButton.addEventListener("click", () => {
      this.initializeParticles();
    });

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.blackHole.position = { x: this.centerX, y: this.centerY };
    });
  }

  initializeParticles() {
    this.particles = [];

    const generateColor = () => {
      const hue = Math.random() * 60 + 180; // Blue to turquoise range
      const saturation = 80 + Math.random() * 20; // High saturation
      const lightness = 50 + Math.random() * 30; // Medium to high lightness
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    for (let i = 0; i < this.particleCount; i++) {
      // Position particles in a disk-like formation around the black hole
      const distance =
        this.blackHole.influenceRadius * (0.3 + 0.7 * Math.random());
      const angle = Math.random() * Math.PI * 2;

      // Add some height variation based on accretion disk density
      const heightVariation = (1 - this.accretionDiskDensity) * 100;
      const heightOffset =
        Math.random() * heightVariation - heightVariation / 2;

      const x = this.centerX + distance * Math.cos(angle);
      const y = this.centerY + distance * Math.sin(angle) + heightOffset;

      // Give particles initial orbital velocity
      const particle = new Particle(
        x,
        y,
        0.1 + Math.random() * 0.5,
        generateColor()
      );

      // Calculate orbital velocity for stable-ish orbit
      // v = sqrt(G*M/r) perpendicular to radius
      const orbitSpeed =
        Math.sqrt((0.1 * this.blackHole.mass) / distance) * 0.3;

      // Velocity perpendicular to radius vector (for orbital motion)
      particle.velocity.x = orbitSpeed * Math.sin(angle);
      particle.velocity.y = -orbitSpeed * Math.cos(angle);

      // Add some random variation
      particle.velocity.x += (Math.random() - 0.5) * orbitSpeed * 0.2;
      particle.velocity.y += (Math.random() - 0.5) * orbitSpeed * 0.2;

      this.particles.push(particle);
    }
  }

  update(deltaTime) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      // Apply gravitational force from black hole
      particle.applyGravity(this.blackHole);

      // Update particle position
      particle.update(deltaTime);

      // Remove particles that are "consumed" by the black hole
      // or that have moved too far away
      if (
        !particle.alive ||
        particle.position.x < -100 ||
        particle.position.x > this.width + 100 ||
        particle.position.y < -100 ||
        particle.position.y > this.height + 100
      ) {
        this.particles.splice(i, 1);
      }
    }

    // Spawn new particles if needed
    while (this.particles.length < this.particleCount) {
      const distance = this.blackHole.influenceRadius * 0.9;
      const angle = Math.random() * Math.PI * 2;

      const heightVariation = (1 - this.accretionDiskDensity) * 100;
      const heightOffset =
        Math.random() * heightVariation - heightVariation / 2;

      const x = this.centerX + distance * Math.cos(angle);
      const y = this.centerY + distance * Math.sin(angle) + heightOffset;

      const color = `hsl(${Math.random() * 60 + 180}, ${
        80 + Math.random() * 20
      }%, ${50 + Math.random() * 30}%)`;
      const particle = new Particle(x, y, 0.1 + Math.random() * 0.5, color);

      // Calculate orbital velocity
      const orbitSpeed =
        Math.sqrt((0.1 * this.blackHole.mass) / distance) * 0.3;

      // Velocity perpendicular to radius vector
      particle.velocity.x = orbitSpeed * Math.sin(angle);
      particle.velocity.y = -orbitSpeed * Math.cos(angle);

      // Add some random variation
      particle.velocity.x += (Math.random() - 0.5) * orbitSpeed * 0.2;
      particle.velocity.y += (Math.random() - 0.5) * orbitSpeed * 0.2;

      this.particles.push(particle);
    }
  }

  draw() {
    // Clear canvas with a fade effect
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw black hole
    this.blackHole.draw(this.ctx);

    // Draw all particles
    this.particles.forEach((particle) => {
      particle.draw(this.ctx);
    });
  }

  animate(timestamp) {
    // Calculate deltaTime
    const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1); // Cap at 0.1s
    this.lastTime = timestamp;

    // Update and draw
    this.update(deltaTime);
    this.draw();

    // Request next frame
    requestAnimationFrame(this.animate);
  }
}

// Start the simulation
window.addEventListener("DOMContentLoaded", () => {
  new BlackHoleSimulation("simulationCanvas");
});
