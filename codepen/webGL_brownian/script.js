"use strict"

function setGeometry(gl) {
  var positions = [
    -0.8, -0.8,
    +0.8, -0.8,
    -0.8, +0.8,
    +0.8, +0.8,
    -0.8, +0.8,
    +0.8, -0.8,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

function setColor(gl, colorData) {
  function processColor(r, g, b) {
    var logit = x => 0.5 * (1 + Math.tanh(0.5 * x))
    return [logit(r), logit(g), logit(b), 1];
  }
  
  var color1 = processColor(...colorData.slice(0, 3));
  var color2 = processColor(...colorData.slice(3, 6));
  var color3 = processColor(...colorData.slice(6, 9));
  var color4 = processColor(...colorData.slice(9, 12));
  var colors = [
    ...color1,
    ...color2,
    ...color3,
    ...color4,
    ...color3,
    ...color2,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

function main() {
  var canvas = document.querySelector("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  var positionLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  
  function randArr(n) {
    var result = [];
    for (var ii = 0; ii < n; ii++) {
      result.push(2 * Math.random() - 1);
    }
    return result;
  }
  
  var colorData = randArr(12);
  // Do a Brownian motion
  setInterval(() => {
    var newData = randArr(12);
    for (var ii = 0; ii < 12; ii++) {
      colorData[ii] += 10 * newData[ii] / 60;
    }
    setColor(gl, colorData);
    drawScene();
  }, 1000/60);
  
  setInterval(() => console.log(colorData), 1000);
  
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.3, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
    
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var size = 4;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
      colorLocation, size, type, normalize, stride, offset);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}


window.addEventListener("load", function setupWebGL (evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  main();
}, false);
