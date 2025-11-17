const canvas = document.getElementById("canvas")
const brush = canvas.getContext('2d');

const dpr = window.devicePixelRatio || 1;
const W = canvas.width  = Math.floor((canvas.clientWidth  || 480) * dpr);
const H = canvas.height = Math.floor((canvas.clientHeight || 640 ) * dpr);

let pipes,score,frame,bird;

const PIPE_GAP = 200;
const PIPE_W = 80;
const PIPE_DIST = 350;
const PIPE_SPEED = 2.5;
const GROUND_H = 80;

//Bird Physics
const GRAVITY = 0.5;
const FLAP_VY = -8.5;
const MAX_UP = -0.6;
const MAX_DOWN = 1;
const ROT_LERP = 0.12;

const birdImg = new Image();
birdImg.src = "./images/flappyBird.png";

(function reset(){
    pipes = [];
    frame = 0;
    score = 0;

    //bird
    bird = {
        x : W*0.3,
        y : H/2,
        vy : 0,
        angle : 0
    }

    spawnInitialPipes();
    setUpControls();
    loop();
})();

function spawnInitialPipes(){
    pipes = [];
    let x = W - 500;
    for(let i=0;i<6;i++){
        const top = randBetween(60,H-GROUND_H-PIPE_GAP-60)
        pipes.push({x: x+i*PIPE_DIST,top});
    }
}

function update(){
    frame++;

    //Pipes Movement
    for(let p of pipes){ p.x -= PIPE_SPEED}

    // Remove off screen and spawn
    if(pipes.length && pipes[0].x < -PIPE_W) { pipes.shift(); spawnPipe();}

    //Updating Bird
    bird.vy += GRAVITY; //Increasing velocity
    bird.y += bird.vy; //Decreasing height with new velocity


    //Keeping bird inside for now
    if(bird.y < 0){
        bird.y = 0;
        bird.vy = 0;
    }

    if(bird.y > H-GROUND_H){
        bird.y = H-GROUND_H;
        bird.vy = 0;
    }

    //Click based rotation
    const targetAngle = bird.vy < 0 ? MAX_UP : MAX_DOWN ;
    bird.angle += (targetAngle - bird.angle) * ROT_LERP

}

function draw(){
    brush.clearRect(0,0,W,H);


    //Drawing Pipes
    for(let p of pipes){
        drawPipeUpper(p.x,0,PIPE_W,p.top);
        drawPipeLower(p.x,p.top+PIPE_GAP,PIPE_W,H-GROUND_H-(p.top+PIPE_GAP));
    }

    //Drawing Bird
    drawBird();
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

function setUpControls(){

    canvas.addEventListener("mousedown",flap);
    canvas.addEventListener("touchstart", e => {
        e.preventDefault();
        flap();
    },{passive : false});

    window.addEventListener("keydown", e => {
        if(e.code == "Space"){
            e.preventDefault();
            flap();
        }
    });

}

// Utility Drawings
function drawPipeUpper(x_pos,y_pos,weidth,height){
    brush.fillStyle = '#2fa84f';
    brush.fillRect(x_pos, y_pos, weidth, height);
    brush.fillStyle = '#237b3d';
    brush.fillRect(x_pos - 4, y_pos + height - 14 , weidth + 8, 14);
}

function drawPipeLower(x_pos,y_pos,weidth,height){
    brush.fillStyle = '#2fa84f';
    brush.fillRect(x_pos, y_pos, weidth, height);
    brush.fillStyle = '#237b3d';
    brush.fillRect(x_pos - 4, y_pos, weidth + 8, 14);
}

function drawBird(){
    if(!birdImg.complete) return;

    const drawW = 120; // The problem may be here in interaction with Width and Height
    const drawH = 108; 

    brush.save();
    brush.translate(bird.x,bird.y);
    brush.rotate(bird.angle);

    brush.drawImage(
        birdImg,
        -drawW/2,
        -drawH/2,
        drawW,
        drawH
    );

    brush.restore();
}

function flap(){
    bird.vy = FLAP_VY;
    bird.angle = MAX_UP; 
}

function randBetween(a,b){
    return Math.floor(Math.random() * (b-a+1) + a);
}

function spawnPipe(){
    const top = randBetween(60,H-GROUND_H-PIPE_GAP-60);
    let last = pipes[pipes.length-1];
    pipes.push({x:last.x + PIPE_DIST,top});
}