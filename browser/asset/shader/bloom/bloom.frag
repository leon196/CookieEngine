uniform float tone;
uniform float strength;
uniform sampler2D texBase;
uniform sampler2D texBlur;

varying vec2 vUv;

void main(void) {
  gl_FragColor = texture2D(texBase, vUv) * .5 + texture2D(texBlur, vUv) * 1.5;
}
