
varying vec3 vNormal;
varying vec3 vDirCamera;
varying vec3 vColor;
varying vec2 vAnchor;

void main()	{
	vec4 color = vec4(vColor, 1);
	// float shade = dot(-normalize(vNormal), normalize(vDirCamera))*.5+.5;
	// color.rgb *= .5+.5*shade;
	// color.rgb *= .5+.5*(1.-(sin(abs(vAnchor.x))*.5+.5));
	color.rgb *= .5 + .5 * (1.-smoothstep(0.5,1., abs(vAnchor.x)));
	gl_FragColor = color;
}