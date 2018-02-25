
varying vec3 vNormal;

void main () {
	vec3 color = vec3(1);
	float shade = dot(normalize(vNormal), vec3(0,0,1))*.5+.5;
	gl_FragColor = vec4(color * shade, 1);
}