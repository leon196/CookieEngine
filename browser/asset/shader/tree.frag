
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

const vec3 greenLight = vec3(0.769,0.906,0.604);
const vec3 greenDark = vec3(0.278,0.455,0.075);
const vec3 brownLight = vec3(1,0.886,0.667);
// const vec3 brownLight = vec3(0.502,0.357,0.082);
const vec3 brownDark = vec3(0.333,0.22,0);

void main () {

	// vec3 color = vNormal * .5 + .5;
	float shade = dot(normalize(vec3(1,1,0)), vNormal)*.5+.5;
	shade *= .5+.5*sin(vUv.x * 20.+sin(vUv.y*10.)*.25);
	// float dither = rand(vUv);
	// shade += dither * .02;
	float lod = 8.;
	shade = ceil(shade * lod) / lod;
	// shade *= smoothstep(.0, .5, length(vPosWorld.xz));
	vec3 color = mix(brownDark, brownLight, shade);
	gl_FragColor = vec4(color, length(vView));
}