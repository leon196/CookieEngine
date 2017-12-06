
uniform sampler2D textTexture;
uniform float time;
uniform float TextIN, TextOUT;
varying vec2 vUv;

const vec4 red = vec4(0.607, 0.011, 0.011, 1);

void burn (inout vec4 color, vec2 uv) {
	vec3 seed = vec3(uv.xyy)*10.;
	float noisy = noiseIQ(seed)*fbm(seed*3.);
	float ratio = .5+.5*sin(time*.3+noisy*3.);
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	color.a *= 1.-smoothstep(.9,.95,ratio);
}

void main()	{
	vec2 uv = vUv;
	vec4 color = vec4(0);

	vec4 white = texture2D(textTexture, uv);

	color = mix(color, red, white.a);

	// burn(color, uv);

	// uv -= .5;
	// uv *= .99;
	// uv += .5;
	// vec4 black = texture2D(textTexture, uv);
	// black.rgb = 1.-black.rgb;
	// color = mix(black, white, white.a);

	color.a *= TextIN;
	color.a *= 1.-TextOUT;

	gl_FragColor = color;
}
