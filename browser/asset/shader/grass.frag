
varying vec3 vColor, vNormal, vView;

void main () {
	// float shade = abs(dot(vNormal, normalize(vView)));
	gl_FragColor = vec4(vColor, length(vView));
}