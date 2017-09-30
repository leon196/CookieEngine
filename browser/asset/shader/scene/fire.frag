
varying vec2 vAnchor;
varying vec3 vVelocity;
varying vec3 vViewDir;

void main()	{
	if (length(vAnchor) > 0.45) discard;
	gl_FragColor = vec4(1);
	float ratio = dot(normalize(vViewDir), normalize(vVelocity))*.5+.5;
	gl_FragColor.rgb = mix(vec3(01, 0.898, 0.478), vec3(0.733, 0.160, 0.105), smoothstep(.1,.9,ratio));
}