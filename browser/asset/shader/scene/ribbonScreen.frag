
uniform float time;
uniform sampler2D titleText;
uniform sampler2D creditText;

varying vec2 vUv;

void main()	{
	vec2 uv = vUv;
	uv.x = uv.x+time*.2-6.;
	vec4 title = texture2D(titleText, uv);
	vec4 credit = texture2D(creditText, uv);
	vec4 color = mix(title, credit, step(mod(uv.x, 2.), 1.));
	// vec4 color = vec4(1)*sin(uv.x*TAU);
	float lum = 1.-luminance(color.rgb);
	lum *= step(uv.x, 1.)*step(-1., uv.x);
	// if (lum > .1) discard;
	// gl_FragColor = vec4(vec3(1.-lum), 1.);
	gl_FragColor = vec4(vec3(lum), lum);
}
