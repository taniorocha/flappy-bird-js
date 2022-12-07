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
const background = new Background(390, 0, 275, 204, 0, (canvas.height - 204));
var pipes = new Pipes(0, 169, 52, 400, 220, 0);
const ground = new Ground(0, 610, 224, 112, 0, (canvas.height - 112));
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
const screens = {
    START: {
        draw() {
            drawAmbienceContent();
            getReadyMessage.draw(sprites, context);

            // reseting
            pipes = new Pipes(0, 169, 52, 400, 220, 0);
            flappyBird = new FlappyBird(0, 0, 33, 24, 10, 50);

            flappyBird.draw(sprites, context);
        },
        handler() { switchScreen(screens.GAME); },
        update() {}
    },
    GAME: {
        draw() {
            drawAmbienceContent();
            flappyBird.draw(sprites, context);
        },
        handler() { 
            jumpSound.play();
            flappyBird.jump(); 
        },
        update() {
            flappyBird.isFlying = true;

            ground.update(flappyBird, function() {
                hitSound.play();
                flappyBird.isFlying = false;

                setTimeout(() => {
                    switchScreen(screens.START);
                }, 500);
                return;
            });
            pipes.update(canvas, flappyBird, function() {
                hitSound.play();
                switchScreen(screens.START);
                return;
            }, function() {
                pointSound.play();
            });
            flappyBird.applyGravity(); 
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
function loop() {  
    activeScreen.draw();
    activeScreen.update();

    requestAnimationFrame(loop);
}

loop();