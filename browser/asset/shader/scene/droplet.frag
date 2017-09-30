
varying vec2 vAnchor;
varying float vSplash;
varying float vSplashRatio;

void main()	{
	float dist = length(vAnchor);
	float circle = abs(dist-.45);
	float thin = mix(0., .2 * (1.-vSplashRatio), vSplash);
	// circle += clamp(dist * 2.,0.,1.);
	dist = mix(-1., circle, vSplash);
	if (dist > thin) discard;
	vec4 color = vec4(1.);//-vSplash);
	float shade = 1.-clamp(length(vAnchor+vec2(0.,-.25))/2., 0., 1.);
	shade *= mix(1., 1.-clamp(dist*10., 0., 1.), vSplash);
	color.rgb *= shade;
	gl_FragColor = color;
}