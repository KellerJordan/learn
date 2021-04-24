var curr = performance.now();
function logTimeSince(msg) {
    var next = performance.now();
    console.log(msg, next-curr);
    curr = next;
}

const canv = document.querySelector("#canv");
const gl = canv.getContext("webgl", {
    //antialias: false,
});
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

var colorBuffer = gl.createBuffer();
var positionBuffer = gl.createBuffer();

var n_cubes = 0;
var position_data = [];
var color_data = [];

// fast unrolled version: 10x faster
function bufferCube(c, s) {
    n_cubes += 1;
    var x = c[0], y = c[1], z = c[2];
    position_data.push(...[
        x-s,y-s,z-s,x+s,y-s,z-s,x-s,y+s,z-s,x+s,y+s,z-s,x-s,y+s,z-s,x+s,y-s,z-s,
        x-s,y-s,z-s,x-s,y+s,z-s,x-s,y-s,z+s,x-s,y+s,z+s,x-s,y-s,z+s,x-s,y+s,z-s,
        x-s,y-s,z+s,x-s,y+s,z+s,x+s,y-s,z+s,x+s,y+s,z+s,x+s,y-s,z+s,x-s,y+s,z+s,
        x+s,y-s,z-s,x+s,y-s,z+s,x+s,y+s,z-s,x+s,y+s,z+s,x+s,y+s,z-s,x+s,y-s,z+s,
        x-s,y+s,z-s,x+s,y+s,z-s,x-s,y+s,z+s,x+s,y+s,z-s,x+s,y+s,z+s,x-s,y+s,z+s,
        x-s,y-s,z-s,x-s,y-s,z+s,x+s,y-s,z-s,x+s,y-s,z-s,x-s,y-s,z+s,x+s,y-s,z+s
    ]);
}

logTimeSince("setup");

var n2_side = 38;
var big_side = 5;
for (var x = -n2_side; x <= n2_side; x++) {
    for (var y = -n2_side; y <= n2_side; y++) {
        for (var z = -n2_side; z <= n2_side; z++) {
            var center = [x, y, z].map(v => big_side * v/n2_side);
            bufferCube(center, 0.10 * big_side/2 * 1/n2_side);
        }
    }
}
console.log("N_cubes =", n_cubes);
console.log("N_coords =", position_data.length);

logTimeSince("geometry");

function makeCubeColor() {
    let r = Math.random(), g = Math.random(), b = Math.random();
    //r = g = b = 0.5;
    return [
        r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
        r, g, b, r, g, b, r, g, b, r, g, b, r, g, b, r, g, b,
    ]
}
for (var i = 0; i < n_cubes; i++) {
    color_data.push(...makeCubeColor());
}

logTimeSince("color");

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_data), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);

logTimeSince("buffering");

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

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var colorAttribLocation = gl.getAttribLocation(program, "a_color");
var rotTransformUniformLocation = gl.getUniformLocation(program, "u_rotTransform");
var r2cTransformUniformLocation = gl.getUniformLocation(program, "u_r2cTransform");
var myPositionUniformLocation = gl.getUniformLocation(program, "u_myPosition");
var screenZUniformLocation = gl.getUniformLocation(program, "u_screenZ");

gl.useProgram(program);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var size = 3;
var type = gl.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

gl.enableVertexAttribArray(colorAttribLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);

function loadAndDraw(theta) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // these gets transposed
    gl.uniformMatrix3fv(rotTransformUniformLocation, false, new Float32Array([
        Math.cos(theta), 0, Math.sin(theta),
        0, 1, 0,
        -Math.sin(theta), 0, Math.cos(theta),
    ]));
    // or rather is entered as M11, M21, M31, M41, M12, M22, M32, ...
    // so this ``sets w to z", not the other way
    gl.uniformMatrix4fv(r2cTransformUniformLocation, false, new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 1,
        0, 0, -1.0, 0,
    ]));
    gl.uniform1f(screenZUniformLocation, 1.0);
    gl.uniform3f(myPositionUniformLocation, 0, 0, -6.0);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3 * 2 * 6 * n_cubes;
    gl.drawArrays(primitiveType, offset, count);
}

var theta = 0;
setInterval(() => {
    theta += 0.001 * (2*Math.PI/60);
    loadAndDraw(theta);
}, 1000/60);
