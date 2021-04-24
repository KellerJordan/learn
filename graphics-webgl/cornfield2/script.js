const N2_SIDE = 20; 
const SEPARATION = 2 * 1/0.2;
const BIG_SIDE = 2;

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

var buffers = [
    {
        position: gl.createBuffer(),
        color: gl.createBuffer(),
        n_cubes: 0,
    },
    {
        position: gl.createBuffer(),
        color: gl.createBuffer(),
        n_cubes: 0,
    },
]

logTimeSince("setup");

function makeSection(param) {
    var n_cubes = 0;
    var position_data = [];
    var color_data = [];
    function pushCube(x, y, z) {
        n_cubes += 1;
        position_data.push(...[
            x-1,y-1,z-1,x+1,y-1,z-1,x-1,y+1,z-1,x+1,y+1,z-1,x-1,y+1,z-1,x+1,y-1,z-1,
            x-1,y-1,z-1,x-1,y+1,z-1,x-1,y-1,z+1,x-1,y+1,z+1,x-1,y-1,z+1,x-1,y+1,z-1,
            x-1,y-1,z+1,x-1,y+1,z+1,x+1,y-1,z+1,x+1,y+1,z+1,x+1,y-1,z+1,x-1,y+1,z+1,
            x+1,y-1,z-1,x+1,y-1,z+1,x+1,y+1,z-1,x+1,y+1,z+1,x+1,y+1,z-1,x+1,y-1,z+1,
            x-1,y+1,z-1,x+1,y+1,z-1,x-1,y+1,z+1,x+1,y+1,z-1,x+1,y+1,z+1,x-1,y+1,z+1,
            x-1,y-1,z-1,x-1,y-1,z+1,x+1,y-1,z-1,x+1,y-1,z-1,x-1,y-1,z+1,x+1,y-1,z+1
        ]);
        var r = Math.random(), g = Math.random(), b = Math.random();
        color_data.push(...[
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
            r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        ]);
    }
    var n2_side = N2_SIDE;
    var s = SEPARATION;
    for (var x = param.x_start; x <= param.x_end; x++) {
        for (var y = -n2_side; y <= n2_side; y++) {
            for (var z = -n2_side; z <= n2_side; z++) {
                pushCube(s*x, s*y, s*z);
            }
        }
    }
    return [n_cubes, position_data, color_data];
}

var [n_cubes, position_data, color_data] = makeSection({x_start: 0, x_end: 4});
gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0].position);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_data), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0].color);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);
buffers[0].n_cubes = n_cubes;

/*
var [n_cubes, position_data, color_data] = makeSection({x_start: 1, x_end: 20});
gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1].position);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_data), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1].color);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);
buffers[1].n_cubes = n_cubes;
*/

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

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var colorAttribLocation = gl.getAttribLocation(program, "a_color");
var vTransformUniformLocation = gl.getUniformLocation(program, "u_vTransform");
var r2cTransformUniformLocation = gl.getUniformLocation(program, "u_r2cTransform");
var myPositionUniformLocation = gl.getUniformLocation(program, "u_myPosition");
var screenZUniformLocation = gl.getUniformLocation(program, "u_screenZ");
var xShiftUniformLocation = gl.getUniformLocation(program, "u_xShift");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(colorAttribLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0].position);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0].color);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

function drawInit() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // or rather is entered as M11, M21, M31, M41, M12, M22, M32, ...
    // so this ``sets w to z", not the other way
    gl.uniformMatrix4fv(r2cTransformUniformLocation, false, new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 1,
        0, 0, -1.0, 0,
    ]));
    gl.uniform1f(screenZUniformLocation, 1.0);
    gl.uniform3f(myPositionUniformLocation, 0, 0, -4.0);
}

var theta = 0;
function loadAndDraw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // these gets transposed, i.e. are entered column by column
    var scale = BIG_SIDE / (N2_SIDE * SEPARATION);
    gl.uniformMatrix3fv(vTransformUniformLocation, false, new Float32Array([
        Math.cos(theta), 0, Math.sin(theta),
        0, 1, 0,
        -Math.sin(theta), 0, Math.cos(theta),
    ].map(x => x*scale)));

    for (var i = -N2_SIDE/5; i <= N2_SIDE/5; i++) {
        var x = 5 * i;
        gl.uniform1f(xShiftUniformLocation, SEPARATION*x);
        gl.drawArrays(gl.TRIANGLES, 0, 36*buffers[0].n_cubes);
    }
}

function runFrames() {
    theta += 0.05 * (2*Math.PI/60);
    loadAndDraw();
    requestAnimationFrame(runFrames);
}

logTimeSince("toDrawStart");

drawInit();
runFrames();
