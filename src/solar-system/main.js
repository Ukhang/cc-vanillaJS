// Base class for all celestial bodies
class CelestialBody {
  constructor(name, radius, color, description) {
    this.name = name;
    this.radius = radius;
    this.color = color;
    this.description = description;
    this.element = null;
  }

  // Create DOM element
  createElement() {
    this.element = document.createElement("div");
    this.element.dataset.name = this.name;
    this.element.dataset.description = this.description;
    this.element.style.width = `${this.radius * 2}px`;
    this.element.style.height = `${this.radius * 2}px`;
    this.element.style.backgroundColor = this.color;
    this.element.style.borderRadius = "50%";
    this.element.style.position = "absolute";

    // Add click event to show info
    this.element.addEventListener("click", () => {
      const infoName = document.getElementById("info-name");
      const infoDescription = document.getElementById("info-description");
      infoName.textContent = this.name;
      infoDescription.textContent = this.description;
    });

    return this.element;
  }

  // Abstract method to be implemented by subclasses
  update() {
    throw new Error("Method update() must be implemented");
  }
}

// Sun class - special celestial body at center
class Sun extends CelestialBody {
  constructor() {
    super(
      "Sun",
      30,
      "#FFD700",
      "The Sun is the star at the center of our Solar System. It's a nearly perfect sphere of hot plasma, with a diameter of about 1.39 million kilometers.",
    );
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.className = "sun";

    // Add click event to show info
    this.element.addEventListener("click", () => {
      const infoName = document.getElementById("info-name");
      const infoDescription = document.getElementById("info-description");
      infoName.textContent = this.name;
      infoDescription.textContent = this.description;
    });

    return this.element;
  }

  update() {
    // Sun doesn't move
  }
}

// Planet class - orbits around the sun
class Planet extends CelestialBody {
  constructor(name, radius, distance, orbitSpeed, color, description) {
    super(name, radius, color, description);
    this.distance = distance;
    this.orbitSpeed = orbitSpeed;
    this.angle = Math.random() * Math.PI * 2; // Random start position
    this.orbitElement = null;
  }

  createOrbit(container) {
    this.orbitElement = document.createElement("div");
    this.orbitElement.className = "orbit";
    this.orbitElement.style.width = `${this.distance * 2}px`;
    this.orbitElement.style.height = `${this.distance * 2}px`;
    this.orbitElement.style.left = `calc(50% - ${this.distance}px)`;
    this.orbitElement.style.top = `calc(50% - ${this.distance}px)`;
    container.appendChild(this.orbitElement);
  }

  createElement() {
    super.createElement();
    this.element.className = "planet";
    this.element.style.transformOrigin = "50% 50%";
    this.element.style.left = `calc(50% - ${this.radius}px)`;
    this.element.style.top = `calc(50% - ${this.distance + this.radius}px)`;
    return this.element;
  }

  update(speedMultiplier = 1, paused = false) {
    if (!paused) {
      this.angle += this.orbitSpeed * 0.01 * speedMultiplier;
      const x = Math.cos(this.angle) * this.distance;
      const y = Math.sin(this.angle) * this.distance;
      this.element.style.transform = `translate(${x}px, ${y}px)`;
    }
  }
}

// Special planet with rings (Saturn)
class RingedPlanet extends Planet {
  constructor(
    name,
    radius,
    distance,
    orbitSpeed,
    color,
    description,
    ringColor,
  ) {
    super(name, radius, distance, orbitSpeed, color, description);
    this.ringColor = ringColor || "rgba(255, 255, 255, 0.1)";
  }

  createElement() {
    const element = super.createElement();
    element.style.boxShadow = `0 0 0 5px ${this.ringColor}, 0 0 0 10px ${this.ringColor}`;
    return element;
  }
}

// Solar System class to manage all celestial bodies
class SolarSystem {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.bodies = [];
    this.paused = false;
    this.speedMultiplier = 1;
    this.setupControls();
  }

  setupControls() {
    this.pauseBtn = document.getElementById("pause-btn");
    this.speedUpBtn = document.getElementById("speed-up");
    this.slowDownBtn = document.getElementById("slow-down");

    this.pauseBtn.addEventListener("click", () => {
      this.paused = !this.paused;
      this.pauseBtn.textContent = this.paused ? "Resume" : "Pause";
    });

    this.speedUpBtn.addEventListener("click", () => {
      this.speedMultiplier *= 1.5;
    });

    this.slowDownBtn.addEventListener("click", () => {
      this.speedMultiplier *= 0.75;
    });
  }

  addBody(body) {
    this.bodies.push(body);

    // If it's a planet, create its orbit
    if (body instanceof Planet) {
      body.createOrbit(this.container);
    }

    // Create and add the body element to the container
    const element = body.createElement();
    this.container.appendChild(element);

    return this;
  }

  createStars(count) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.width = `${Math.random() * 2}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = Math.random() * 0.8 + 0.2;
      this.container.appendChild(star);
    }
    return this;
  }

  animate() {
    const update = () => {
      this.bodies.forEach((body) => {
        body.update(this.speedMultiplier, this.paused);
      });
      requestAnimationFrame(update);
    };
    update();
  }

  static createDefaultSystem(containerId) {
    const system = new SolarSystem(containerId);

    // Add sun
    system.addBody(new Sun());

    // Add planets
    system.addBody(
      new Planet(
        "Mercury",
        4,
        90,
        4.1,
        "#BBB",
        "Mercury is the smallest and innermost planet in the Solar System. It has a rocky body like Earth, but is much smaller, with a diameter of only about 4,880 km.",
      ),
    );

    system.addBody(
      new Planet(
        "Venus",
        8,
        120,
        1.6,
        "#E39E1C",
        "Venus is the second planet from the Sun and the hottest planet in our solar system, with surface temperatures hot enough to melt lead.",
      ),
    );

    system.addBody(
      new Planet(
        "Earth",
        8.5,
        150,
        1,
        "#4B67BD",
        "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has a single natural satellite, the Moon.",
      ),
    );

    system.addBody(
      new Planet(
        "Mars",
        6,
        180,
        0.5,
        "#C1440E",
        'Mars is the fourth planet from the Sun. It has a thin atmosphere and is known as the "Red Planet" due to its reddish appearance.',
      ),
    );

    system.addBody(
      new Planet(
        "Jupiter",
        20,
        240,
        0.08,
        "#E0A343",
        "Jupiter is the largest planet in our Solar System and is a gas giant with a mass more than two and a half times that of all other planets combined.",
      ),
    );

    system.addBody(
      new RingedPlanet(
        "Saturn",
        17,
        300,
        0.03,
        "#C9B063",
        "Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. It is a gas giant like Jupiter.",
      ),
    );

    system.addBody(
      new Planet(
        "Uranus",
        12,
        360,
        0.01,
        "#93CFE0",
        "Uranus is the seventh planet from the Sun. It is an ice giant and has a blue-green color due to methane in its atmosphere.",
      ),
    );

    system.addBody(
      new Planet(
        "Neptune",
        11,
        420,
        0.006,
        "#4F83DB",
        "Neptune is the eighth and farthest known planet from the Sun. It is an ice giant like Uranus and is known for its strong winds.",
      ),
    );

    // Add stars
    system.createStars(200);

    // Start animation
    system.animate();

    return system;
  }
}

// Initialize the solar system when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const solarSystem = SolarSystem.createDefaultSystem(".container");
});
