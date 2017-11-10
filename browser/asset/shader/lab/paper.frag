
uniform float time;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;
varying float vDepth;
varying float vSeed;

void main()	{
	float dist = length(vAnchor+.5);
	dist -= .25;
	// dist = -dist + smoothstep(.0, .4, dist);
	// dist = 1.- dist;
	if (abs(dist) > .02) discard;
	// vec3 color = vDirection * .5 + .5;
	// float shade = (1.-abs(vAnchor.x)) * (1.-abs(vAnchor.y));
	vec3 color = vec3(1) * (.9+.1*vSeed);
	// color *= vAnchor.y;
	float depth = vDepth;
	// depth += fade;
	gl_FragColor = vec4(color, depth);
}
