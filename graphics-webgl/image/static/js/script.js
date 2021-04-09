const canv = document.querySelector("canvas");
rescaleCanvas(canv);
const gl = canv.getContext("webgl", {
    antialias: true,
});

const image = new Image();
image.src = "/static/img/giraffe.jpg";
image.onload = () => render(image);

// full pixel size
const FP = 2.0/canv.height;

function makeScene(w, h) {
    var nTriangles = 0;
    var positionArray = [];
    var texCoordArray = [];
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

    const x0 = -canv.width*FP/2 + 300*FP;
    const y0 = -1 + 100*FP;
    addRect(x0, y0, x0 + 500*FP, y0 + 700*FP);

    for (let i = 0; i < positionArray.length/2; i++) {
        var x = positionArray[2*i];
        var y = positionArray[2*i+1];
        x /= FP;
        y /= FP;
        x += canv.width/2;
        y += canv.height/2;
        x /= w;
        y /= h;
        texCoordArray.push(x, 1-y);
    }

    return {
        nTriangles: nTriangles,
        positionArray: new Float32Array(positionArray),
        texCoordArray: new Float32Array(texCoordArray),
    };
}

var program = createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

var screenXRatioUniformLocation = gl.getUniformLocation(program, "u_screenXRatio");
gl.uniform1f(screenXRatioUniformLocation, Math.min(1.0, canv.height/canv.width));
var screenYRatioUniformLocation = gl.getUniformLocation(program, "u_screenYRatio");
gl.uniform1f(screenYRatioUniformLocation, Math.min(1.0, canv.width/canv.height));

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);

var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
gl.enableVertexAttribArray(texCoordAttributeLocation);

function render(image) {
    var {nTriangles, positionArray, texCoordArray} = makeScene(image.width, image.height);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoordArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.viewport(0, 0, canv.width, canv.height);
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3*nTriangles);
}

