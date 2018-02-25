
uniform sampler2D texture;
varying vec3 vNormal;
varying vec2 vUv;

void main () {
	vec3 color = texture2D(texture, vUv).rgb;
	color = fract(abs(color));
	float shade = dot(normalize(vNormal), vec3(0,0,1))*.5+.5;
	gl_FragColor = vec4(color * shade, 1);
}