const canv = document.querySelector("#myCanv");
const ctx = canv.getContext("2d");
const statBox = document.querySelector("#statBox");

const playerState = {
    leftDown: false,
    rightDown: false,
    leftMouseDown: false,
    rightMouseDown: false,
};
const renderState = {
    useRequestFrame: false,
};

document.body.addEventListener("keydown", e => {
    if (e.key == 'ArrowLeft') {
        playerState.leftDown = true;
    }
    if (e.key == 'ArrowRight') {
        playerState.rightDown = true;
    }
});
document.body.addEventListener("keyup", e => {
    if (e.key == 'ArrowLeft') {
        playerState.leftDown = false;
    }
    if (e.key == 'ArrowRight') {
        playerState.rightDown = false;
    }
});
canv.addEventListener("mousedown", e => {
    e.preventDefault();
    if (e.which == 1) {
        playerState.leftMouseDown = true;
    }
    if (e.which == 3) {
        playerState.rightMouseDown = true;
    }
});
canv.addEventListener("mouseup", e => {
    if (e.which == 1) {
        playerState.leftMouseDown = false;
    }
    if (e.which == 3) {
        playerState.rightMouseDown = false;
    }
});
canv.addEventListener("contextmenu", e => e.preventDefault());
document.querySelector("#controls > button").addEventListener("click", e => {
    renderState.useRequestFrame = !renderState.useRequestFrame;
});

const gameValues = {
    FPS: 120,
    rotationsPerSecond: 1.6,
};
(function computeValues() {
    // ms per frame
    gameValues.msPerFrame = 1000/gameValues.FPS;
    // radians movement per millisecond
    gameValues.radiansPerMs = 2*Math.PI*gameValues.rotationsPerSecond/1000;
})();

const frameQueue = {
    queue: [],
    nextFrame() {
        const frame = Date.now();
        const delta = this.queue.length > 0 ? frame - this.queue[this.queue.length-1] : 0;
        this.queue.push(frame);
        while (this.queue[0] < frame - 1000) {
            this.queue.shift();
        }
        this.realFPS = this.queue.length;
        return delta;
    },
    realFPS: 0,
};
const gameState = {
    lastUpdate: 0,
    direction: 0,
    angle: 0,
    frameQueue: frameQueue,
};
function initState() {
    gameState.lastFrameTime = Date.now();
}

function updateState() {
    const leftPress = playerState.leftDown || playerState.leftMouseDown;
    const rightPress = playerState.rightDown || playerState.rightMouseDown;
    let newDirection = 0;
    if (leftPress && !rightPress) {
        newDirection = -1;
    } else if (rightPress && !leftPress) {
        newDirection = 1;
    } else {
        newDirection = 0;
    }
    if (newDirection != gameState.direction) {
        const currTime = Date.now();
        if (newDirection == 0) {
            console.log(currTime - gameState.lastUpdate);
        }
        gameState.lastUpdate = Date.now();
        gameState.direction = newDirection;
    }
    // returns time in MS since last frame
    const delta = gameState.frameQueue.nextFrame();
    gameState.lastFrameTime += delta;
    // rotate by correct amount
    gameState.angle += delta * gameState.direction * gameValues.radiansPerMs;
}

function renderFrame() {
    // clear the canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canv.width, canv.height);

    // draw the central circle
    ctx.fillStyle = "#555";
    ctx.strokeStyle = "lightgreen";
    ctx.lineWidth = "7";
    ctx.beginPath();
    ctx.ellipse(canv.width/2, canv.height/2, 70, 70, 0, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // draw the ship
    ctx.lineWidth = "3";
    const R = 100;
    const ptX = R*Math.cos(gameState.angle)+canv.width/2;
    const ptY = R*Math.sin(gameState.angle)+canv.height/2;
    ctx.beginPath();
    ctx.ellipse(ptX, ptY, 2, 2, 0, 0, 2*Math.PI);
    ctx.stroke();

    // draw stats
    statBox.innerHTML = "FPS="+gameState.frameQueue.realFPS;
    statBox.innerHTML += "\n\n useRequestFrame="+renderState.useRequestFrame;
}

function mainLoopIter() {
    updateState();
    if (renderState.useRequestFrame) {
        requestAnimationFrame(renderFrame);
    } else {
        renderFrame();
    }
}

initState();
setInterval(mainLoopIter, gameValues.msPerFrame);
