"use strict"

function transform(positions, offset, scale) {
  for (var i = 0; i < positions.length; i++) {
    positions[i] = scale * positions[i] + offset[i % 2];
  }
  return positions;
}

/**
 * Generate sierpinkski triangle
 * Takes integer depth
 * Returns N x 2 array of 2d vertices to draw
 */
function generateSierpinkski(depth) {
  if (depth <= 0) {
    return [
      0, 0,
      0.5, 0.865,
      1, 0,
    ];
  }
  else {
    var positions = [];
    positions = positions.concat(transform(
      generateSierpinkski(depth-1), [0.0, 0.0], 0.5));
    positions = positions.concat(transform(
      generateSierpinkski(depth-1), [0.25, 0.433013], 0.5));
    positions = positions.concat(transform(
      generateSierpinkski(depth-1), [0.5, 0.0], 0.5));
    return positions;
  }
}

function main() {
  var canvas = document.querySelector("canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var depth = 7;
  var scale = 1.5;
  var positions_arr = new Float32Array(transform(
    generateSierpinkski(depth), [scale * -0.5, scale * -0.43301], scale));
  
  gl.bufferData(gl.ARRAY_BUFFER, positions_arr, gl.STATIC_DRAW);
  var max_offset = 3**depth;
  var max_count = 200;
  var offset = 0;
  var count;
  
  var frameRate = 600;
  var frameDuration = Math.floor(1000/frameRate);
  
  setInterval(function() {
    offset = (offset + 1) % max_offset;
    count = Math.min(200, max_offset - offset);
    drawScene(3 * offset, 3 * count);
  }, frameDuration);
  
  function drawScene(offset, count) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.3, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, 0);

    var primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, offset, count);
  }
}


window.addEventListener("load", function setupWebGL(evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  main();
}, false);
