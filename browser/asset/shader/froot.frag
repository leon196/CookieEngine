
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;
varying float vBounce;

void main () {
	vec2 uv = vUv;
	uv.y *= 1.15;
	uv.y += sqrt(abs(uv.x));
	uv.y -= .4;
	uv = mix(vUv, uv, vBounce);
	if (length(uv) - 1. > 0.) discard;
	vec3 color = vColor;
	// float lod = 8.;
	// color = ceil(color * lod) / lod;
	gl_FragColor = vec4(color, length(vView));
}