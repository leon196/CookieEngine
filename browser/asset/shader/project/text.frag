
uniform sampler2D textTexture;
uniform float time;
varying vec2 vUv;

void main()	{
	vec2 uv = vUv;
	vec4 color = texture2D(textTexture, uv);

	// fire
	vec3 vPos = vec3(vUv.xyy)*10.;
	float noisy = noiseIQ(vPos)*fbm(vPos*2.);
	float ratio = .5+.5*sin(time+noisy*3.);
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	color.a *= 1.-smoothstep(.9,.95,ratio);

	gl_FragColor = color;
}
