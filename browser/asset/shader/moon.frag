
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

void main () {
	vec3 view = normalize(vView);
	vec3 color = view*.5+.5;

	float shade = 0.;
	const float count = 4.;
	for (float i = count; i > 0.; --i) {
		float r = i / count;
		// r = r*r;
		vec2 uv = vUv;
		float scale = 40. * r;
		float cell = 4. * r;
		float thin = .03 * r;
		float radius = 1. * r;
		uv += vec2(i)*.02 * r;
		uv = (uv-.5)*vec2(2.,1.)*scale * r;
		vec2 id = floor(uv/cell);
		float salt = .2+.8*rand(id);
		uv = mod(uv, cell) - cell/2.;
		// shade *= smoothstep(0., thin, abs(length(uv)-radius));
		shade += thin / abs(length(uv)-radius * salt);
	}

	
	float lod = 12.;
	shade = ceil(shade * lod) / lod;
	color = mix(vec3(0), vec3(1), shade);
	gl_FragColor = vec4(color, length(vView));
}