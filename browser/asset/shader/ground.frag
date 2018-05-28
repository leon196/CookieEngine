uniform sampler2D heightmap, heightNormalMap;

varying vec2 vUv;
varying vec3 vView, vPosWorld;

const vec3 brownLight = vec3(1,0.886,0.667);
const vec3 brownDark = vec3(0.502,0.357,0.082);
const vec3 blueLight = vec3(0.165,0.329,0.431);
const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);

void main () {
	vec3 normal = texture2D(heightNormalMap, vUv).xyz;
	float shade = dot(vec3(1,0,0), normal) * .5 + .5;
	float height = texture2D(heightmap, vUv).x;
	shade *= height;

	float lod = 50.;
	shade = ceil(shade * lod) / lod;
	vec3 color = mix(brownLight, brownDark, shade);
	color = mix(blueLight, color, smoothstep(80., 30., length(vPosWorld)));

	// color *= height;

	gl_FragColor = vec4(color, length(vView));
}