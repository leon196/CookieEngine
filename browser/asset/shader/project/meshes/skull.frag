
uniform sampler2D textTexture;
uniform float time;
uniform float Skull;
varying vec3 vPos;
varying vec4 vColor;

void burn (inout vec4 color, vec3 seed) {
	float noisy = fbm(seed*3.);
	float ratio = .5+.5*sin(time+noisy*TAU);
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	color.a *= 1.-smoothstep(.9,.95,ratio);
}

void main()	{
	vec4 color = vColor;

	color *= Skull;

	gl_FragColor = color;
}
