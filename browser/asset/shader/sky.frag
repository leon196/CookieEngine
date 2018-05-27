
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

const vec3 blue1 = vec3(0.165,0.329,0.431);
const vec3 blueLight = vec3(0.18,0.263,0.447);
const vec3 blue = vec3(0.306,0.388,0.557);
const vec3 blue2 = vec3(0.458, 0.862, 0.960);

void main () {
	vec3 view = normalize(vView);
	vec3 color = view*.5+.5;
	float shade = abs(view.y);
	shade *= fbm3(view * 3., 0., vec3(time*.5,0,0) * .5);
	float lod = 45.;
	// float dither = rand(vUv);
	// shade *= 1.+dither * .02;
	shade = ceil(shade * lod) / lod;
	color = mix(blue1, vec3(1), smoothstep(.1,.6,shade));
	gl_FragColor = vec4(color, length(vView));
}