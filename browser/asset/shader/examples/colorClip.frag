
varying vec4 vColor;
varying vec2 vAnchor;

void main()	{
	float dist = abs(vAnchor.x)-1.;
	dist *= abs(vAnchor.y)-1.;
	if (dist > 0.02) discard;
	gl_FragColor = vColor;
}
