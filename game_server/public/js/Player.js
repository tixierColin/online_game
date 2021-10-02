class Player {
    constructor(x, y, id) {
        this.id = id;
        this.pos = new Vector(x, y);
        this.vel = new Vector();
        this.input = new Vector();
        this.friction = 0.8;
    }
    
    update() {
        this.draw();
        this.calPos();
    }

    draw() {
        /*ctx.save();
            ctx.translate(this.pos.x + 30/2, this.pos.y + 30/2); // translate to center of shape
            ctx.rotate(0.17 * this.input.x);
        */
        ctx.fillStyle = "red";
        ctx.fillRect(this.pos.x, this.pos.y, 30, 30);

        //ctx.restore();
    }

    calPos() {

        this.vel.x += this.input.x * 0.7;
        this.vel.y += this.input.y * 0.7;

        this.vel.x *= this.friction;
        this.vel.y *= this.friction;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.x > 600) {
            this.pos.x = 0;
        }
        if (this.pos.y > 600) {
            this.pos.y = 0;
        }
        if (this.pos.x + 30 < 0) {
            this.pos.x = 600;
        }
        if (this.pos.y + 30 < 0) {
            this.pos.y = 600;
        }
    }

}