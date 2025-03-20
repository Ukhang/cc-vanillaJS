// Constants
const KILOTON_TO_JOULES = 4.184e12; // 1 kiloton TNT = 4.184×10^12 joules
const AIR_DENSITY = 1.225; // kg/m³ at sea level
const SPEED_OF_SOUND = 343; // m/s at STP
const SCALE_FACTOR = 20; // For visualization purposes

// Main Simulation Class
class NuclearExplosion {
    constructor(yield_kt, altitude, canvas) {
        this.yield_kt = yield_kt;
        this.altitude = altitude;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.energy = yield_kt * KILOTON_TO_JOULES; // Energy in joules
        this.time = 0;
        this.isDetonated = false;

        // Derived properties
        this.initialTemperature = 1e8; // Initial temperature in K (100 million K)
        this.initialFireballRadius = Math.pow(this.energy, 1/3) * 0.01; // Initial radius in m
        
        // Visual properties
        this.groundLevel = this.canvas.height * 0.8;
        this.detonationPoint = {
            x: this.canvas.width / 2,
            y: this.groundLevel - (this.altitude / SCALE_FACTOR)
        };
        
        // Particles for explosion effects
        this.particles = [];
        this.shockwaveRadius = 0;
        
        // Initialize the scene
        this.drawGround();
        this.drawSkyline();
    }
    
    detonate() {
        this.isDetonated = true;
        this.time = 0;
        this.particles = [];
        this.shockwaveRadius = 0;
        
        // Create initial fireball particles
        for (let i = 0; i < 500; i++) {
            this.particles.push(new Particle(
                this.detonationPoint.x, 
                this.detonationPoint.y,
                Math.random() * 2 * Math.PI,
                Math.random() * this.initialFireballRadius / SCALE_FACTOR * 5
            ));
        }
        
        // Start the animation
        this.animate();
    }
    
    animate() {
        if (!this.isDetonated) return;
        
        this.time += 0.016; // ~60fps time increment
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
    
    update() {
        // Update fireball radius based on time
        this.currentFireballRadius = this.calculateFireballRadius(this.time);
        
        // Update blast wave radius
        this.blastWaveRadius = this.calculateBlastWaveRadius(this.time);
        
        // Update particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.time);
            
            // Add more particles as explosion grows
            if (Math.random() < 0.1 && this.particles.length < 2000 && this.time < 2) {
                this.particles.push(new Particle(
                    this.detonationPoint.x, 
                    this.detonationPoint.y,
                    Math.random() * 2 * Math.PI,
                    Math.random() * this.currentFireballRadius / SCALE_FACTOR
                ));
            }
        }
        
        // Update data display
        document.getElementById('time-display').textContent = this.time.toFixed(2) + ' s';
        document.getElementById('fireball-radius').textContent = Math.round(this.currentFireballRadius) + ' m';
        document.getElementById('blast-radius').textContent = Math.round(this.blastWaveRadius) + ' m';
        document.getElementById('overpressure').textContent = this.calculateOverpressure().toFixed(2) + ' kPa';
        document.getElementById('energy').textContent = (this.energy / 1e12).toFixed(2) + ' TJ';
        document.getElementById('temperature').textContent = Math.round(this.calculateTemperature()) + ' K';
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw sky
        this.drawSky();
        
        // Draw ground
        this.drawGround();
        
        // Draw skyline
        this.drawSkyline();
        
        // Draw blast wave
        this.drawBlastWave();
        
        // Draw fireball
        this.drawFireball();
        
        // Draw particles
        this.drawParticles();
    }
    
    drawSky() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundLevel);
        
        if (this.time < 0.5) {
            // Initial bright flash
            const flashIntensity = Math.min(1, (0.5 - this.time) * 2);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${flashIntensity})`);
            gradient.addColorStop(1, `rgba(255, 240, 220, ${flashIntensity})`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.groundLevel);
        }
        
        // Normal sky gradient
        gradient.addColorStop(0, '#0a1a2a');
        gradient.addColorStop(1, '#1a3a5a');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.groundLevel);
    }
    
    drawGround() {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, this.groundLevel, this.canvas.width, this.canvas.height - this.groundLevel);
    }
    
    drawSkyline() {
        // Simple city skyline
        this.ctx.fillStyle = '#000000';
        for (let i = 0; i < this.canvas.width; i += 50) {
            const height = Math.random() * 100 + 30;
            this.ctx.fillRect(i, this.groundLevel - height, 30, height);
            
            // Add some windows
            this.ctx.fillStyle = '#333333';
            for (let y = this.groundLevel - height + 10; y < this.groundLevel - 10; y += 15) {
                for (let x = i + 5; x < i + 25; x += 10) {
                    this.ctx.fillRect(x, y, 5, 8);
                }
            }
            this.ctx.fillStyle = '#000000';
        }
    }
    
    drawFireball() {
        const scaledRadius = this.currentFireballRadius / SCALE_FACTOR;
        
        // Glow effect
        const gradient = this.ctx.createRadialGradient(
            this.detonationPoint.x, this.detonationPoint.y, 0,
            this.detonationPoint.x, this.detonationPoint.y, scaledRadius * 1.5
        );
        
        // Temperature-based color
        const temperature = this.calculateTemperature();
        let color;
        
        if (temperature > 1e6) {
            color = '#ffffff'; // White hot
        } else if (temperature > 1e5) {
            color = '#ffffaa'; // Yellow-white
        } else if (temperature > 1e4) {
            color = '#ffaa00'; // Orange-yellow
        } else {
            color = '#ff5500'; // Red-orange
        }
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.7, 'rgba(255, 140, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.detonationPoint.x, this.detonationPoint.y, scaledRadius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Core fireball
        const coreGradient = this.ctx.createRadialGradient(
            this.detonationPoint.x, this.detonationPoint.y, 0,
            this.detonationPoint.x, this.detonationPoint.y, scaledRadius
        );
        
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.4, color);
        coreGradient.addColorStop(1, 'rgba(255, 100, 0, 0.7)');
        
        this.ctx.fillStyle = coreGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.detonationPoint.x, this.detonationPoint.y, scaledRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBlastWave() {
        if (this.time < 0.1) return;
        
        const scaledRadius = this.blastWaveRadius / SCALE_FACTOR;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.detonationPoint.x, this.detonationPoint.y, scaledRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Add a subtle glow to the blast wave
        this.ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(this.detonationPoint.x, this.detonationPoint.y, scaledRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            particle.draw(this.ctx, this.detonationPoint, this.time);
        }
    }
    
    // Physics calculations
    calculateFireballRadius(time) {
        // Based on nuclear fireball growth model
        // R(t) = R0 * (t/t0)^(2/5) for t < t0
        // where t0 is the characteristic time related to yield
        
        const t0 = Math.pow(this.energy, 1/6) * 0.001; // Characteristic time
        
        if (time < t0) {
            return this.initialFireballRadius * Math.pow(time/t0, 2/5);
        } else {
            // After t0, growth slows down
            const R_t0 = this.initialFireballRadius * Math.pow(1, 2/5);
            return R_t0 * Math.pow(time/t0, 1/5);
        }
    }
    
    calculateBlastWaveRadius(time) {
        // Simplified Sedov-Taylor solution
        // R(t) = k * (E/ρ)^(1/5) * t^(2/5)
        // where k is a constant, E is energy, ρ is density
        
        const k = 1.03; // Constant for spherical blast waves
        return k * Math.pow(this.energy / AIR_DENSITY, 1/5) * Math.pow(time, 2/5);
    }
    
    calculateOverpressure() {
        // Calculate overpressure in kPa at the blast wave front
        // P = P0 * (R0/R)^3
        // where P0 is initial pressure, R0 is reference radius, R is current radius
        
        const P0 = 101.325; // Standard atm pressure in kPa
        const R0 = Math.pow(this.energy / (4.186e12), 1/3) * 165; // Reference radius scaled by yield
        
        return P0 * Math.pow(R0 / this.blastWaveRadius, 3);
    }
    
    calculateTemperature() {
        // Simplified temperature calculation
        // T(t) = T0 * (R0/R(t))^3
        // where T0 is initial temperature, R0 is initial radius, R(t) is current radius
        
        return this.initialTemperature * Math.pow(this.initialFireballRadius / this.currentFireballRadius, 3);
    }
}

// Particle Class for visual effects
class Particle {
    constructor(x, y, angle, distance) {
        this.initialX = x;
        this.initialY = y;
        this.angle = angle;
        this.distance = distance;
        this.speed = Math.random() * 2 + 1;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.decay = Math.random() * 0.05 + 0.01;
        this.color = this.getRandomColor();
    }
    
    update(time) {
        this.alpha -= this.decay * time;
        if (this.alpha < 0) this.alpha = 0;
    }
    
    draw(ctx, center, time) {
        if (this.alpha <= 0) return;
        
        // Calculate position based on explosion center and time
        const x = center.x + Math.cos(this.angle) * this.distance * (1 + time * this.speed);
        const y = center.y + Math.sin(this.angle) * this.distance * (1 + time * this.speed);
        
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    getRandomColor() {
        const colors = [
            '#ff7700', '#ff5500', '#ff9900', '#ffaa00', 
            '#ffcc00', '#ffffff', '#ffddaa'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Initialize the simulation when the page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('simulation-canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Get initial values
    const yieldValue = parseInt(document.getElementById('yield').value);
    const altitudeValue = parseInt(document.getElementById('altitude').value);
    
    // Create the simulation
    const simulation = new NuclearExplosion(yieldValue, altitudeValue, canvas);
    
    // Event listeners for controls
    document.getElementById('yield').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('yield-value').textContent = value + ' kt';
        simulation.yield_kt = value;
        simulation.energy = value * KILOTON_TO_JOULES;
        simulation.initialFireballRadius = Math.pow(simulation.energy, 1/3) * 0.01;
    });
    
    document.getElementById('altitude').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('altitude-value').textContent = value + ' m';
        simulation.altitude = value;
        simulation.detonationPoint.y = simulation.groundLevel - (value / SCALE_FACTOR);
        simulation.drawGround();
    });
    
    document.getElementById('detonate').addEventListener('click', () => {
        simulation.detonate();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        simulation.groundLevel = canvas.height * 0.8;
        simulation.detonationPoint = {
            x: canvas.width / 2,
            y: simulation.groundLevel - (simulation.altitude / SCALE_FACTOR)
        };
        simulation.drawGround();
        simulation.drawSkyline();
    });
});