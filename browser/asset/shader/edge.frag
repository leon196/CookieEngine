
uniform float time;
uniform sampler2D frameEdge, passBlur;
uniform vec2 resolution;
varying vec2 vUv;

void main () {
	vec4 color = texture2D(frameEdge, vUv);
	float edgy = smoothstep(.0, .1, abs(luminance(edge(frameEdge, vUv, resolution*4.).rgb)));
	color *= edgy;
	// float dof = smoothstep(1., 10., color.a);
	// color *= mix(edgy, 1., dof);
	gl_FragColor = color;
}