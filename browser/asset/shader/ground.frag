
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

const vec3 brownLight = vec3(1,0.886,0.667);
const vec3 brownDark = vec3(0.502,0.357,0.082);
const vec3 blueLight = vec3(0.18,0.263,0.447);

void main () {
	vec3 normal = normalize(vNormal);
	float shade = dot(vec3(1,0,0), normal) * .5 + .5;
	float dither = rand(vUv);
	shade += dither * .02;
	float lod = 8.;
	shade = ceil(shade * lod) / lod;
	vec3 color = mix(brownLight, brownDark, shade);
	color = mix(blueLight, color, smoothstep(50., 10., length(vPosWorld)));
	gl_FragColor = vec4(color, 1);
}