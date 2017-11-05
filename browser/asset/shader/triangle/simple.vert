
// attribute vec3 position
// attribute vec3 color
// attribute vec3 normal
// attribute vec2 uv
// uniform float frame;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main()	{
	vUv = uv;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
}