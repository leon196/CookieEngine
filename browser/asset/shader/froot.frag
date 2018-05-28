
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;

void main () {
	if (length(vUv) - 1. > 0.) discard;
	vec3 color = vColor;
	// float lod = 8.;
	// color = ceil(color * lod) / lod;
	gl_FragColor = vec4(color, length(vView));
}