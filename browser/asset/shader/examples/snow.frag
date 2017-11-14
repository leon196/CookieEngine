
varying vec2 vUv;
varying vec2 vAnchor;

void main()	{
	float len = length(vAnchor);
	if (len > 0.5) discard;
	vec4 color = vec4(1);
	gl_FragColor = color;
}
