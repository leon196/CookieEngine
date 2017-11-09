
uniform float time;
uniform float blendLines;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;
varying float vDepth;
varying float vSeed;

void main()	{
	float dist = length(vAnchor+.5);
	if (fract(vAnchor.y*20.+time) > .2) discard;
	// dist = -dist + smoothstep(.2, .4, dist);
	// dist = 1.- dist;
	// if (dist > .5) discard;
	// vec3 color = vDirection * .5 + .5;
	// float shade = (1.-abs(vAnchor.x)) * (1.-abs(vAnchor.y));
	float shade = 1.;
 shade *= dot(vView, vNormal)*.5+.5;
	// shade *= vAnchor.y;
	vec3 color = vec3(1.)*blendLines;// * (.5+.5*shade);// * vAnchor.y;
	// color *= step(.5,fract(vAnchor.y*100.));
	float depth = vDepth;
	// depth *= vAnchor.y;

	gl_FragColor = vec4(color, depth);
}
