
varying vec2 vUv;

void main () {
	vUv = uv;
	gl_Position = vec4(uv * 2. - 1., 0., 1.);
}