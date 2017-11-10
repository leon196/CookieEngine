
uniform float time;

varying vec3 vView;
varying vec3 vNormal;
varying float vDepth;

void main()	{
	float shade = dot(vView, vNormal)*.5+.5;
	shade = .8 + .2 * shade;
	gl_FragColor = vec4(vec3(shade), vDepth);
}
