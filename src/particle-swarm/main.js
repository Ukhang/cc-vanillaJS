// Main application class
class ParticleSwarmApp {
    constructor() {
        // Initialize canvas and context
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to window size
        this.resizeCanvas();
        
        // Initialize properties
        this.particles = [];
        this.particleCount = 150;
        this.mousePosition = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        this.mousePressed = false;
        this.darkTheme = true;
        
        // Physics parameters
        this.attraction = 0.1;
        this.repulsion = 0.4;
        this.mouseInfluence = 0.5;
        this.maxSpeed = 3;
        
        // Initialize controls
        this.initControls();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Create initial particles
        this.createParticles();
        
        // Start animation loop
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initControls() {
        // Get all control elements
        this.attractionSlider = document.getElementById('attraction');
        this.attractionValue = document.getElementById('attraction-value');
        this.repulsionSlider = document.getElementById('repulsion');
        this.repulsionValue = document.getElementById('repulsion-value');
        this.mouseInfluenceSlider = document.getElementById('mouse-influence');
        this.mouseInfluenceValue = document.getElementById('mouse-influence-value');
        this.maxSpeedSlider = document.getElementById('max-speed');
        this.maxSpeedValue = document.getElementById('max-speed-value');
        this.particleCountSlider = document.getElementById('particle-count');
        this.particleCountValue = document.getElementById('particle-count-value');
        this.resetButton = document.getElementById('reset');
        this.themeToggleButton = document.getElementById('theme-toggle');
        
        // Set initial values
        this.attractionValue.textContent = this.attraction.toFixed(2);
        this.repulsionValue.textContent = this.repulsion.toFixed(2);
        this.mouseInfluenceValue.textContent = this.mouseInfluence.toFixed(2);
        this.maxSpeedValue.textContent = this.maxSpeed.toFixed(1);
        this.particleCountValue.textContent = this.particleCount;
        
        // Add event listeners to controls
        this.attractionSlider.addEventListener('input', () => {
            this.attraction = parseFloat(this.attractionSlider.value);
            this.attractionValue.textContent = this.attraction.toFixed(2);
        });
        
        this.repulsionSlider.addEventListener('input', () => {
            this.repulsion = parseFloat(this.repulsionSlider.value);
            this.repulsionValue.textContent = this.repulsion.toFixed(2);
        });
        
        this.mouseInfluenceSlider.addEventListener('input', () => {
            this.mouseInfluence = parseFloat(this.mouseInfluenceSlider.value);
            this.mouseInfluenceValue.textContent = this.mouseInfluence.toFixed(2);
        });
        
        this.maxSpeedSlider.addEventListener('input', () => {
            this.maxSpeed = parseFloat(this.maxSpeedSlider.value);
            this.maxSpeedValue.textContent = this.maxSpeed.toFixed(1);
        });
        
        this.particleCountSlider.addEventListener('input', () => {
            this.particleCount = parseInt(this.particleCountSlider.value);
            this.particleCountValue.textContent = this.particleCount;
            this.createParticles();
        });
        
        this.resetButton.addEventListener('click', () => {
            this.createParticles();
        });
        
        this.themeToggleButton.addEventListener('click', () => {
            this.darkTheme = !this.darkTheme;
            document.body.style.backgroundColor = this.darkTheme ? '#121212' : '#f0f0f0';
        });
    }
    
    initEventListeners() {
        // Mouse move event
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
        
        // Mouse press events
        window.addEventListener('mousedown', () => {
            this.mousePressed = true;
        });
        
        window.addEventListener('mouseup', () => {
            this.mousePressed = false;
        });
        
        // Window resize event
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Touch events for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mousePosition.x = touch.clientX;
                this.mousePosition.y = touch.clientY;
                this.mousePressed = true;
            }
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            this.mousePressed = false;
        });
    }
    
    createParticles() {
        // Clear existing particles
        this.particles = [];
        
        // Create new particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                Math.random() * 3 + 1,
                this.getRandomColor()
            ));
        }
    }
    
    getRandomColor() {
        // Generate vibrant colors
        const hue = Math.random() * 360;
        return `hsl(${hue}, 100%, 70%)`;
    }
    
    animate() {
        // Set up the next animation frame
        requestAnimationFrame(this.animate.bind(this));
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set background
        this.ctx.fillStyle = this.darkTheme ? 'rgba(18, 18, 18, 0.5)' : 'rgba(240, 240, 240, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw connections
        this.drawConnections();
        
        // Update and draw particles
        this.particles.forEach(particle => {
            // Apply forces from other particles
            this.applyForces(particle);
            
            // Apply mouse influence if mouse is pressed
            if (this.mousePressed) {
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    const force = this.mouseInfluence / distance;
                    particle.vx += dx * force;
                    particle.vy += dy * force;
                }
            }
            
            // Update and draw the particle
            particle.update(this.maxSpeed, this.canvas.width, this.canvas.height);
            particle.draw(this.ctx, this.darkTheme);
        });
    }
    
    applyForces(particle) {
        // Apply attraction and repulsion forces between particles
        this.particles.forEach(otherParticle => {
            if (particle === otherParticle) return;
            
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            if (dist < 150) {
                // Attraction force (increases with distance)
                const attractionForce = this.attraction * dist / 150;
                
                // Repulsion force (decreases with distance)
                const repulsionForce = this.repulsion / (dist * 0.5);
                
                // Calculate net force
                const netForce = attractionForce - (dist < 50 ? repulsionForce : 0);
                
                // Apply force
                if (dist > 0) {
                    particle.vx += (dx / dist) * netForce;
                    particle.vy += (dy / dist) * netForce;
                }
            }
        });
    }
    
    drawConnections() {
        // Draw connections between nearby particles
        this.ctx.strokeStyle = this.darkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

// Particle class
class Particle {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.alpha = 0.8;
    }
    
    update(maxSpeed, canvasWidth, canvasHeight) {
        // Apply speed limit
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Handle boundary conditions (wrap around)
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
    }
    
    draw(ctx, darkTheme) {
        // Draw particle with glow effect
        ctx.save();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        // Draw main circle
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Start the application when the window loads
window.onload = () => {
    new ParticleSwarmApp();
};