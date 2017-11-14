
uniform sampler2D frameBuffer;
uniform sampler2D loopback;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frameBuffer, vUv);
	vec2 pixel = 1./resolution;
	vec2 uv = vUv;
	float a = noiseIQ(uv.xyy*10.)*PI2;
	// a += luminance(color.rgb)*PI2;
	uv += vec2(cos(a),sin(a))*pixel;
	uv += -normalize(uv-.5)*pixel;
	vec4 loop = texture2D(loopback, uv);

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.3,vignette);

	// color = loop * .9
	color = mix(loop, color, smoothstep(.2,.6,colorDistance(color,loop)));
	gl_FragColor = color;
}
