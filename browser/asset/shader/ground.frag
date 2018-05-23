
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

void main () {
	vec3 normal = normalize(vNormal);
	float shade = dot(vec3(1,0,0), normal) * .5 + .5;
	float dither = rand(vUv);
	shade += dither * .02;
	float lod = 8.;
	shade = ceil(shade * lod) / lod;
	vec3 color = vec3(shade);
	color *= smoothstep(50., 10., length(vPosWorld));
	gl_FragColor = vec4(color, 1);
}