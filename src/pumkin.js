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
        this.#drawEyes(ctx);
        this.#drawNose(ctx);
        this.#drawMouth(ctx);

        ctx.restore();
    }

    #drawMouth(ctx) {
        ctx.fillStyle="black";
        ctx.save();
        ctx.translate(0, 0.4);

        ctx.moveTo(-0.6, 0);
        ctx.lineTo(-0.4, -0.17);
        ctx.lineTo(-0.2, -0.08);
        ctx.lineTo(0, -0.2);
        ctx.lineTo(+0.2, -0.08);
        ctx.lineTo(+0.4, -0.17);
        ctx.lineTo(0.6, 0);
        ctx.lineTo(+0.4, 0.17);
        ctx.lineTo(+0.2, 0.08);
        ctx.lineTo(0, 0.2);
        ctx.lineTo(-0.2, 0.08);
        ctx.lineTo(-0.4, 0.17);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    #drawNose(ctx) {
        ctx.save();
        ctx.translate(-0.08, -0.0);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(-0.05, 0);
        ctx.lineTo(0.05, -0.05);
        ctx.lineTo(0.05, 0.05);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        ctx.save();
        ctx.translate(0.08, -0.0);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(0.05, 0);
        ctx.lineTo(-0.05, -0.05);
        ctx.lineTo(-0.05, 0.05);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    #drawEyes(ctx) {
        ctx.save();
        ctx.translate(-0.4, -0.4);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(-0.15, 0);
        ctx.lineTo(0.15, -0.15);
        ctx.lineTo(0.15, 0.15);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        ctx.save();
        ctx.translate(0.4, -0.4);

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(0.15, 0);
        ctx.lineTo(-0.15, -0.15);
        ctx.lineTo(-0.15, 0.15);
        ctx.closePath();
        ctx.fill();

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