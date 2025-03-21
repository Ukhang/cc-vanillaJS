class ASCIICharacter {
    constructor(container, x, y, type) {
        this.container = container;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.type = type || Math.floor(Math.random() * 3);
        this.element = document.createElement('div');
        this.element.className = 'ascii-character';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        // Different anime character types
        this.frames = this.getFrames();
        this.currentFrame = 0;
        
        this.element.innerHTML = this.frames[this.currentFrame];
        
        this.container.appendChild(this.element);
        
        // Make draggable
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.element.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // Click to interact
        this.element.addEventListener('click', this.interact.bind(this));
        
        // Animation
        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.element.innerHTML = this.frames[this.currentFrame];
        }, 500);
        
        // Random movement
        this.lastDirectionChange = Date.now();
        this.directionChangeInterval = 2000 + Math.random() * 3000;
        
        // Color
        this.updateColor();
    }
    
    getFrames() {
        const characterTypes = [
            // Anime girl with long hair
            [
                `  /\\__/\\\n (● . ●)\n ( >⌥< )\n  UU  UU`,
                `  /\\__/\\\n (● o ●)\n ( >⌥< )\n  UU  UU`,
                `  /\\__/\\\n (● - ●)\n ( >⌥< )\n  UU  UU`
            ],
            // Anime boy with spiky hair
            [
                `   /\\/\\/\\\n  (◕ᴗ◕ )\n  /|__|\\\n   /  \\`,
                `   /\\/\\/\\\n  (◕ᴥ◕ )\n  /|__|\\\n   /  \\`,
                `   /\\/\\/\\\n  (◕_◕ )\n  /|__|\\\n   /  \\`
            ],
            // Chibi character
            [
                `   ^-^\n  (0w0)\n  /( )\\\n   ╰╯`,
                `   ^-^\n  (0w0)\n ╭( )╮\n   ╰╯`,
                `   ^-^\n  (^w^)\n  /( )\\\n   ╰╯`
            ]
        ];
        
        return characterTypes[this.type];
    }
    
    updateColor() {
        // Random pastel color
        const hue = Math.random() * 360;
        const colorMode = window.colorMode || false;
        
        if (colorMode) {
            this.element.style.color = `hsl(${hue}, 100%, 70%)`;
            this.element.style.textShadow = `0 0 5px hsl(${hue}, 100%, 50%)`;
        } else {
            this.element.style.color = '#0f0';
            this.element.style.textShadow = '0 0 5px #0f0';
        }
    }
    
    startDrag(e) {
        this.isDragging = true;
        const rect = this.element.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        e.preventDefault();
        
        // Bring to front
        this.container.appendChild(this.element);
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.x = e.clientX - this.offsetX;
        this.y = e.clientY - this.offsetY;
        
        // Keep within container
        const containerRect = this.container.getBoundingClientRect();
        const elementRect = this.element.getBoundingClientRect();
        
        this.x = Math.max(0, Math.min(this.x, containerRect.width - elementRect.width));
        this.y = Math.max(0, Math.min(this.y, containerRect.height - elementRect.height));
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    
    endDrag() {
        this.isDragging = false;
    }
    
    interact() {
        if (this.isDragging) return;
        
        // Change expression
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        this.element.innerHTML = this.frames[this.currentFrame];
        
        // Jump
        this.vy = -5;
        
        // Find nearby characters and interact with them
        const characters = window.characters;
        for (let char of characters) {
            if (char === this) continue;
            
            const dx = char.x - this.x;
            const dy = char.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                // Make other character jump too
                char.vy = -3;
                // And change expression
                char.currentFrame = (char.currentFrame + 1) % char.frames.length;
                char.element.innerHTML = char.frames[char.currentFrame];
            }
        }
    }
    
    update() {
        if (this.isDragging) return;
        
        // Apply gravity if enabled
        if (window.gravityEnabled) {
            this.vy += 0.1;
        }
        
        // Random movement
        const now = Date.now();
        if (now - this.lastDirectionChange > this.directionChangeInterval) {
            this.vx = (Math.random() - 0.5) * 2;
            if (!window.gravityEnabled) {
                this.vy = (Math.random() - 0.5) * 2;
            }
            this.lastDirectionChange = now;
            this.directionChangeInterval = 2000 + Math.random() * 3000;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary checks
        const containerRect = this.container.getBoundingClientRect();
        const elementRect = this.element.getBoundingClientRect();
        
        if (this.x < 0) {
            this.x = 0;
            this.vx *= -1;
        }
        
        if (this.x > containerRect.width - elementRect.width) {
            this.x = containerRect.width - elementRect.width;
            this.vx *= -1;
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.vy *= -1;
        }
        
        if (this.y > containerRect.height - elementRect.height) {
            this.y = containerRect.height - elementRect.height;
            this.vy *= -0.8;
            
            // Add some friction when on the ground
            if (Math.abs(this.vx) > 0.1) {
                this.vx *= 0.95;
            } else {
                this.vx = 0;
            }
        }
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    
    destroy() {
        clearInterval(this.animationInterval);
        this.element.removeEventListener('mousedown', this.startDrag);
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.endDrag);
        this.element.removeEventListener('click', this.interact);
        this.container.removeChild(this.element);
    }
}

// Initialize
const container = document.getElementById('container');
window.characters = [];
window.gravityEnabled = true;
window.colorMode = false;

// Add initial characters
for (let i = 0; i < 5; i++) {
    const x = Math.random() * (container.clientWidth - 100);
    const y = Math.random() * (container.clientHeight - 100);
    const type = Math.floor(Math.random() * 3);
    const character = new ASCIICharacter(container, x, y, type);
    window.characters.push(character);
}

// Animation loop
function animate() {
    for (let character of window.characters) {
        character.update();
    }
    
    // Check for character interactions
    for (let i = 0; i < window.characters.length; i++) {
        for (let j = i + 1; j < window.characters.length; j++) {
            const char1 = window.characters[i];
            const char2 = window.characters[j];
            
            const dx = char2.x - char1.x;
            const dy = char2.y - char1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50) {
                // Simple collision response
                const angle = Math.atan2(dy, dx);
                const force = 0.5;
                
                char1.vx -= Math.cos(angle) * force;
                char1.vy -= Math.sin(angle) * force;
                char2.vx += Math.cos(angle) * force;
                char2.vy += Math.sin(angle) * force;
            }
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

// Event handlers for controls
document.getElementById('add-character').addEventListener('click', () => {
    const x = Math.random() * (container.clientWidth - 100);
    const y = Math.random() * (container.clientHeight - 100);
    const type = Math.floor(Math.random() * 3);
    const character = new ASCIICharacter(container, x, y, type);
    window.characters.push(character);
});

document.getElementById('toggle-gravity').addEventListener('click', () => {
    window.gravityEnabled = !window.gravityEnabled;
    for (let character of window.characters) {
        if (!window.gravityEnabled) {
            character.vy = (Math.random() - 0.5) * 2;
        }
    }
});

document.getElementById('toggle-color').addEventListener('click', () => {
    window.colorMode = !window.colorMode;
    for (let character of window.characters) {
        character.updateColor();
    }
});