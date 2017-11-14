
uniform sampler2D frameScene;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frameScene, vUv);

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.3,vignette);

	gl_FragColor = color;
}
