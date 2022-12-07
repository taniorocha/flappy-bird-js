class GameObject {
    constructor(spriteX, spriteY, width, height, x, y) {
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    draw (sprite, context, duplicate = false) {
        context.drawImage(
            sprite, 
            this.spriteX, this.spriteY, 
            this.width, this.height, 
            this.x, this.y, 
            this.width, this.height, 
        );

        if(duplicate)
            context.drawImage(
                sprite, 
                this.spriteX, this.spriteY, 
                this.width, this.height, 
                (this.x + this.width), this.y, 
                this.width, this.height, 
            );
    }
}

class GetReadyMessage extends GameObject {
    constructor(spriteX, spriteY, width, height, x, y){
        super(spriteX, spriteY, width, height, x, y);
    }
}

class Background extends GameObject {
    constructor(spriteX, spriteY, width, height, x, y){
        super(spriteX, spriteY, width, height, x, y);
    }

    createSky(context, canvas) {
        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

class Pipes extends GameObject {
    frameRate = 0;
    pipes = [];

    constructor(spriteX, spriteY, width, height, x, y){
        super(spriteX, spriteY, width, height, x, y);
    }

    draw(sprite, context) {
        this.pipes.forEach(doublePipe=> {
            const spritePipeDistance = 52;
            const spaceBetween = 90;
            const randomPosition = doublePipe.y;

            // bottom pipe
            const bottomPipeX = doublePipe.x;
            const bottomPipeY = this.y + this.height + spaceBetween + randomPosition;
            context.drawImage(
                sprite, 
                this.spriteX, this.spriteY, 
                this.width, this.height, 
                bottomPipeX, bottomPipeY,
                this.width, this.height, 
            );

            // top pipe
            const topPipeX = doublePipe.x;
            const topPipeY = this.y + randomPosition;
            context.drawImage(
                sprite, 
                this.spriteX + spritePipeDistance, this.spriteY, 
                this.width, this.height, 
                topPipeX, topPipeY,
                this.width, this.height, 
            );

            doublePipe.bottomPipe = {
                x: bottomPipeX,
                y: bottomPipeY
            }

            doublePipe.topPipe = {
                x: topPipeX,
                y: this.height + topPipeY
            }
        });
    }

    checkColision(flappyBird, pipes) {
        if(flappyBird.x >= pipes.x) {
            if(flappyBird.y <= pipes.topPipe.y)
                return true;

            if((flappyBird.y + flappyBird.height) >= pipes.bottomPipe.y)
                return true
        }

        return false;
    }

    checkGetPoint(flappyBird, pipes) {
        if(flappyBird.x >= (pipes.x + this.width))
            return true;

        return false;
    }

    update(canvas, flappyBird, colisionCallback, pointCallback) {
        this.frameRate += 1;

        const passedAmountFrames = this.frameRate % 100 === 0;
        if(passedAmountFrames) {
            this.pipes.push({ x: canvas.width, y: (-150 * (Math.random() + 1)) });
        }

        this.pipes.forEach(doublePipe=> {
            if(this.checkColision(flappyBird, doublePipe)) {
                colisionCallback();
                // break;
            }

            const passedAmountFrames = this.frameRate % 4 === 0;
            if(this.checkGetPoint(flappyBird, doublePipe) && passedAmountFrames) {
                pointCallback();
                // console.log("ponto");
            }

            doublePipe.x = doublePipe.x -2;

            if(doublePipe.x + this.width <= 0) 
                this.pipes.shift();
        });
    }
}

class Ground extends GameObject {
    constructor(spriteX, spriteY, width, height, x, y){
        super(spriteX, spriteY, width, height, x, y);
    }

    checkColision(flappyBird) {
        if(flappyBird.x >= this.x)
            if((flappyBird.y + flappyBird.height) >= this.y)
                return true;
    
        return false;
    }

    update(flappyBird, callback) {
        if(this.checkColision(flappyBird)) {
            callback();
            return;
        }

        const movimentRate = 2;
        const repeteIn = this.height / 2;
        const moviment = this.x - movimentRate;

        this.x = moviment % repeteIn;
    }
}

class FlappyBird extends GameObject {
    gravity = 0.25;
    velocity = 0;
    jumpForce = 4.6;

    moviments = [
        { spriteX: 0, spriteY: 0 },
        { spriteX: 0, spriteY: 26 },
        { spriteX: 0, spriteY: 52 }
    ];

    frameRate = 0;
    actualFrame = 0;
    isFlying = false;

    constructor(spriteX, spriteY, width, height, x, y){
        super(spriteX, spriteY, width, height, x, y);
    }

    updateActualFrame () {
        const frameInterval = 10;
        const canMoviment = this.frameRate % frameInterval === 0;
        if(canMoviment){
            const movimentRate = 1;
            const increment = this.actualFrame + movimentRate;
            const repeatBase = this.moviments.length;
    
            this.actualFrame = increment % repeatBase;
        }
    }

    applyGravity() {
        if(!this.isFlying)
            return;

        this.velocity = this.velocity + this.gravity;
        this.y = this.y + this.velocity;
    }

    draw(sprite, context) {
        this.frameRate += 1;

        this.updateActualFrame();
        const movimentSprite = this.moviments[this.isFlying ? this.actualFrame : 0];
        context.drawImage(
            sprite, 
            movimentSprite.spriteX, movimentSprite.spriteY, 
            this.width, this.height, 
            this.x, this.y, 
            this.width, this.height, 
        );
    }

    jump() {
        this.velocity =- this.jumpForce;
    }
}