const vertexShaderSource = `
uniform float u_screenXRatio;
uniform float u_screenYRatio;
uniform float u_scale;

uniform vec2 u_offset;

attribute vec3 a_position;
attribute vec3 a_color;

varying vec3 v_color;

vec3 position;

void main() {
    v_color = a_color;
    position = vec3(u_offset, 0.0) + a_position;
    position = vec3(position.x * u_screenXRatio, position.y * u_screenYRatio, position.z);
    gl_Position = vec4(u_scale * position, 1);
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

