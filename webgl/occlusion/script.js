const canv = document.querySelector("canvas");
rescaleCanvas(canv);
const gl = canv.getContext("webgl");
gl.enable(gl.DEPTH_TEST);

function makeScene() {
    var positionArray = [];
    var colorArray = [];
    positionArray.push(...[
        0, 1, 0.5,
        1, 1, 0.5,
        0, 0, -0.5,
        0, 0, 0.5,
        1, 0, 0.5,
        0, 1, -0.5,
    ]);
    const r = Math.random;
    colorArray.push(...[
        Array(3).fill([r(), r(), r()]),
        Array(3).fill([r(), r(), r()]),
    ].flat(2));
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
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

var screenXRatioUniformLocation = gl.getUniformLocation(program, "u_screenXRatio");
gl.uniform1f(screenXRatioUniformLocation, Math.min(1.0, canv.height/canv.width));
var screenYRatioUniformLocation = gl.getUniformLocation(program, "u_screenYRatio");
gl.uniform1f(screenYRatioUniformLocation, Math.min(1.0, canv.width/canv.height));

var scaleUniformLocation = gl.getUniformLocation(program, "u_scale");
var offsetUniformLocation = gl.getUniformLocation(program, "u_offset");

gl.viewport(0, 0, canv.width, canv.height);
gl.clearColor(0, 1.0, 0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const zee = 1.0;
gl.uniform1f(scaleUniformLocation, 1/zee);
const x = 0.0;
const y = 0.0;
gl.uniform2f(offsetUniformLocation, x, y);

gl.drawArrays(gl.TRIANGLES, 0, 6);
