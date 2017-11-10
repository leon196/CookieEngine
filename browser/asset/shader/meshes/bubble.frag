
uniform float time;

varying vec2 vAnchor;
varying float vDepth;
varying float vShould;

void main()	{

	// circle or bubble sphape
	float dist = length(vAnchor+.5);
	dist -= .25 * vShould;
	if (abs(dist) > mix(.5, .02, vShould)) discard;

	gl_FragColor = vec4(vec3(1), vDepth);
}
