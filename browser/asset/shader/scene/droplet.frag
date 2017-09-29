
varying vec2 vAnchor;
varying float vSplash;

void main()	{
	float dist = length(vAnchor);
	float circle = abs(dist-.45);
	float thin = mix(0., 0.03, vSplash);
	// circle += clamp(dist * 2.,0.,1.);
	dist = mix(dist-.45, circle, vSplash);
	if (dist > thin) discard;
	vec4 color = vec4(1);
	color.rgb *= 1.-clamp(length(vAnchor+vec2(0.,-.25))/2., 0., 1.);
	gl_FragColor = color;
}