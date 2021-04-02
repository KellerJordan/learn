const vertexShaderSource = `
varying vec3 v_color;

attribute vec2 a_position;
attribute vec3 a_color;

uniform vec2 u_offset;

uniform float u_screenXRatio;
uniform float u_screenYRatio;
uniform float u_scale;

vec2 position;

void main() {
    v_color = a_color;
    position = u_offset + a_position;
    position = vec2(position.x * u_screenXRatio, position.y * u_screenYRatio);
    gl_Position = vec4(u_scale * position, 0, 1);
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec3 v_color;

void main() {
    gl_FragColor = vec4(v_color, 1);
}
`;

