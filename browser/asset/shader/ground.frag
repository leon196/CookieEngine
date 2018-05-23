
varying vec2 vUv;
varying vec3 vNormal, vView;

void main () {

	float shade = dot(-normalize(vView), normalize(vNormal)) * .5 + .5;
	vec3 color = vec3(shade);
	// color = texture2D(noiseMap, vUv).rgb;
	gl_FragColor = vec4(color, 1);
}