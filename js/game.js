console.log("[Tanio Rocha] Flappy Bird");

const jumpSound = new Audio();
jumpSound.src = "./assets/audio/pulo.wav";

const pointSound = new Audio();
pointSound.src = "./assets/audio/ponto.wav";

const hitSound = new Audio();
hitSound.src = "./assets/audio/hit.wav";

const sprites = new Image();
sprites.src = "./assets/images/sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//
// [Game Objects]
//
const getReadyMessage = new GetReadyMessage(134, 0, 174, 152, ((canvas.width / 2) - 174 / 2), 50);
const gameOverMessage = new GameOverMessage(134, 153, 226, 200, ((canvas.width / 2) - 226 / 2), 50);
const background = new Background(390, 0, 275, 204, 0, (canvas.height - 204));
const ironCoin = new Coin(0, 78, 44, 44, 73, 137);
const silverCoin = new Coin(48, 78, 44, 44, 73, 137);
const goldCoin = new Coin(0, 124, 44, 44, 73, 137);
const brassCoin = new Coin(48, 124, 44, 44, 73, 137);
var pipes = new Pipes(0, 169, 52, 400, 220, 0);
const ground = new Ground(0, 610, 224, 112, 0, (canvas.height - 112));
const score = new Score(0, 0, 33, 24, 10, 50);
var flappyBird = new FlappyBird(0, 0, 33, 24, 10, 50);

function drawAmbienceContent() {
    background.createSky(context, canvas);
    background.draw(sprites, context, true);
    pipes.draw(sprites, context);
    ground.draw(sprites, context, true);
}

//
// [Screens]
//
var gameScorePoint = 0;
var bestScore = 0;
const screens = {
    START: {
        draw() {
            gameScorePoint = 0;
            drawAmbienceContent();
            getReadyMessage.draw(sprites, context);

            // reseting
            pipes = new Pipes(0, 169, 52, 400, 220, 0);
            flappyBird = new FlappyBird(0, 0, 33, 24, 10, 50);

            flappyBird.draw(sprites, context);
        },
        handler() { 
            switchScreen(screens.GAME); 
        },
        update() {
            score.setPoint(gameScorePoint);
        }
    },
    GAME: {
        draw() {
            drawAmbienceContent();
            score.draw(canvas, context);
            flappyBird.draw(sprites, context);
        },
        handler() { 
            jumpSound.play();
            flappyBird.jump(); 
        },
        update(frameRate) {
            ground.update(flappyBird, function() {
                hitSound.play();
                switchScreen(screens.GAME_OVER);

                return;
            });
            pipes.update(canvas, flappyBird, function() {
                hitSound.play();
                switchScreen(screens.GAME_OVER);

                return;
            }, function() {
                gameScorePoint++;
                score.setPoint(gameScorePoint);
                pointSound.play();
                bestScore = gameScorePoint > bestScore ? gameScorePoint : bestScore;
            }, frameRate);
            flappyBird.applyGravity(); 
            flappyBird.update(frameRate);
        }
    },
    GAME_OVER: {
        draw() {
            gameOverMessage.draw(sprites, context);

            const result = gameScorePoint === 0 ? -50 : (gameScorePoint - bestScore);
            switch(result){
                case 0:
                    goldCoin.draw(sprites, context);
                    break; 
                case -1:
                    brassCoin.draw(sprites, context);
                    break;
                case -2: 
                    silverCoin.draw(sprites, context);
                default:
                    ironCoin.draw(sprites, context);
            }

            context.fillText(gameScorePoint, canvas.width - 68, 148);
            context.fillText(bestScore, canvas.width - 68, 190);
        },
        handler() {
            switchScreen(screens.START);
        },
        update() {
            
        }
    }
}

var activeScreen = screens.START;

function switchScreen(screen) {
    activeScreen = screen;
}

window.addEventListener("click", function() {
    if(activeScreen.handler) 
        activeScreen.handler();
});

//
// [Loop]
//
var frameRate = 0;

function loop() {  
    this.frameRate ++;

    activeScreen.draw();
    activeScreen.update(frameRate);

    requestAnimationFrame(loop);
}

loop();