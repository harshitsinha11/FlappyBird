const canvas = document.getElementById("canvas")
const brush = canvas.getContext('2d');
const W = canvas.width = canvas.clientWidth || 480; 
const H = canvas.height = canvas.clientHeight || 640;

let pipes,score,frame;

const PIPE_GAP = 160;
const PIPE_W = 80;
const PIPE_DIST = 325;
const PIPE_SPEED = 2.5;

const GROUND_H = 80;

(function(){
    pipes = [];
    frame = 0;
    score = 0;
    spawnInitialPipes();
    loop();
}) ();

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
}

function draw(){
    brush.clearRect(0,0,W,H);

    //Drawing Pipes
    for(let p of pipes){
        drawPipeUpper(p.x,0,PIPE_W,p.top);
        drawPipeLower(p.x,p.top+PIPE_GAP,PIPE_W,H-GROUND_H-(p.top+PIPE_GAP));
    }
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

// Utility
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

function randBetween(a,b){
    return Math.floor(Math.random() * (b-a+1) + a);
}

function spawnPipe(){
    const top = randBetween(60,H-GROUND_H-PIPE_GAP-60);
    let last = pipes[pipes.length-1];
    pipes.push({x:last.x + PIPE_DIST,top});
}