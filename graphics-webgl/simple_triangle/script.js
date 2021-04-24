const canv = document.querySelector("#canv");
const gl = canv.getContext("webgl", {
    //antialias: false,
});

// load buffers
var extraBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, extraBuffer);
const r = Math.random;
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    r(), r(), r(), 1,
    r(), r(), r(), 1,
    r(), r(), r(), 1,
    r(), r(), r(), 1,
    r(), r(), r(), 1,
    r(), r(), r(), 1
]), gl.STATIC_DRAW);

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
    0.95, 0.95,
    0.9, 0.9,
    0.8, 0.98,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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

var extraAttributeLocation = gl.getAttribLocation(program, "a_extra");
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.enableVertexAttribArray(extraAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, extraBuffer);
gl.vertexAttribPointer(extraAttributeLocation, 4, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var size = 2;
var type = gl.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);
