
uniform float time;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;

void main()	{
	// vec3 color = vDirection * .5 + .5;
	// float shade = (1.-abs(vAnchor.x)) * (1.-abs(vAnchor.y));
	float shade = 1.;
	shade *= dot(-vView, vNormal)*.5+.5;
	vec3 color = vec3(1) * shade;
	gl_FragColor = vec4(color, 1);
}
