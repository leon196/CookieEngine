
uniform sampler2D frameBuffer;
uniform float fadeTransition;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frameBuffer, vUv);
	color.rgb *= fadeTransition;
	gl_FragColor = color;
}