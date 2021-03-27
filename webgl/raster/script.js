const canv = document.querySelector("canvas");
rescaleCanvas(canv, 2.0);
const gl = canv.getContext("webgl");

const PARAMS = {
    inChunkReps: 256,
    chunkReps: 4,
};

function makeScene() {
    const reps = PARAMS.inChunkReps;
    var positionArray = [];
    var colorArray = [];
    function pushSquare(x, y, s) {
        positionArray.push(...[
            x, y,
            x+1, y,
            x, y+1,
            x, y+1,
            x+1, y,
            x+1, y+1,
        ]);
        /*
        colorArray.push(...Array(18).fill(s));
        */
        colorArray.push(...Array(9).fill(s));
        if (s == 0.0) {
            colorArray.push(...[1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
        } else {
            colorArray.push(...[0, 1, 0, 0, 1, 0, 0, 1, 0]);
        }
    }
    for (let x = 0; x < reps; x++) {
        for (let y = 0; y < reps; y++) {
            var shade = Math.abs(x + y) % 2;
            pushSquare(x, y, shade);
        }
    }
    return [new Float32Array(positionArray), new Float32Array(colorArray)];
}

var program = createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

var positionBuffer = gl.createBuffer();
var colorBuffer = gl.createBuffer();

var [positionArray, colorArray] = makeScene();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);
var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
gl.enableVertexAttribArray(colorAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

var screenXRatioUniformLocation = gl.getUniformLocation(program, "u_screenXRatio");
gl.uniform1f(screenXRatioUniformLocation, Math.min(1.0, canv.height/canv.width));
var screenYRatioUniformLocation = gl.getUniformLocation(program, "u_screenYRatio");
gl.uniform1f(screenYRatioUniformLocation, Math.min(1.0, canv.width/canv.height));

var scaleUniformLocation = gl.getUniformLocation(program, "u_scale");
var offsetUniformLocation = gl.getUniformLocation(program, "u_offset");

function draw(zee) {
    gl.viewport(0, 0, canv.width, canv.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(scaleUniformLocation, 1/zee);

    function drawChunk(x, y) {
        gl.uniform2f(offsetUniformLocation, x, y);
        gl.drawArrays(gl.TRIANGLES, 0, 6 * PARAMS.inChunkReps**2);
    }
    const reps = PARAMS.chunkReps;
    for (let x = -reps; x < reps; x++) {
        for (let y = -reps; y < reps; y++) {
            drawChunk(PARAMS.inChunkReps*x, PARAMS.inChunkReps*y);
        }
    }
}

const inputState = {
    spaceDown: false,
    shiftDown: false,
};
window.addEventListener("keydown", e => {
    if (e.key == " ") {
        inputState.spaceDown = true;
    }
    if (e.key == "Shift") {
        inputState.shiftDown = true;
    }
    if (e.key == "g") {
        inputState.gDown = true;
    }
});
window.addEventListener("keyup", e => {
    if (e.key == " ") {
        inputState.spaceDown = false;
    }
    if (e.key == "Shift") {
        inputState.shiftDown = false;
    }
    if (e.key == "g") {
        inputState.gDown = false;
    }
});

const gameState = {
    zee: 1,
    vee: 1000,
    fixedVel: 100,
};

const dashslots = (function () {
    const dashboard = document.querySelector("#dashboard");
    dashboard.addEventListener("click", () => {
        let newZee = Number(window.prompt("Where to boss? (I suggest 1600 or 4900 or 6500)"));
        if (newZee > 0) {
            gameState.zee = newZee;
        }
    });
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    dashboard.appendChild(p1);
    dashboard.appendChild(p2);
    return [p1, p2];
})();

const frameTracker = {
    frameQueue: [],
    pushFrame(currTime) {
        this.frameQueue.push(currTime);
        while (this.frameQueue.length > 0 && this.frameQueue[0] <= currTime - 3000) {
            this.frameQueue.shift();
        }
        return 1000 * this.frameQueue.length / (currTime - this.frameQueue[0]);
    },
};

let prevTime = Date.now();
function frame() {
    let currTime = Date.now();
    let delta = currTime - prevTime;
    prevTime = currTime;
    let fps = frameTracker.pushFrame(currTime);
    dashslots[0].innerText = `FPS: ${fps.toFixed(0)}`;
    dashslots[1].innerText = `Z: ${gameState.zee.toFixed(2)}`;

    const gravity = 100;
    if (!inputState.gDown) {
        if (inputState.spaceDown && !inputState.shiftDown) {
            gameState.zee += (delta/1000) * gameState.fixedVel;
        }
        if (!inputState.spaceDown && inputState.shiftDown) {
            gameState.zee -= (delta/1000) * gameState.fixedVel;
        }
    } else {
        gameState.vee -= Math.sign(gameState.zee) * (delta/1000) * gravity;
        gameState.zee += (delta/1000) * gameState.vee;
    }

    draw(gameState.zee);

    requestAnimationFrame(frame);
}
frame();
