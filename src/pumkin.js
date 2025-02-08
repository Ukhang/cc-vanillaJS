class Pumpkin {
    constructor(x, y, rad) {
        this.x = x;
        this.y = y;
        this.rad = rad;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.rad, this.rad);

        this.#drawHead(ctx);

        ctx.restore();
    }

    #drawHead(ctx) {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.rect(-0.05, -1, 0.1, 0.1);
        ctx.fill();

        ctx.fillStyle="rgb(255,150,0)";
        ctx.beginPath();
        ctx.ellipse(-0.6, 0.03, 0.4, 0.92, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0.6, 0.03, 0.4, 0.93, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle="rgb(255,170,0)";
        ctx.beginPath();
        ctx.ellipse(-0.3, 0.03, 0.4, 0.95, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0.3, 0.03, 0.4, 0.95, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle="rgb(255,190,0)";
        ctx.beginPath();
        ctx.ellipse(0, 0.03, 0.4, 0.97, 0, 0, Math.PI * 2);
        ctx.fill();

    }
}