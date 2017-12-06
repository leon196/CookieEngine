
uniform sampler2D bloodTexture;
uniform float time;
varying vec2 vUv;
varying vec3 vPos;
varying vec4 vColor;

void burn (inout vec4 color, vec3 seed) {
	float noisy = fbm(seed*3.);
	float ratio = .5+.5*sin(time+noisy*TAU);
	color.rgb *= (1.-smoothstep(.1,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.7,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.85,.95,ratio));
	color.a *= 1.-smoothstep(.8,.95,ratio);
}

void main()	{
	vec4 color = vColor;// * texture2D(bloodTexture, vUv/1.5+.17);

	burn(color, vPos);

	if (color.a < 0.5) discard;

	gl_FragColor = color;
}
