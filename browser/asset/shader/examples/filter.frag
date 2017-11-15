
uniform sampler2D MeshesScene;
uniform sampler2D ParticlesScene;
uniform sampler2D GridScreenScene;
uniform sampler2D opticalFlow;
uniform sampler2D loopback;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

#define wave smoothstep(-.5,1.,sin(2.*time*PI2))

void main ()	{
	vec4 color = texture2D(ParticlesScene, vUv);
	vec4 feedback = texture2D(loopback, vUv);
	color = mix(feedback, color, color.a);
	gl_FragColor = color;
}
