const vertexShaderSource = `
uniform float u_screenXRatio;
uniform float u_screenYRatio;

attribute vec3 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

vec3 position;

void main() {
    position = vec3(a_position.x * u_screenXRatio, a_position.y * u_screenYRatio, a_position.z);
    v_texCoord = a_texCoord;
    //v_texCoord = vec2(0.5 + 0.5 * position.x, 0.5 - 0.5 * position.y);
    gl_Position = vec4(position, 1);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
    //gl_FragColor = vec4(1, 1, 1, 1);
    //gl_FragColor = vec4(0, 0, 0, 1);
    gl_FragColor = texture2D(u_image, v_texCoord);
}
`;

