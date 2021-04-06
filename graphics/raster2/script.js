const canv = document.querySelector("canvas");
rescaleCanvas(canv);
const gl = canv.getContext("webgl", {
    antialias: true,
});

const FULL_PIXEL = 2/canv.height; // assume canvas has smaller height than width..
const HALF_PIXEL = FULL_PIXEL/2;
const QUAR_PIXEL = FULL_PIXEL/4;
const FP = FULL_PIXEL;
const HP = HALF_PIXEL;
const QP = QUAR_PIXEL;
const EP = QP/2;

// make cube of sidelength `scale`
function makeScene() {
    var positionArray = [];
    var nTriangles = 0;
    function addRect(x0, y0, x1, y1) {
        positionArray.push(...[x0, y0]);
        positionArray.push(...[x0, y1]);
        positionArray.push(...[x1, y1]);
        positionArray.push(...[x0, y0]);
        positionArray.push(...[x1, y1]);
        positionArray.push(...[x1, y0]);
        nTriangles += 2;
    }
    // from SW corner
    function addSquare1(x0, y0, s) {
        addRect(x0, y0, x0+s, y0+s);
    }
    // from center
    function addSquare2(x, y, s) {
        addSquare1(x-s/2, y-s/2, s);
    }

    // paint a certain pattern of centers of the quarter-pixels
    addSquare2(EP, HP+EP, 0.1*EP);
    addSquare2(HP-EP, EP, 0.1*EP);
    addSquare2(FP-EP, HP-EP, 0.1*EP);
    addSquare2(HP+EP, FP-EP, 0.1*EP);

    // paint surrounding pixels fully white
    const radius = 25;
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            if (x != 0 || y != 0) {
                addSquare1(x*FP, y*FP, FP);
            }
        }
    }

    return {
        nTriangles: nTriangles,
        positionArray: new Float32Array(positionArray),
    };
}

var program = createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

var positionBuffer = gl.createBuffer();

var {nTriangles, positionArray} = makeScene();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

var screenXRatioUniformLocation = gl.getUniformLocation(program, "u_screenXRatio");
gl.uniform1f(screenXRatioUniformLocation, Math.min(1.0, canv.height/canv.width));
var screenYRatioUniformLocation = gl.getUniformLocation(program, "u_screenYRatio");
gl.uniform1f(screenYRatioUniformLocation, Math.min(1.0, canv.width/canv.height));

gl.viewport(0, 0, canv.width, canv.height);
//gl.clearColor(1, 1, 1, 1.0);
gl.clearColor(0, 0, 0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3*nTriangles);
