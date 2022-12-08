console.log("[Tanio Rocha] Flappy Bird");

const sprites = new Image();
sprites.src = "./assets/sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275, 
    height: 204,
    x: 0,
    y: canvas.height - 204,

    draw () {
        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            sprites, 
            this.spriteX, this.spriteY, 
            this.width, this.height, 
            this.x, this.y, 
            this.width, this.height, 
        );

        context.drawImage(
            sprites, 
            this.spriteX, this.spriteY, 
            this.width, this.height, 
            (this.x + this.width), this.y, 
            this.width, this.height, 
        );
    }
};

const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224, 
    height: 112,
    x: 0,
    y: canvas.height - 112,

    draw () {
        context.drawImage(
            sprites, 
            this.spriteX, this.spriteY, 
            this.width, this.height, 
            this.x, this.y, 
            this.width, this.height, 
        );

        context.drawImage(
            sprites, 
            this.spriteX, this.spriteY, 
            this.width, this.height, 
            (this.x + this.width), this.y, 
            this.width, this.height, 
        );
    }
};

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33, 
    height: 24,
    x: 10,
    y: 50, 

    gravity: 0.98,
    velocity: 0,

    draw () {
        // aplying gravity
        this.velocity = this.velocity + this.gravity;
        this.y = this.y + this.velocity;

        context.drawImage(
            sprites, 
            this.spriteX, this.spriteY, 
            this.width, this.height, 
            this.x, this.y, 
            this.width, this.height, 
        );
    }
};













function loop() {  
    background.draw();
    ground.draw();
    flappyBird.draw();

    requestAnimationFrame(loop);
}

loop();