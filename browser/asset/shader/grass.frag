
varying vec3 vColor, vNormal, vView;
varying vec2 vUv;

void main () {
	// float shade = abs(dot(vNormal, normalize(vView)));
	vec2 uv = vUv;
	float scale = 30.;
	float fade = 1.-uv.y;
	float stencil = mod(uv.x * scale, 1.)-fade;
	if (stencil < 0.) discard;
	gl_FragColor = vec4(vColor, length(vView));
}