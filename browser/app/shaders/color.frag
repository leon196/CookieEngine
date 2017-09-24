
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying vec3 vColor;

void main()	{
	// if (length(vAnchor) > 0.5) discard;
	vec4 color = vec4(1,0,0,1);
	gl_FragColor = color;
}