
uniform float time;
varying vec2 vUv;
varying vec3 vNormal, vView, vPosWorld;

const vec3 yellow = vec3(1,0.992,0.549);

void main () {
	vec3 view = normalize(vView);
	vec3 color = view*.5+.5;
	float shade = dot(view, vNormal);
	shade += sin(atan(vNormal.y, vNormal.z)*30. + time + shade) * .005;
	// shade = noiseIQ(vNormal * 3.);// * noiseIQ(vPosWorld / 3.);
	float lod = 12.;
	// float dither = rand(vUv);
	// shade *= 1.+dither * .02;
	shade = ceil(shade * lod) / lod;
	color = mix(yellow, vec3(1), shade);
	gl_FragColor = vec4(color, length(vView));
}