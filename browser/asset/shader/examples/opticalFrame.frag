
uniform sampler2D ExamplesScene;
uniform sampler2D GridScreenScene;
uniform sampler2D opticalFlow;
uniform sampler2D loopback;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = edge(ExamplesScene, vUv, resolution);
	// color = vec4(smoothstep(.4,.8,luminance(color.rgb)));
	gl_FragColor = color;
}
