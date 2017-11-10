
uniform float time;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;
varying float vDepth;
varying float vSeed;

void main()	{
	// dot line shape
	float dist = length(vAnchor+.5);
	if (fract(vAnchor.y*10.) > .1+waveB*.1) discard;

	float shade = dot(vView, vNormal)*.5+.5;
	gl_FragColor = vec4(vec3(1.)*(.8+.2*shade), vDepth);
}
