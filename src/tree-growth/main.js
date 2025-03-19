class Tree {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.trunkHeight = 50;
        this.branchAngle = Math.PI / 6; // 30 degrees
        this.branchLength = 40;
        this.growthStage = 0;
        this.maxStages = 5;
        this.leafSize = 5;
    }

    // Reset tree to initial state
    reset() {
        this.trunkHeight = 50;
        this.growthStage = 0;
        this.branchLength = 40;
        this.clearCanvas();
    }

    // Clear the canvas
    clearCanvas() {
        this.ctx.fillStyle = '#f3f4f6';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Grow the tree by one stage
    grow() {
        if (this.growthStage < this.maxStages) {
            this.growthStage++;
            this.trunkHeight += 10;
            this.branchLength += 5;
        }
    }

    // Draw the tree recursively
    draw(x, y, length, angle, stage) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // Calculate end point of current branch
        const endX = x - length * Math.sin(angle);
        const endY = y - length * Math.cos(angle);
        this.ctx.lineTo(endX, endY);
        
        // Style the trunk/branches
        this.ctx.strokeStyle = stage === this.growthStage ? '#4b5563' : '#6b7280';
        this.ctx.lineWidth = stage === this.growthStage ? 3 : 1;
        this.ctx.stroke();

        // Recursive branching
        if (stage > 0) {
            this.draw(endX, endY, length * 0.8, angle + this.branchAngle, stage - 1);
            this.draw(endX, endY, length * 0.8, angle - this.branchAngle, stage - 1);
            
            // Add leaves at the tips
            if (stage === 1 && this.growthStage === this.maxStages) {
                this.drawLeaf(endX, endY);
            }
        }
    }

    // Draw a leaf
    drawLeaf(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.leafSize, 0, Math.PI * 2);
        this.ctx.fillStyle = '#10b981';
        this.ctx.fill();
    }

    // Render the tree
    render() {
        this.clearCanvas();
        this.draw(this.canvas.width / 2, this.canvas.height - 20, this.trunkHeight, 0, this.growthStage);
    }
}

// Initialize the simulation
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

const tree = new Tree(canvas, ctx);
tree.render(); // Initial render

// Event listeners for buttons
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

startBtn.addEventListener('click', () => {
    tree.grow();
    tree.render();
});

resetBtn.addEventListener('click', () => {
    tree.reset();
    tree.render();
});