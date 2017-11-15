
uniform sampler2D ExamplesScene;
uniform sampler2D GridScreenScene;
uniform sampler2D opticalFlow;
uniform sampler2D loopback;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(loopback, vUv);
	gl_FragColor = color;
}
