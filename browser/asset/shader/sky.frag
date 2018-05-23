
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

const vec3 blueLight = vec3(0.18,0.263,0.447);
const vec3 blue = vec3(0.306,0.388,0.557);

void main () {
	vec3 view = normalize(vView);
	vec3 color = view*.5+.5;
	color = mix(blueLight, vec3(1), max(view.y, 0.));
	gl_FragColor = vec4(color, 1);
}