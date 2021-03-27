function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    success = gl.getShaderParameter(shader, gl.DELETE_STATUS);
    if (!success) {
        console.log("Failed to delete unsuccessfully created shader.");
    }
}

function createProgram(gl, vertexShader, fragmentShader) {
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
    success = gl.getProgramParameter(shader, gl.DELETE_STATUS);
    if (!success) {
        console.log("Failed to delete unsuccessfully created program.");
    }
}

function createProgramFromSources(gl, vertexSource, fragmentSource) {
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
    return program;
}

function rescaleCanvas(canv, dpi) {
    if (!dpi) {
        dpi = window.devicePixelRatio;
    }
    var width = window.innerWidth;
    var height = window.innerHeight;
    canv.width = dpi * width;
    canv.height = dpi * height;
    canv.style.width = width + "px";
    canv.style.height = height + "px";
}

