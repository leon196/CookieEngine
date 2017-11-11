
uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;

void main()	{
	float shade = abs(dot(normalize(cameraPosition - vPosition), normalize(vNormal)));
	// shade = mix(.8, 1., shade);
	gl_FragColor = vec4(vec3(shade), 1.);
}
