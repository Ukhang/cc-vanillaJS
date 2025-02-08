class Pumpkin {
    constructor(x, y, rad) {
        this.x = x;
        this.y = y;
        this.rad = rad;
    }

    draw(ctx) {
        this.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.rad, this.rad);

        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.rect(-1, -1, 2, 2);
        ctx.fill();
        
        this.restore();
    }
}