"use strict"

function makeRect(x1, y1, x2, y2) {
  var positions = [
    x1, y1,
    x2, y1,
    x1, y2,
    x2, y2,
    x1, y2,
    x2, y1,
  ];
  return positions;
}

function setGeometry(gl, res) {
  var tr = x => 0.8 * (2 * x - 1);
  
  var positions = [];
  var n = res;
  for (var ii = 0; ii < n; ii++) {
    for (var jj = 0; jj < n; jj++) {
      positions = positions.concat(
        makeRect(tr(ii/n), tr(jj/n), tr((ii+1)/n), tr((jj+1)/n)));
    }
  }
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

function main() {
  var canvas = document.querySelector("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  var positionLocation = gl.getAttribLocation(program, "a_position");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  var max_res = 50;
  var res = 1;
  setInterval(() => {
    res = 1 + (res + 1) % max_res;
    setGeometry(gl, res);
  
    drawScene();
  }, 100);
  
  
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

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * (res * res);
    gl.drawArrays(primitiveType, offset, count);
  }
}


window.addEventListener("load", function setupWebGL (evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  main();
}, false);
