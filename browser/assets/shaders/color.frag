
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying vec3 vColor;
varying vec3 vNormal;

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec4 color = vec4(vColor,1);
	gl_FragColor = color;
}