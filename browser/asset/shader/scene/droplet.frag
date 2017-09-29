
varying vec2 vAnchor;
varying float vSplash;
varying float vSplashRatio;

void main()	{
	float dist = length(vAnchor);
	float circle = abs(dist-.45);
	float thin = mix(0., .5 * (1.-vSplashRatio), vSplash);
	// circle += clamp(dist * 2.,0.,1.);
	dist = mix(-1., circle, vSplash);
	if (dist > thin) discard;
	vec4 color = vec4(1.-vSplash);
	color.rgb *= 1.-clamp(length(vAnchor+vec2(0.,-.25))/2., 0., 1.);
	gl_FragColor = color;
}