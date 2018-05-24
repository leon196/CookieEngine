uniform float minBright;
uniform sampler2D texture;

varying vec2 vUv;

void main(void) {
  vec4 bright = max(vec4(0.0), (texture2D(texture, vUv) - .2));
  gl_FragColor = bright;
}
