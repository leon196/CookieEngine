
uniform sampler2D frameBuffer;
uniform sampler2D loopback;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

#define wave smoothstep(-.5,1.,sin(2.*time*PI2))

void main ()	{
	vec4 color = texture2D(frameBuffer, vUv);
	vec4 loop = texture2D(loopback, vUv);
	vec2 pixel = 1./resolution;
	vec2 uv = vUv;
	float a = noiseIQ(uv.xyy*10.)*PI2;
	// float a = luminance(loop.rgb)*PI2;
	uv += vec2(cos(a),sin(a))*pixel;
	// uv += -normalize(uv-.5)*pixel*(2.+10.*wave);
	loop = texture2D(loopback, uv);

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.3,vignette);

	// color = loop * .9
	float dist = colorDistance(color,loop);
	float update = smoothstep(.2,.3,dist);
	// update = clamp(update + step(.5,dist),0.,1.);
	update *= step(.01,luminance(color.rgb));
	update = clamp(update,0.,1.);
	color = mix(loop, color, update);
	gl_FragColor = color;
}
