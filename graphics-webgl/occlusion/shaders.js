const vertexShaderSource = `
varying vec3 v_color;

attribute vec4 a_position;
attribute vec3 a_color;

void main() {
    v_color = a_color;
    gl_Position = a_position;
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec3 v_color;

vec3 color;

void main() {
    //color = vec3(0.5*(cos(5.0 * 2.0 * 3.14159 * v_color.x)+1.0), 0.5, 0.5*(cos(15.0 * 2.0 * 3.14159 * v_color.y)+1.0));
    color = v_color;
    gl_FragColor = vec4(color, 1);
}
`;

