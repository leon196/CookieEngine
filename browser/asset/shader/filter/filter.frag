
uniform sampler2D frameBuffer;
uniform float fadeTransition;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frameBuffer, vUv);
	color.rgb *= fadeTransition;
	// color.rgb = ceil(color.rgb*8.)/8.;
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.3,vignette);
	// color.rgb *= .8 + .2 * rand(vUv);
	gl_FragColor = color;
}