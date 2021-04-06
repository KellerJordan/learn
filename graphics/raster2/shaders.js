const vertexShaderSource = `
uniform float u_screenXRatio;
uniform float u_screenYRatio;

attribute vec3 a_position;

vec3 position;

void main() {
    position = vec3(a_position.x * u_screenXRatio, a_position.y * u_screenYRatio, a_position.z);
    gl_Position = vec4(position, 1);
}
`;

const fragmentShaderSource = `
precision mediump float;

void main() {
    gl_FragColor = vec4(1, 1, 1, 1);
    //gl_FragColor = vec4(0, 0, 0, 1);
}
`;

