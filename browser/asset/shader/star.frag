
varying vec2 vUv;
varying vec3 vColor, vNormal, vView;

void main () {
	// if (length(vUv)-.9 >.05) {
	// 	discard;
	// }
	// vec3 color = vec3(.1 / max(0.,length(vUv)-.5));
	gl_FragColor = vec4(vColor, length(vView));
}