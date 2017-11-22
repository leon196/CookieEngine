uniform sampler2D cookieTexture;
uniform float time;
varying vec2 vUv;
varying vec3 vPos;

void burn (inout vec4 color, vec3 seed) {
	float noisy = noiseIQ(seed)*fbm(seed*3.);
	float ratio = .5+.5*sin(time+noisy*10.);
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.9,.99,ratio));
	// color.a *= 1.-smoothstep(.9,.95,ratio);
}

void main()	{
	vec4 color = texture2D(cookieTexture, vUv);
	burn(color, vPos*.2);
	gl_FragColor = color;
}
