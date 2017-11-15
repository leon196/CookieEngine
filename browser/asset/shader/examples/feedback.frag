
uniform sampler2D ExamplesScene;
uniform sampler2D loopback;
uniform vec2 resolution;
uniform float time;
uniform float FeedbackFade;
varying vec2 vUv;

#define wave smoothstep(-.5,1.,sin(2.*time*PI2))

void main ()	{
	vec4 color = texture2D(ExamplesScene, vUv);

	// feedback
	vec4 loop = texture2D(loopback, vUv);
	vec2 pixel = 1./resolution;
	vec2 uv = vUv;
	float noisy = noiseIQ(uv.xyy*10.);
	float a = noisy*PI2;
	uv += vec2(cos(a),sin(a))*pixel;
	loop = texture2D(loopback, uv);
	float dist = colorDistance(color,loop);
	float update = smoothstep(.2,.3,dist);
	update *= step(.01,luminance(color.rgb));
	update = clamp(update,0.,1.);
	color = mix(loop*FeedbackFade, color, update);

	gl_FragColor = color;
}
