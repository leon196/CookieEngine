
uniform float time;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;
varying float vDepth;
varying float vSeed;
varying float vShould;

void main()	{
	float dist = length(vAnchor+.5);
	float should = step(.1, vShould);
	dist -= .25 * should;
	// dist = -dist + smoothstep(.0, .4, dist);
	// dist = 1.- dist;
	if (abs(dist) > mix(.5, .02, should)) discard;
	// vec3 color = vDirection * .5 + .5;
	// float shade = (1.-abs(vAnchor.x)) * (1.-abs(vAnchor.y));
	vec3 color = vec3(1) * (.9+.1*vSeed);
	// color *= vAnchor.y;
	float depth = vDepth;
	// depth += fade;
	gl_FragColor = vec4(color, depth);
}
