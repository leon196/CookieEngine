
varying vec3 vColor, vNormal, vView;

void main () {
	// float shade = abs(dot(vNormal, normalize(vView)));
	vec3 color = vColor;
	// float lod = 8.;
	// color = ceil(color * lod) / lod;
	gl_FragColor = vec4(color, length(vView));
}