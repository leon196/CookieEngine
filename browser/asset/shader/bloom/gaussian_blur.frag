uniform vec2 resolution;
uniform vec2 direction;
uniform sampler2D texture;
uniform float weight[10];

varying vec2 vUv;

// #pragma glslify: blur13 = require('glsl-fast-gaussian-blur/13')
// #pragma glslify: blur9 = require('glsl-fast-gaussian-blur/9')
// #pragma glslify: blur5 = require('glsl-fast-gaussian-blur/5')

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

float gaussianPdf(in float x, in float sigma) {
  return 0.39894 * exp( -0.5 * x * x/(sigma * sigma))/sigma;
}

void main(void) {
  gl_FragColor = blur9(texture, vUv, resolution, direction);
}
