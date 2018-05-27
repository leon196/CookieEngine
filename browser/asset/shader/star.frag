
varying vec2 vUv;
varying vec3 vColor, vNormal, vView;

void main () {
	if (length(vUv)-.9 >.05) {
		discard;
	}
	gl_FragColor = vec4(vColor, length(vView));
}