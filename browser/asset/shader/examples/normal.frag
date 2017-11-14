
varying vec3 vNormal;

void main()	{
	gl_FragColor = vec4(vNormal * .5 + .5, 0);
}
