
varying vec2 vUv;
varying vec3 vColor, vNormal, vView;
varying float vSplashing;

void main () {
	// float shade = abs(dot(vNormal, normalize(vView)));
	if (vSplashing == 1. && (length(vUv)-.9) >.05) {
		discard;
	}
	gl_FragColor = vec4(vColor, length(vView));
}