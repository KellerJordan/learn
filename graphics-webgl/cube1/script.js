var curr = performance.now();
function logTimeSince(msg) {
    var next = performance.now();
    console.log(msg, parseInt(next-curr).toString()+"ms");
    curr = next;
}

const canv = document.querySelector("#canv");
const gl = canv.getContext("webgl", {
    //antialias: false,
});
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

// auto resize canvas
canv.width = window.innerWidth;
canv.height = window.innerHeight;

// event listeners save input to an object which is read by game loop
const inputState = {};
const inputKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "Space", "ShiftLeft"];
for (let k of inputKeys) {
    inputState[k] = false;
}
inputState["clientX"] = screen.width/2;
inputState["clientY"] = screen.height/2;
inputState["escapeToggle"] = false;
window.addEventListener("keydown", e => {
    if (inputKeys.includes(e.code)) {
        inputState[e.code] = true;
    }
    if (e.code == "Escape") {
        inputState["escapeToggle"] = !inputState["escapeToggle"];
    }
});
window.addEventListener("keyup", e => {
    if (inputKeys.includes(e.code)) {
        inputState[e.code] = false;
    }
});
window.addEventListener("mousemove", e => {
    inputState["clientX"] = e.clientX;
    inputState["clientY"] = e.clientY;
});

logTimeSince("setup");


// makes a scene of cube(s)
var numCubeTriangles = 0;
function makeScene() {
    var position_data = [];
    var color_data = [];
    function pushCube(x, y, z) {
        numCubeTriangles += 12;
        position_data.push(...[
            x-1,y-1,z-1,x+1,y-1,z-1,x-1,y+1,z-1,x+1,y+1,z-1,x-1,y+1,z-1,x+1,y-1,z-1,
            x-1,y-1,z-1,x-1,y+1,z-1,x-1,y-1,z+1,x-1,y+1,z+1,x-1,y-1,z+1,x-1,y+1,z-1,
            x-1,y-1,z+1,x-1,y+1,z+1,x+1,y-1,z+1,x+1,y+1,z+1,x+1,y-1,z+1,x-1,y+1,z+1,
            x+1,y-1,z-1,x+1,y-1,z+1,x+1,y+1,z-1,x+1,y+1,z+1,x+1,y+1,z-1,x+1,y-1,z+1,
            x-1,y+1,z-1,x+1,y+1,z-1,x-1,y+1,z+1,x+1,y+1,z-1,x+1,y+1,z+1,x-1,y+1,z+1,
            x-1,y-1,z-1,x-1,y-1,z+1,x+1,y-1,z-1,x+1,y-1,z-1,x-1,y-1,z+1,x+1,y-1,z+1
        ]);
        /*
        var r = Math.random(), g = Math.random(), b = Math.random();
        color_data.push(...[
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        ]);
        */
       var r = Math.random;
       color_data.push(...Array(6).fill(0).map(() => Array(6).fill([r(), r(), r()])).flat(2));
    }
    pushCube(0, 2.0, 0);
    return [position_data, color_data];
}

var [position_data, color_data] = makeScene();
var cubePositionBuffer = gl.createBuffer();
var cubeColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_data), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);


// makes a 50x50 2d plane grid of checkered tiles
// will be visible only from above
var numGridTriangles = 0;
const gridRadius = 40;
function makeGrid() {
    var position_data = [];
    var color_data = [];
    for (let x = -gridRadius; x <= gridRadius; x++) {
        for (let z = -gridRadius; z <= gridRadius; z++) {
            numGridTriangles += 2;
            let tile_color = Math.abs(x + z) % 2 == 1 ? [0, 0, 0] : [1, 1, 1];
            // tile of two triangles facing up
            position_data.push(...[
                x-0.5,0,z-0.5, x+0.5,0,z-0.5, x+0.5,0,z+0.5,
                x+0.5,0,z+0.5, x-0.5,0,z+0.5, x-0.5,0,z-0.5,
            ]);
            color_data.push(...Array(6).fill(tile_color).flat(2));
        }
    }
    return [position_data, color_data];
}

var [position_data, color_data] = makeGrid();
var gridPositionBuffer = gl.createBuffer();
var gridColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, gridPositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_data), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, gridColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);


// run programs
function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
var vertexShader = createShader(gl.VERTEX_SHADER, document.querySelector("#vertex-shader-2d").text);
var fragmentShader = createShader(gl.FRAGMENT_SHADER, document.querySelector("#fragment-shader-2d").text);

function createProgram(vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
var program = createProgram(vertexShader, fragmentShader);
gl.useProgram(program);

var sceneTransformUniformLocation = gl.getUniformLocation(program, "u_sceneTransform");
var perspectiveXZTransformUniformLocation = gl.getUniformLocation(program, "u_perspectiveXZTransform");
var perspectiveYZTransformUniformLocation = gl.getUniformLocation(program, "u_perspectiveYZTransform");
var myPositionUniformLocation = gl.getUniformLocation(program, "u_myPosition");
var screenZUniformLocation = gl.getUniformLocation(program, "u_screenZ");
var viewportTransformUniformLocation = gl.getUniformLocation(program, "u_viewportTransform");

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var colorAttribLocation = gl.getAttribLocation(program, "a_color");

gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(colorAttribLocation);

function drawInit() {
    gl.uniform1f(screenZUniformLocation, 1.0);
}

const gameState = {
    x: 0,
    y: 2.0,
    z: -4.0,
    velocity: 2.50,
    // perspective xz-plane rotation
    phi: 0, 
    // perspective yz-plane rotation
    psi: 0,
    // object xz-plane rotation
    theta: 0,
};

function drawFrame() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.5, 0.0, 1.0);

    var w = gl.canvas.width;
    var h = gl.canvas.height;
    gl.viewport(0, 0, w, h);
    var xScale = w > h ? h/w : 1;
    var yScale = h > w ? h/w : 1;
    gl.uniformMatrix4fv(viewportTransformUniformLocation, false, new Float32Array([
        xScale, 0, 0, 0,
        0, yScale, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]));

    var {x, y, z, phi, psi, theta} = gameState;

    // position and perspective uniforms
    gl.uniform3f(myPositionUniformLocation, x, y, z);
    gl.uniformMatrix3fv(perspectiveXZTransformUniformLocation, false, new Float32Array([
        Math.cos(phi), 0, Math.sin(phi),
        0, 1, 0,
        -Math.sin(phi), 0, Math.cos(phi),
    ]));
    gl.uniformMatrix3fv(perspectiveYZTransformUniformLocation, false, new Float32Array([
        1, 0, 0,
        0, Math.cos(psi), Math.sin(psi),
        0, -Math.sin(psi), Math.cos(psi),
    ]));

    // cube scene transform matrix
    var scale = 1.5;
    gl.uniformMatrix3fv(sceneTransformUniformLocation, false, new Float32Array([
        Math.cos(theta), 0, Math.sin(theta),
        0, 1, 0,
        -Math.sin(theta), 0, Math.cos(theta),
    ]).map(v => v * scale));

    // draw cube scene
    gl.bindBuffer(gl.ARRAY_BUFFER, cubePositionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3*numCubeTriangles);

    // grid has no transform
    gl.uniformMatrix3fv(sceneTransformUniformLocation, false, new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ]));

    // draw the grid
    gl.bindBuffer(gl.ARRAY_BUFFER, gridPositionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, gridColorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3*numGridTriangles);
}

function runFrame() {
    // only register input if not in escape-menu
    if (!inputState.escapeToggle) {
        // update the perspective angles 
        gameState.phi = 2*Math.PI * (inputState.clientX / window.innerWidth - 0.5);
        gameState.psi = Math.PI/2 - Math.PI * inputState.clientY / window.innerHeight;

        // calculate the direction of movement relative to perspective
        if (inputState["KeyW"] || inputState["KeyA"] || inputState["KeyS"] || inputState["KeyD"]) {
            var faceVector = {x: 0, z: 0};
            if (inputState["KeyW"]) {
                faceVector.z += 1;
            }
            if (inputState["KeyA"]) {
                faceVector.x -= 1;
            }
            if (inputState["KeyS"]) {
                faceVector.z -= 1;
            }
            if (inputState["KeyD"]) {
                faceVector.x += 1;
            }
            var faceAngle = Math.atan2(faceVector.x, faceVector.z);
            var moveAngle = faceAngle + gameState.phi;
            // unit vector direction of movement
            var moveVector = {x: Math.sin(moveAngle), z: Math.cos(moveAngle)};
            gameState.x += (gameState.velocity / 60) * moveVector.x;
            gameState.z += (gameState.velocity / 60) * moveVector.z;
        }
        
        // vertical movement is independent
        var verticalMove = 0;
        if (inputState["Space"]) {
            verticalMove += 1;
        }
        if (inputState["ShiftLeft"]) {
            verticalMove -= 1;
        }
        gameState.y += (gameState.velocity / 60) * verticalMove;
    }

    // rotate the cube-scene
    gameState.theta += 2*Math.PI*0.09 / 60;

    drawFrame();
    requestAnimationFrame(runFrame);
}

logTimeSince("toDrawStart");

drawInit();
runFrame();
