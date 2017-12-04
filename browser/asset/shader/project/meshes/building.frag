uniform float time;
uniform vec3 cameraPos;
varying vec2 vUv;
varying vec3 vPos;
varying vec4 vColor;

void burn (inout vec4 color, vec3 seed) {
	float noisy = fbm(seed);
	float ratio = .5+.5*sin(time+noisy*10.);
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.9,.99,ratio));
	// color.a *= 1.-smoothstep(.9,.95,ratio);
}

void main()	{
	vec4 color = vColor;
	// burn(color, vPos*3.);
	color.a = length(cameraPos-vPos);
	gl_FragColor = color;
}
